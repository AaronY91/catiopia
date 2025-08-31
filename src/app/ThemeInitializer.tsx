'use client';

import { useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { UserSettings } from '@/lib/types';

export default function ThemeInitializer() {
    useEffect(() => {
        const applyTheme = (theme: 'light' | 'dark') => {
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        const user = auth.currentUser;
        if (user && !user.isAnonymous) {
            getDoc(doc(db, 'users', user.uid, 'settings', 'preferences')).then((snap) => {
                if (snap.exists()) {
                    applyTheme((snap.data() as UserSettings).theme);
                } else {
                    applyTheme('light');
                }
            });
        } else {
            const saved = localStorage.getItem('settings');
            if (saved) {
                applyTheme((JSON.parse(saved) as UserSettings).theme);
            } else {
                applyTheme('light');
            }
        }
    }, []);

    return null;
}
