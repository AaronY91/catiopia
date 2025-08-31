'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MediaItem, PostDoc } from '@/lib/types';
import PostCard from '@/components/PostCard';
import WriteButton from '@/components/WriteButton';

export default function BoardPage() {
    const [posts, setPosts] = useState<PostDoc[]>([]);

    useEffect(() => {
        const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
        const unsub = onSnapshot(q, (snap) => {
            const data: PostDoc[] = snap.docs.map((doc) => {
                const raw = doc.data() as any;
                const createdAt = raw.createdAt?.toDate ? (raw.createdAt.toDate() as Date) : null;
                return {
                    id: doc.id,
                    title: raw.title as string,
                    content: raw.content as string,
                    author: raw.author as string, // '집사' 또는 '운영자'
                    authorRole: raw.authorRole as '운영자' | '집사',
                    media: (raw.media || []) as MediaItem[],
                    thumbnailUrl: (raw.thumbnailUrl ?? null) as string | null,
                    likeCount: 0,
                    createdAt,
                    uid: (raw.uid ?? null) as string | null,
                };
            });
            setPosts(data);
        });
        return () => unsub();
    }, []);

    return (
        <section>
            <h1 className="text-xl font-bold mb-4">최신 글</h1>
            <div className="grid gap-4">
                {posts.map((post) => (
                    <PostCard key={post.id} post={post} />
                ))}
            </div>
            <WriteButton />
        </section>
    );
}
