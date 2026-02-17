import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ShoppingCart, DoorOpen } from 'lucide-react';
import { SignOutButton } from '@/components/SignOutButton';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    if (!session) redirect('/login');

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
            <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/90 backdrop-blur-md">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link href="/catalog" className="flex items-center gap-2 text-xl font-light tracking-widest text-stone-900 uppercase">
                        <DoorOpen className="h-6 w-6" />
                        <span>Luxe Doors</span>
                    </Link>

                    <nav className="flex items-center gap-8">
                        <Link href="/catalog" className="text-xs font-semibold tracking-widest text-stone-500 hover:text-stone-900 transition-colors uppercase">
                            Catalog
                        </Link>
                        <Link href="/cart" className="relative group p-2">
                            <ShoppingCart className="h-5 w-5 text-stone-500 group-hover:text-stone-900 transition-colors" />
                        </Link>
                        <div className="h-4 w-px bg-stone-300"></div>
                        <div className="flex items-center gap-4">
                            <span className="text-xs text-stone-400 hidden md:block">{session.user?.email}</span>
                            <SignOutButton />
                        </div>
                    </nav>
                </div>
            </header>
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
}
