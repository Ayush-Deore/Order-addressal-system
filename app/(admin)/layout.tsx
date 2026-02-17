import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Package, LogOut } from 'lucide-react';
import { SignOutButton } from '@/components/SignOutButton';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect('/login');
    if (session.user?.role !== 'ADMIN') redirect('/catalog'); // Double check

    return (
        <div className="min-h-screen bg-stone-100 flex font-sans">
            <aside className="w-64 bg-stone-900 text-white flex-shrink-0 flex flex-col p-6">
                <div className="mb-10">
                    <h1 className="text-xl font-bold tracking-wider">ADMIN PORTAL</h1>
                </div>

                <nav className="flex-1 space-y-2">
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-stone-800 rounded text-stone-200 hover:text-white">
                        <LayoutDashboard className="h-5 w-5" /> Orders
                    </Link>
                    <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-stone-400 hover:text-white hover:bg-stone-800 rounded">
                        <Package className="h-5 w-5" /> Products (Soon)
                    </Link>
                </nav>

                <div className="pt-6 border-t border-stone-800">
                    <SignOutButton />
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-stone-200 flex items-center justify-between px-8">
                    <h2 className="text-stone-500 text-sm">Welcome, {session.user?.name}</h2>
                </header>
                <main className="p-8 flex-1 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
