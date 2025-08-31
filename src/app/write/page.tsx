'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function WritePage() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const user = auth.currentUser;
    const router = useRouter();

    const operatorUIDs = ['운영자_UID_여기에'];

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) return;

        const isOperator = user && operatorUIDs.includes(user.uid);
        const authorName = isOperator ? '운영자' : '집사';

        await addDoc(collection(db, 'posts'), {
            title,
            content,
            author: authorName,
            createdAt: serverTimestamp(),
            uid: user?.uid || null,
        });

        router.push('/board');
    };

    return (
        <section className="max-w-2xl mx-auto p-4">
            <h1 className="text-xl font-bold mb-4">글쓰기</h1>
            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-4 rounded"
            />
            <textarea
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border p-2 mb-4 rounded h-40"
            />
            <button
                onClick={handleSubmit}
                className="bg-pastelBlue text-white dark:bg-pastelBlue-dark dark:text-siamBrown-dark px-4 py-2 rounded hover:bg-pastelPink dark:hover:bg-pastelPink-dark transition"
            >
                등록
            </button>
        </section>
    );
}
