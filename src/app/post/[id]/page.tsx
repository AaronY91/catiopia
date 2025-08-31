'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
    collection,
    doc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { MediaItem, PostDoc } from '@/lib/types';
import Image from 'next/image';
import AuthorBadge from '@/components/AuthorBadge';
import LikeButton from '@/components/LikeButton';
import CommentSection from '@/components/CommentSection';

export default function PostDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostDoc | null>(null);

    useEffect(() => {
        if (!id) return;
        const unsub = onSnapshot(doc(db, 'posts', id), (snap) => {
            if (!snap.exists()) {
                setPost(null);
                return;
            }
            const raw = snap.data() as any;
            const createdAt = raw.createdAt?.toDate ? (raw.createdAt.toDate() as Date) : null;
            setPost({
                id: snap.id,
                title: raw.title as string,
                content: raw.content as string,
                author: raw.author as string,
                authorRole: raw.authorRole as '운영자' | '집사',
                media: (raw.media || []) as MediaItem[],
                thumbnailUrl: (raw.thumbnailUrl ?? null) as string | null,
                likeCount: 0,
                createdAt,
                uid: (raw.uid ?? null) as string | null,
            });
        });
        return () => unsub();
    }, [id]);

    if (!post) return <p>로딩중...</p>;

    return (
        <section>
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center mb-4">
                <span className="font-semibold">{post.author}</span>
                <AuthorBadge role={post.authorRole} />
            </div>

            {Array.isArray(post.media) && post.media.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                    {post.media.map((m) => (
                        <div key={m.path} className="card p-2 shadow">
                            {m.type === 'image' ? (
                                <Image
                                    src={m.url}
                                    alt="첨부"
                                    width={1200}
                                    height={800}
                                    className="w-full h-72 object-cover rounded"
                                />
                            ) : (
                                <video src={m.url} className="w-full h-72 object-cover rounded" controls />
                            )}
                        </div>
                    ))}
                </div>
            )}

            <p className="mb-6 whitespace-pre-wrap">{post.content}</p>

            <div className="mb-8">
                <LikeButton postId={post.id} />
            </div>

            <CommentSection postId={post.id} />
        </section>
    );
}
