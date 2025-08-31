'use client';

import { useSettings } from '@/components/SettingsProvider';
import { ThemeMode, ViewMode } from '@/lib/types';

export default function SettingsPage() {
    const { settings, setTheme, setViewMode } = useSettings();

    const optionClass = (active: boolean) =>
        `px-4 py-2 rounded border transition cursor-pointer ${
            active
                ? 'bg-[var(--color-pastelBlue)] text-white border-[var(--color-pastelBlue)]'
                : 'bg-white dark:bg-[var(--color-card-dark)] border-gray-300 hover:border-[var(--color-pastelBlue)]'
        }`;

    return (
        <section className="max-w-md mx-auto card p-6 shadow">
            <h1 className="text-xl font-bold mb-2">설정</h1>
            <p className="text-sm text-gray-500 mb-6">변경 즉시 저장·반영됩니다</p>

            <div className="mb-6">
                <p className="font-semibold mb-2">테마</p>
                <div className="flex gap-2">
                    <button className={optionClass(settings.theme === 'light')} onClick={() => setTheme('light' as ThemeMode)}>라이트</button>
                    <button className={optionClass(settings.theme === 'dark')} onClick={() => setTheme('dark' as ThemeMode)}>다크</button>
                </div>
            </div>

            <div className="mb-6">
                <p className="font-semibold mb-2">뷰 모드</p>
                <div className="flex gap-2">
                    <button className={optionClass(settings.viewMode === 'board')} onClick={() => setViewMode('board' as ViewMode)}>게시판</button>
                    <button className={optionClass(settings.viewMode === 'gallery')} onClick={() => setViewMode('gallery' as ViewMode)}>갤러리</button>
                </div>
            </div>
        </section>
    );
}
