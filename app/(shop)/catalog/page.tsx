import { prisma } from '@/lib/prisma';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const { category, q: search } = await searchParams;

    const catFilter = typeof category === 'string' ? category : undefined;
    const searchFilter = typeof search === 'string' ? search : undefined;

    const where: Prisma.ProductWhereInput = { isActive: true };
    if (catFilter) where.category = catFilter;
    if (searchFilter) {
        where.OR = [
            { name: { contains: searchFilter, mode: 'insensitive' } },
            { designCode: { contains: searchFilter, mode: 'insensitive' } },
        ];
    }

    const products = await prisma.product.findMany({
        where,
        orderBy: { createdAt: 'desc' },
    });

    // Get unique categories for filter
    const allCategories = await prisma.product.findMany({
        select: { category: true },
        distinct: ['category']
    }).then(res => res.map(p => p.category));

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-light text-stone-900 uppercase tracking-widest">Catalog</h1>

                <form className="flex gap-2">
                    <select
                        name="category"
                        defaultValue={catFilter}
                        className="border border-stone-300 px-3 py-2 text-sm bg-white focus:outline-none focus:border-stone-500"
                    >
                        <option value="">All Categories</option>
                        {allCategories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <div className="relative">
                        <input
                            name="q"
                            placeholder="Search Code/Name"
                            defaultValue={searchFilter}
                            className="border border-stone-300 pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-stone-500 w-40 md:w-60"
                        />
                        <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Search className="h-4 w-4 text-stone-400" />
                        </button>
                    </div>
                    <button type="submit" className="bg-stone-900 text-white px-4 py-2 text-sm hover:bg-stone-800 uppercase tracking-wide">
                        Filter
                    </button>
                </form>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
                {products.length === 0 && (
                    <p className="col-span-full py-12 text-center text-stone-500">No products found matching criteria.</p>
                )}
            </div>
        </div>
    );
}
