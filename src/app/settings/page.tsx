'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { UserSettings } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
    const [settings, setSettings] = useState<UserSettings>({ theme: 'light', viewMode: 'board' });
    const user = auth.currentUser;
    const router = useRouter();

    useEffect(() => {
        if (user && !user.isAnonymous) {
            getDoc(doc(db, 'users', user.uid, 'settings', 'preferences')).then((snap) => {
                if (snap.exists()) {
                    const data = snap.data() as UserSettings;
                    setSettings(data);
                    applyTheme(data.theme);
                }
            });
        } else {
            const saved = localStorage.getItem('settings');
            if (saved) {
                const data = JSON.parse(saved) as UserSettings;
                setSettings(data);
                applyTheme(data.theme);
            }
        }
    }, [user]);

    const applyTheme = (theme: 'light' | 'dark') => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    const saveSettings = async (newSettings: UserSettings) => {
        setSettings(newSettings);
        if (user && !user.isAnonymous) {
            await setDoc(doc(db, 'users', user.uid, 'settings', 'preferences'), newSettings);
        } else {
            localStorage.setItem('settings', JSON.stringify(newSettings));
        }
    };

    const handleThemeChange = (theme: 'light' | 'dark') => {
        const updated = { ...settings, theme };
        applyTheme(theme);
        saveSettings(updated);
    };

    const handleViewModeChange = (viewMode: 'board' | 'gallery') => {
        const updated = { ...settings, viewMode };
        saveSettings(updated);
        router.push(viewMode === 'board' ? '/board' : '/gallery');
    };

    const optionClass = (isActive: boolean) =>
        `px-4 py-2 rounded border transition cursor-pointer ${
            isActive
                ? 'bg-pastelBlue text-white dark:bg-pastelBlue-dark dark:text-siamBrown-dark border-pastelBlue'
                : 'bg-white dark:bg-[var(--color-card-dark)] text-siamBrown dark:text-siamBrown-dark border-gray-300 hover:border-pastelBlue'
        }`;

    return (
        <section className="max-w-md mx-auto bg-white dark:bg-[var(--color-card-dark)] p-6 rounded shadow">
            <h1 className="text-xl font-bold mb-6">설정</h1>
            <p className="text-sm text-gray-500 mb-6">변경 즉시 저장됩니다</p>

            {/* 테마 선택 */}
            <div className="mb-6">
                <p className="font-semibold mb-2">테마</p>
                <div className="flex gap-2">
                    <label className={optionClass(settings.theme === 'light')}>
                        <input
                            type="radio"
                            name="theme"
                            value="light"
                            checked={settings.theme === 'light'}
                            onChange={() => handleThemeChange('light')}
                            className="hidden"
                        />
                        라이트
                    </label>
                    <label className={optionClass(settings.theme === 'dark')}>
                        <input
                            type="radio"
                            name="theme"
                            value="dark"
                            checked={settings.theme === 'dark'}
                            onChange={() => handleThemeChange('dark')}
                            className="hidden"
                        />
                        다크
                    </label>
                </div>
            </div>

            {/* 뷰 모드 선택 */}
            <div className="mb-6">
                <p className="font-semibold mb-2">뷰 모드</p>
                <div className="flex gap-2">
                    <label className={optionClass(settings.viewMode === 'board')}>
                        <input
                            type="radio"
                            name="viewMode"
                            value="board"
                            checked={settings.viewMode === 'board'}
                            onChange={() => handleViewModeChange('board')}
                            className="hidden"
                        />
                        게시판
                    </label>
                    <label className={optionClass(settings.viewMode === 'gallery')}>
                        <input
                            type="radio"
                            name="viewMode"
                            value="gallery"
                            checked={settings.viewMode === 'gallery'}
                            onChange={() => handleViewModeChange('gallery')}
                            className="hidden"
                        />
                        갤러리
                    </label>
                </div>
            </div>
        </section>
    );
}
