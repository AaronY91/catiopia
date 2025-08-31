'use client';

import { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuid } from 'uuid';
import Image from 'next/image';
import { MediaItem } from '@/lib/types';

export default function MediaUploader({
                                          value,
                                          onChange,
                                          onThumbnailPick,
                                          thumbnailUrl,
                                      }: {
    value: MediaItem[];
    onChange: (files: MediaItem[]) => void;
    onThumbnailPick?: (url: string) => void;
    thumbnailUrl?: string | null;
}) {
    const [queue, setQueue] = useState<File[]>([]);
    const [progress, setProgress] = useState<Record<string, number>>({});

    const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setQueue((prev) => [...prev, ...files]);
    };

    useEffect(() => {
        if (queue.length === 0) return;

        const file = queue[0];
        const id = uuid();
        const ext = (file.name.split('.').pop() || '').toLowerCase();
        const isImage = /^(png|jpg|jpeg|gif|webp|avif)$/.test(ext);
        const isVideo = /^(mp4|mov|webm)$/.test(ext);
        if (!isImage && !isVideo) {
            setQueue((q) => q.slice(1));
            return;
        }

        const folder = isImage ? 'images' : 'videos';
        const path = `${folder}/${id}.${ext}`;
        const storageRef = ref(storage, path);
        const task = uploadBytesResumable(storageRef, file);

        task.on(
            'state_changed',
            (snap) => {
                const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                setProgress((p) => ({ ...p, [id]: pct }));
            },
            () => setQueue((q) => q.slice(1)),
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                const item: MediaItem = { url, type: isImage ? 'image' : 'video', path };
                const next = [...value, item];
                onChange(next);
                if (!thumbnailUrl && isImage && onThumbnailPick) onThumbnailPick(url);
                setQueue((q) => q.slice(1));
            }
        );
    }, [queue, value, onChange, onThumbnailPick, thumbnailUrl]);

    const removeItem = (path: string) => {
        onChange(value.filter((v) => v.path !== path));
    };

    return (
        <div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:border-[var(--color-pastelBlue)] cursor-pointer">
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onPick} />
                파일 선택 (이미지/영상)
            </label>

            {Object.keys(progress).length > 0 && (
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                    {Object.entries(progress).map(([k, v]) => (
                        <div key={k}>{v}% 업로드 중…</div>
                    ))}
                </div>
            )}

            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                {value.map((m) => (
                    <div key={m.path} className="card p-2 shadow">
                        {m.type === 'image' ? (
                            <Image
                                src={m.url}
                                alt="첨부 이미지"
                                width={400}
                                height={300}
                                className="w-full h-32 object-cover rounded"
                            />
                        ) : (
                            <video src={m.url} className="w-full h-32 object-cover rounded" controls />
                        )}
                        <div className="mt-2 flex items-center justify-between">
                            <button className="text-xs text-red-500 hover:underline" onClick={() => removeItem(m.path)}>제거</button>
                            {m.type === 'image' && onThumbnailPick && (
                                <button
                                    className={`text-xs px-2 py-0.5 rounded border ${
                                        thumbnailUrl === m.url ? 'bg-[var(--color-pastelBlue)] text-white' : 'hover:border-[var(--color-pastelBlue)]'
                                    }`}
                                    onClick={() => onThumbnailPick(m.url)}
                                >
                                    썸네일 지정
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
