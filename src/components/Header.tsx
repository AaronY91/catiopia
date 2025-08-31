'use client';

import Link from 'next/link';
import { googleLogin, anonLogin, logout } from '@/lib/firebase';
import { useSettings } from '@/components/SettingsProvider';

export default function Header() {
    const { user, settings, setTheme, setViewMode } = useSettings();

    return (
        <header className="flex items-center justify-between p-4 bg-white text-[var(--color-siamBrown)] dark:bg-[var(--color-card-dark)] dark:text-[var(--color-siamBrown-dark)] shadow-md">
            <Link href="/" className="flex flex-col leading-tight">
                <span className="flex items-center gap-2 font-bold text-lg">🐾 Catiopia</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">캣티오피아 집사 종합 플랫폼</span>
            </Link>

            <nav className="flex gap-3 items-center">
                <Link href="/board" className="hover:text-[var(--color-pastelBlue)]">게시판</Link>
                <Link href="/gallery" className="hover:text-[var(--color-pastelBlue)]">갤러리</Link>
                <Link href="/write" className="hover:text-[var(--color-pastelBlue)]">글쓰기</Link>
                <Link href="/settings" className="hover:text-[var(--color-pastelBlue)]">설정</Link>

                <select
                    className="text-sm border px-2 py-1 rounded"
                    value={settings.viewMode}
                    onChange={(e) => setViewMode(e.target.value as any, true)}
                    title="보기 모드"
                >
                    <option value="board">게시판</option>
                    <option value="gallery">갤러리</option>
                </select>

                <button
                    onClick={() => setTheme(settings.theme === 'dark' ? 'light' : 'dark')}
                    className="text-sm border px-2 py-1 rounded hover:border-[var(--color-pastelBlue)]"
                >
                    테마 토글
                </button>

                {!user ? (
                    <>
                        <button onClick={googleLogin} className="text-sm border px-2 py-1 rounded hover:border-[var(--color-pastelBlue)]">구글 로그인</button>
                        <button onClick={anonLogin} className="text-sm border px-2 py-1 rounded hover:border-[var(--color-pastelBlue)]">익명</button>
                    </>
                ) : (
                    <button onClick={logout} className="text-sm text-red-500 hover:underline">로그아웃</button>
                )}
            </nav>
        </header>
    );
}
