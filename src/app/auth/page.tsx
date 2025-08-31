'use client';

import { useEffect, useState } from 'react';
import { loginWithGoogle, loginAnonymously, logout } from '@/lib/auth';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function AuthPage() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, setUser);
        return () => unsub();
    }, []);

    return (
        <div className="max-w-md mx-auto p-4 bg-white dark:bg-cream-dark shadow rounded">
            <h1 className="text-xl font-bold mb-4">로그인</h1>

            {user ? (
                <div>
                    <p className="mb-4">
                        현재 로그인: {user.isAnonymous ? '익명' : user.displayName || user.email}
                    </p>
                    <button
                        onClick={logout}
                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
                    >
                        로그아웃
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    <button
                        onClick={loginWithGoogle}
                        className="w-full bg-pastelBlue text-white py-2 rounded hover:bg-pastelPink transition"
                    >
                        Google 계정으로 로그인
                    </button>
                    <button
                        onClick={loginAnonymously}
                        className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition"
                    >
                        익명으로 로그인
                    </button>
                </div>
            )}
        </div>
    );
}
