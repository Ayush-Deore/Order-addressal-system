import Link from 'next/link';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    redirect('/catalog');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-stone-950 text-white">
      <div className="text-center">
        <h1 className="text-6xl font-light tracking-widest uppercase">Luxe Doors</h1>

        <div className="mt-12">
          <Link
            href="/login"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-none border border-stone-600 px-8 py-3 text-sm font-medium text-stone-300 transition-all hover:bg-stone-800 hover:text-white"
          >
            <span className="mr-2">ENTER PORTAL</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
      <footer className="absolute bottom-8 text-xs text-stone-600">
       Private Access Only.
      </footer>
    </main>
  );
}
