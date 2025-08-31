'use client';

import Link from 'next/link';

export default function WriteButton() {
    return (
        <Link
            href="/write"
            className="fixed bottom-6 right-6 z-50
      flex items-center justify-center
      w-14 h-14 rounded-full shadow-lg
      bg-[var(--color-pastelBlue)] text-white
      hover:bg-[var(--color-pastelPink)]
      transition-colors"
            title="글쓰기"
            aria-label="글쓰기"
        >
            ✏️
        </Link>
    );
}
