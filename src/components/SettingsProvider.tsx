'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { ThemeMode, UserSettings, ViewMode } from '@/lib/types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { usePathname, useRouter } from 'next/navigation';

type Ctx = {
    user: User | null;
    settings: UserSettings;
    setTheme: (t: ThemeMode, save?: boolean) => void;
    setViewMode: (v: ViewMode, save?: boolean) => void;
};

const SettingsContext = createContext<Ctx | null>(null);
export const useSettings = () => {
    const ctx = useContext(SettingsContext);
    if (!ctx) throw new Error('SettingsContext not found');
    return ctx;
};

const defaultSettings: UserSettings = { theme: 'light', viewMode: 'board' };

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [settings, setSettings] = useState<UserSettings>(defaultSettings);
    const router = useRouter();
    const pathname = usePathname();

    const applyTheme = (theme: ThemeMode) => {
        if (theme === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
    };

    const saveLocal = (s: UserSettings) => localStorage.setItem('settings', JSON.stringify(s));
    const saveRemote = async (uid: string, s: UserSettings) =>
        setDoc(doc(db, 'users', uid, 'settings', 'preferences'), s, { merge: true });

    const setTheme = (t: ThemeMode, save = true) => {
        const next = { ...settings, theme: t };
        setSettings(next);
        applyTheme(t);
        if (save) {
            if (user && !user.isAnonymous) saveRemote(user.uid, next);
            else saveLocal(next);
        }
    };

    const setViewMode = (v: ViewMode, save = true) => {
        const next = { ...settings, viewMode: v };
        setSettings(next);
        if (save) {
            if (user && !user.isAnonymous) saveRemote(user.uid, next);
            else saveLocal(next);
        }
        if (pathname === '/' || pathname === '/board' || pathname === '/gallery') {
            router.push(v === 'gallery' ? '/gallery' : '/board');
        }
    };

    useEffect(() => {
        const saved = localStorage.getItem('settings');
        if (saved) {
            const s = JSON.parse(saved) as UserSettings;
            setSettings(s);
            applyTheme(s.theme);
        } else {
            applyTheme(settings.theme);
        }
    }, []);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (u) => {
            setUser(u);
            if (u && !u.isAnonymous) {
                const snap = await getDoc(doc(db, 'users', u.uid, 'settings', 'preferences'));
                if (snap.exists()) {
                    const s = snap.data() as UserSettings;
                    setSettings(s);
                    applyTheme(s.theme);
                    if (pathname === '/') {
                        router.push(s.viewMode === 'gallery' ? '/gallery' : '/board');
                    }
                }
            }
        });
        return () => unsub();
    }, [pathname, router]);

    const value = useMemo(() => ({ user, settings, setTheme, setViewMode }), [user, settings]);
    return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}
