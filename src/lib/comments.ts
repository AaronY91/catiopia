// lib/comments.ts
import { db } from '@/lib/firebase';
import { Comment } from '@/lib/types';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

export const listenComments = (postId: string, callback: (comments: Comment[]) => void) => {
    const q = query(collection(db, 'posts', postId, 'comments'), orderBy('createdAt', 'asc'));
    return onSnapshot(q, (snapshot) => {
        const data: Comment[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Comment, 'id'>),
        }));
        callback(data);
    });
};

export const addComment = async (
    postId: string,
    author: string,
    text: string,
    parentId: string | null = null
) => {
    await addDoc(collection(db, 'posts', postId, 'comments'), {
        author,
        text,
        parentId,
        createdAt: serverTimestamp(),
    });
};
