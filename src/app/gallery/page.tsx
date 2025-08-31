'use client';

import { useEffect, useState } from 'react';
import { listenPosts } from '@/lib/posts';
import Link from 'next/link';
import Image from 'next/image';
import WriteButton from '@/components/WriteButton';

export default function GalleryPage() {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const unsub = listenPosts(setPosts);
        return () => unsub();
    }, []);

    return (
        <main className="max-w-6xl mx-auto p-4">
            <section className="max-w-5xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">썸네일 뷰 🖼️</h1>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {posts.map((post) => (
                        <Link key={post.id} href={`/post/${post.id}`} className="block">
                            <div className="relative w-full aspect-square bg-white dark:bg-[color:var(--color-card-dark)] rounded-lg shadow hover:shadow-lg hover:scale-105 transition overflow-hidden">
                                {post.imageUrl ? (
                                    <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No Image
                                    </div>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
                <WriteButton/>
            </section>
        </main>
    );
}
