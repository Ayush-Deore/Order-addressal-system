import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { AddToCartForm } from '@/components/AddToCartForm';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import type { Metadata } from 'next';

// Handle async params for Next.js 15+
type Props = {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });
    return {
        title: product ? `${product.name} - Luxe Doors` : 'Product Not Found',
    };
}

export default async function ProductPage({ params }: Props) {
    const { id } = await params;
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
        notFound();
    }

    const image = product.images[0];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="mb-6">
                <Link href="/catalog" className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-sm">
                    <ArrowLeft className="h-4 w-4" /> Back to Catalog
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Gallery Section */}
                <div className="space-y-4">
                    <div className="aspect-[3/4] w-full bg-stone-100 flex items-center justify-center rounded-lg overflow-hidden border border-stone-200">
                        {image ? (
                            <img src={image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <p className="text-stone-400">No Image Available</p>
                        )}
                    </div>
                    {/* Thumbnails could go here */}
                </div>

                {/* Info & Config Section */}
                <div>
                    <div className="mb-8 border-b border-stone-200 pb-8">
                        <p className="text-stone-500 text-sm uppercase tracking-wider mb-2">{product.category} • {product.designCode}</p>
                        <h1 className="text-4xl font-light text-stone-900 mb-4">{product.name}</h1>
                        <div className="flex gap-2 mb-4">
                            {product.finish.map(f => (
                                <span key={f} className="bg-stone-100 text-stone-600 px-2 py-1 text-xs rounded uppercase">{f}</span>
                            ))}
                        </div>
                        <p className="text-stone-600 leading-relaxed">{product.description}</p>
                    </div>

                    <AddToCartForm product={product} />
                </div>
            </div>
        </div>
    );
}
