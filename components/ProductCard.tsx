import Link from 'next/link';
import type { Product } from '@prisma/client';

export function ProductCard({ product }: { product: Product }) {
    // Safe access for images
    const image = product.images && product.images.length > 0 ? product.images[0] : null;

    return (
        <Link href={`/products/${product.id}`} className="group block bg-white border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-[3/4] w-full bg-stone-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 bg-stone-100">
                    {image ? (
                        // In a real app, use next/image. For now, simple img tag for local/external urls.
                        // If using local file, ensure it exists in public folder.
                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-sm">No Image</span>
                    )}
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-stone-900/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-white text-sm font-medium">View Details</p>
                </div>
            </div>
            <div className="p-4">
                <p className="text-xs text-stone-500 uppercase tracking-wider">{product.designCode}</p>
                <h3 className="text-lg font-medium text-stone-900 mt-1">{product.name}</h3>
                <p className="text-sm text-stone-500 mt-1">{product.category} • {product.material[0] || 'Standard'}</p>
            </div>
        </Link>
    );
}
