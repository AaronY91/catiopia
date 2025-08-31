'use client';

import { useEffect, useMemo, useState } from 'react';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AuthorBadge from './AuthorBadge';

type C = {
    id: string;
    text: string;
    author: '운영자' | '집사';
    authorRole: '운영자' | '집사';
    parentId?: string | null;
    createdAt?: any;
};

export default function CommentSection({ postId }: { postId: string }) {
    const [text, setText] = useState('');
    const [comments, setComments] = useState<C[]>([]);
    const [replyTo, setReplyTo] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
        const unsub = onSnapshot(q, (snap) => {
            setComments(snap.docs.map(d => ({ id: d.id, ...d.data() } as C)));
        });
        return () => unsub();
    }, [postId]);

    const roots = useMemo(() => comments.filter(c => !c.parentId), [comments]);
    const childrenByParent = useMemo(() => {
        const map: Record<string, C[]> = {};
        for (const c of comments) {
            if (!c.parentId) continue;
            map[c.parentId] = map[c.parentId] || [];
            map[c.parentId].push(c);
        }
        return map;
    }, [comments]);

    const submit = async () => {
        if (!text.trim()) return;
        await addDoc(collection(db, 'posts', postId, 'comments'), {
            text,
            author: '집사',
            authorRole: '집사',
            parentId: replyTo || null,
            createdAt: serverTimestamp(),
        });
        setText('');
        setReplyTo(null);
    };

    return (
        <section className="mt-8">
            <h2 className="text-lg font-bold mb-2">댓글</h2>

            <div className="mb-3">
                {replyTo && (
                    <div className="mb-2 text-sm">
                        대댓글 대상: <span className="font-mono">{replyTo}</span>
                        <button className="ml-2 text-xs text-red-500 hover:underline" onClick={() => setReplyTo(null)}>취소</button>
                    </div>
                )}
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full border p-2 rounded"
                    placeholder="댓글을 입력하세요"
                />
                <button onClick={submit} className="mt-2 px-3 py-1 rounded bg-[var(--color-pastelBlue)] text-white hover:bg-[var(--color-pastelPink)]">등록</button>
            </div>

            <div className="space-y-3">
                {roots.map((c) => (
                    <div key={c.id} className="card p-3 shadow">
                        <div className="flex items-center mb-1">
                            <span className="font-semibold">{c.author}</span>
                            <AuthorBadge role={c.authorRole} />
                        </div>
                        <p className="mb-2">{c.text}</p>
                        <button className="text-xs hover:underline" onClick={() => setReplyTo(c.id)}>답글</button>

                        {(childrenByParent[c.id] || []).length > 0 && (
                            <div className="mt-2 pl-4 border-l space-y-2">
                                {childrenByParent[c.id].map(ch => (
                                    <div key={ch.id}>
                                        <div className="flex items-center mb-1">
                                            <span className="font-semibold">{ch.author}</span>
                                            <AuthorBadge role={ch.authorRole} />
                                        </div>
                                        <p>{ch.text}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
