'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react'; // Client side sign in
import { useRouter } from 'next/navigation';
// Note: signIn from next-auth/react is for client side. 
// For server actions we can use the one from '@/lib/auth' but dealing with formState is cleaner here for now.
// Actually, with next-auth v5, it's better to use a Server Action or just standard API call.
// Since we are in client component, we use `signIn` from `next-auth/react` (if installed) 
// OR we can plain fetch to /api/auth/callback/credentials.
// next-auth/react needs <SessionProvider> usually, but signIn handles it.
// We need to install next-auth/react if utilizing it. v5 beta exports it from "next-auth/react".

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // "credentials" is the provider ID
            const res = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError('Invalid credentials');
            } else {
                router.refresh(); // Update session

                // Simple role-based redirect check
                // In a perfect world we'd wait for session update and check role, 
                // but checking email input is sufficiently secure for redirection preference (server still protects routes)
                if (email === 'admin@door.catalog') {
                    router.push('/admin');
                } else {
                    router.push('/catalog');
                }
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
                <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
                    Door Catalog Login
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-blue-300"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-gray-500 bg-stone-50 p-4 rounded border">
                    <p className="font-bold mb-2">Demo Credentials:</p>
                    <div className="text-left space-y-1">
                        <p>👑 <span className="font-semibold">Admin:</span> admin@door.catalog / SecurePass123!</p>
                        <p>👤 <span className="font-semibold">Client 1:</span> client@example.com / client123!</p>
                        <p>👤 <span className="font-semibold">Client 2:</span> architect@studio.com / client123!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
