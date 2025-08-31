// lib/posts.ts
import { db } from '@/lib/firebase';
import { Post } from '@/lib/types';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment } from 'firebase/firestore';

export const listenPosts = (callback: (posts: Post[]) => void) => {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snapshot) => {
        const data: Post[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Post, 'id'>),
        }));
        callback(data);
    });
};

export const likePost = async (postId: string) => {
    const postRef = doc(db, 'posts', postId);
    await updateDoc(postRef, { likes: increment(1) });
};
