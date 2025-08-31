'use client';

import { useEffect, useState } from 'react';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MediaItem, PostDoc } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';
import AuthorBadge from '@/components/AuthorBadge';
import WriteButton from '@/components/WriteButton';

export default function GalleryPage() {
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
                    author: raw.author as string,
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
            <h1 className="text-xl font-bold mb-4">갤러리</h1>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {posts.map((post) => {
                    const thumb = post.thumbnailUrl || post.media?.[0]?.url || null;
                    const isVideo =
                        !!thumb && post.media.find((m: MediaItem) => m.url === thumb)?.type === 'video';
                    return (
                        <Link
                            key={post.id}
                            href={`/post/${post.id}`}
                            className="card shadow hover:shadow-lg transition overflow-hidden"
                        >
                            {thumb ? (
                                isVideo ? (
                                    <video src={thumb} className="w-full aspect-[4/3] object-cover" muted playsInline />
                                ) : (
                                    <Image
                                        src={thumb}
                                        alt={post.title || '썸네일'}
                                        width={800}
                                        height={600}
                                        className="w-full aspect-[4/3] object-cover"
                                    />
                                )
                            ) : (
                                <div className="w-full aspect-[4/3] bg-gray-100 dark:bg-black/20" />
                            )}
                            <div className="p-2">
                                <div className="text-sm font-medium line-clamp-1">{post.title}</div>
                                <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                                    <span>{post.author}</span>
                                    <AuthorBadge role={post.authorRole} />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
            <WriteButton />
        </section>
    );
}
