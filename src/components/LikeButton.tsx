'use client';

import { useEffect, useState } from 'react';
import { collection, deleteDoc, doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getDeviceId } from '@/lib/utils';

export default function LikeButton({ postId }: { postId: string }) {
    const [count, setCount] = useState(0);
    const [liked, setLiked] = useState(false);
    const deviceId = getDeviceId();

    useEffect(() => {
        const likesRef = collection(db, 'posts', postId, 'likes');
        const unsub = onSnapshot(likesRef, (snap) => {
            setCount(snap.size);
            setLiked(snap.docs.some((d) => d.id === deviceId));
        });
        return () => unsub();
    }, [postId, deviceId]);

    const toggle = async () => {
        const ref = doc(db, 'posts', postId, 'likes', deviceId);
        if (liked) await deleteDoc(ref);
        else await setDoc(ref, { at: Date.now() });
    };

    return (
        <button
            onClick={toggle}
            className={`px-3 py-1 rounded border text-sm ${liked ? 'bg-[var(--color-pastelPink)] text-white' : 'hover:border-[var(--color-pastelBlue)]'}`}
            aria-pressed={liked}
        >
            ❤️ {count}
        </button>
    );
}
