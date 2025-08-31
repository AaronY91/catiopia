'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthorBadge from '@/components/AuthorBadge';
import WriteButton from '@/components/WriteButton';

export default function BoardPage() {
    const [posts, setPosts] = useState<any[]>([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
            const snap = await getDocs(q);
            setPosts(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPosts();
    }, []);

    return (
        <main className="max-w-4xl mx-auto p-4">
            {posts.map((post) => (
                <Link key={post.id} href={`/post/${post.id}`} className="block p-4 bg-white dark:bg-[var(--color-card-dark)] rounded-lg shadow hover:shadow-lg transition">
                    <h2 className="font-bold text-lg">{post.title}</h2>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <span>{post.author}</span>
                        <AuthorBadge role={post.author === '운영자' ? '운영자' : '집사'} />
                    </div>
                    <p className="mt-2 text-siamBrown line-clamp-2">{post.content}</p>
                </Link>
            ))}
            <WriteButton />
        </main>
    );
}
