'use client';

import { useState } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { getOperatorUIDs } from '@/lib/utils';
import MediaUploader from '@/components/MediaUploader';
import { MediaItem, PostDoc } from '@/lib/types';
import { useRouter } from 'next/navigation';

export default function WritePage() {
    const [title, setTitle] = useState<string>('');
    const [content, setContent] = useState<string>('');
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
    const [saving, setSaving] = useState<boolean>(false);
    const router = useRouter();

    const submit = async () => {
        if (!title.trim() || !content.trim()) return;
        setSaving(true);
        try {
            const u = auth.currentUser;
            const isOp = !!u && getOperatorUIDs().includes(u.uid);
            const authorRole = isOp ? '운영자' : '집사';

            const docRef = await addDoc(collection(db, 'posts'), {
                title,
                content,
                author: authorRole, // 표시명은 역할명 그대로 사용
                authorRole,
                media,
                thumbnailUrl: thumbnailUrl || (media.find((m) => m.type === 'image')?.url ?? null),
                createdAt: serverTimestamp(),
                uid: u?.uid ?? null,
            });

            router.push(`/post/${docRef.id}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <section className="max-w-2xl mx-auto">
            <h1 className="text-xl font-bold mb-4">글쓰기</h1>

            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-3 rounded"
            />

            <textarea
                placeholder="내용"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border p-2 mb-3 rounded h-40"
            />

            <div className="mb-4">
                <MediaUploader
                    value={media}
                    onChange={setMedia}
                    thumbnailUrl={thumbnailUrl}
                    onThumbnailPick={setThumbnailUrl}
                />
            </div>

            <div className="mb-6 text-sm text-gray-600">
                - 첫 번째 이미지가 자동으로 썸네일이 됩니다. 원하면 “썸네일 지정” 버튼으로 변경하세요.
            </div>

            <button
                onClick={submit}
                disabled={saving}
                className="px-4 py-2 rounded bg-[var(--color-pastelBlue)] text-white hover:bg-[var(--color-pastelPink)] disabled:opacity-60"
            >
                {saving ? '저장 중…' : '등록'}
            </button>
        </section>
    );
}
