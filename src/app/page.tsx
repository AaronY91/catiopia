'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSettings } from '@/components/SettingsProvider';

export default function Home() {
    const { settings } = useSettings();
    const router = useRouter();

    useEffect(() => {
        router.replace(settings.viewMode === 'gallery' ? '/gallery' : '/board');
    }, [settings.viewMode, router]);

    return null;
}
