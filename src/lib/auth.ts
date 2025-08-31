import { auth } from '@/lib/firebase';
import {
    GoogleAuthProvider,
    signInWithPopup,
    signInAnonymously,
    signOut,
} from 'firebase/auth';

export const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
};

export const loginAnonymously = async () => {
    await signInAnonymously(auth);
};

export const logout = async () => {
    await signOut(auth);
};
