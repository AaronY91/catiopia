'use client';

import Link from 'next/link';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { UserSettings } from '@/lib/types';
import { useRouter } from 'next/navigation';
import CatLogo from './CatLogo';
import { logout } from '@/lib/auth';

export default function Header() {
    const [user, setUser] = useState<any>(null);
    const router = useRouter();

    const applyTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            let settings: UserSettings | null = null;

            if (currentUser && !currentUser.isAnonymous) {
                const snap = await getDoc(doc(db, 'users', currentUser.uid, 'settings', 'preferences'));
                if (snap.exists()) settings = snap.data() as UserSettings;
            } else {
                const saved = localStorage.getItem('settings');
                if (saved) settings = JSON.parse(saved) as UserSettings;
            }

            if (settings) {
                applyTheme(settings.theme);
                if ((router as any).pathname === '/') {
                    router.push(settings.viewMode === 'gallery' ? '/gallery' : '/board');
                }
            } else {
                applyTheme('light');
            }
        });

        return () => unsub();
    }, []);

    return (
        <header className="flex items-center justify-between p-4 bg-white text-siamBrown dark:bg-[var(--color-card-dark)] dark:text-siamBrown-dark shadow-md">
            <Link href="/" className="flex flex-col leading-tight">
        <span className="flex items-center gap-2 font-bold text-lg">
          <CatLogo size={28} />
          Catiopia
        </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
          캣티오피아 집사 종합 플랫폼
        </span>
            </Link>

            <nav className="flex gap-4 items-center">
                <Link href="/settings" className="hover:text-pastelBlue dark:hover:text-pastelBlue-dark font-medium">
                    설정
                </Link>
                {user ? (
                    <>
            <span className="text-sm font-medium">
              {user.isAnonymous ? '익명' : '집사'}
            </span>
                        <button onClick={logout} className="text-red-500 hover:underline font-medium">
                            로그아웃
                        </button>
                    </>
                ) : (
                    <Link href="/auth" className="text-pastelBlue hover:underline dark:text-pastelBlue-dark font-medium">
                        로그인
                    </Link>
                )}
            </nav>
        </header>
    );
}
