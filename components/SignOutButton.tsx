'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 w-full px-4 py-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition-all"
        >
            <LogOut className="h-5 w-5" />
            <span>Log Out</span>
        </button>
    )
}
