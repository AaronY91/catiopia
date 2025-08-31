'use client';

import { useEffect, useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { v4 as uuid } from 'uuid';

type Uploaded = { url: string; type: 'image' | 'video'; path: string };

export default function MediaUploader({
                                          value,
                                          onChange,
                                      }: {
    value: Uploaded[];
    onChange: (files: Uploaded[]) => void;
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
        const ext = file.name.split('.').pop()?.toLowerCase();
        const isImage = /^(png|jpg|jpeg|gif|webp)$/.test(ext || '');
        const isVideo = /^(mp4|mov|webm)$/.test(ext || '');

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
            () => {
                // 실패 시 그냥 스킵
                setQueue((q) => q.slice(1));
            },
            async () => {
                const url = await getDownloadURL(task.snapshot.ref);
                onChange([...value, { url, type: isImage ? 'image' : 'video', path }]);
                setQueue((q) => q.slice(1));
            }
        );
    }, [queue]);

    const removeItem = (path: string) => {
        onChange(value.filter((v) => v.path !== path));
    };

    return (
        <div>
            <label className="inline-flex items-center gap-2 px-3 py-2 rounded border border-gray-300 hover:border-blue-400 cursor-pointer">
                <input type="file" accept="image/*,video/*" multiple className="hidden" onChange={onPick} />
                파일 선택 (이미지/영상)
            </label>

            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-3">
                {value.map((m) => (
                    <div key={m.path} className="card p-2 shadow">
                        {m.type === 'image' ? (
                            <img src={m.url} alt="첨부 이미지" className="w-full h-32 object-cover rounded" />
                        ) : (
                            <video src={m.url} className="w-full h-32 object-cover rounded" controls />
                        )}
                        <button
                            className="mt-2 text-xs text-red-500 hover:underline"
                            onClick={() => removeItem(m.path)}
                        >
                            제거
                        </button>
                    </div>
                ))}
            </div>

            {Object.keys(progress).length > 0 && (
                <div className="mt-2 space-y-1">
                    {Object.entries(progress).map(([k, v]) => (
                        <div key={k} className="text-sm text-gray-600">{v}% 업로드 중…</div>
                    ))}
                </div>
            )}
        </div>
    );
}
