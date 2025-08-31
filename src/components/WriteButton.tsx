'use client';

import Link from 'next/link';

export default function WriteButton() {
    return (
        <Link
            href="/write"
            className="fixed bottom-6 right-6 z-50
        flex items-center justify-center
        w-14 h-14 rounded-full shadow-lg
        bg-pastelBlue text-white
        dark:bg-pastelBlue-dark dark:text-siamBrown-dark
        hover:bg-pastelPink dark:hover:bg-pastelPink-dark
        transition-colors duration-200"
            title="글쓰기"
        >
            ✏️
        </Link>
    );
}
