'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, doc, getDoc, getDocs, orderBy, query } from 'firebase/firestore';
import AuthorBadge from '@/components/AuthorBadge';

export default function PostDetailPage() {
    const { id } = useParams();
    const [post, setPost] = useState<any>(null);
    const [comments, setComments] = useState<any[]>([]);

    useEffect(() => {
        const fetchPost = async () => {
            const snap = await getDoc(doc(db, 'posts', id as string));
            if (snap.exists()) setPost({ id: snap.id, ...snap.data() });
        };
        const fetchComments = async () => {
            const q = query(collection(db, 'posts', id as string, 'comments'), orderBy('createdAt', 'asc'));
            const snap = await getDocs(q);
            setComments(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };
        fetchPost();
        fetchComments();
    }, [id]);

    if (!post) return <p>로딩중...</p>;

    return (
        <section className="max-w-3xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <div className="flex items-center mb-4">
                <span className="font-semibold">{post.author}</span>
                <AuthorBadge role={post.author === '운영자' ? '운영자' : '집사'} />
            </div>
            <p className="mb-8">{post.content}</p>

            <h2 className="text-lg font-bold mb-2">댓글</h2>
            {comments.map((c) => (
                <div key={c.id} className="bg-cream dark:bg-[var(--color-card-dark)] border border-pastelBlue dark:border-pastelBlue-dark p-2 rounded mb-2">
                    <div className="flex items-center mb-1">
                        <span className="font-semibold">{c.author}</span>
                        <AuthorBadge role={c.author === '운영자' ? '운영자' : '집사'} />
                    </div>
                    <p>{c.text}</p>
                </div>
            ))}
        </section>
    );
}
