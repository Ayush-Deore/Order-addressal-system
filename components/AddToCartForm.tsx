'use client';

import { useState } from 'react';
import type { Product } from '@prisma/client';
import { useCart, type CartItem } from '@/lib/cart';
import { useRouter } from 'next/navigation';
import { ShoppingCart, FileEdit } from 'lucide-react';

export function AddToCartForm({ product }: { product: Product }) {
    const router = useRouter();
    const addItem = useCart((state) => state.addItem);

    // State for form
    const [quantity, setQuantity] = useState(1);
    const [height, setHeight] = useState(2100);
    const [width, setWidth] = useState(900);
    const [thickness, setThickness] = useState(40);
    const [direction, setDirection] = useState('Left');
    const [frame, setFrame] = useState(false);
    const [finish, setFinish] = useState('Match Catalog');
    const [notes, setNotes] = useState('');

    const handleAdd = (redirect: boolean) => {
        const item: CartItem = {
            uniqueId: crypto.randomUUID(),
            productId: product.id,
            productName: product.name,
            designCode: product.designCode,
            image: product.images[0],
            category: product.category,
            height,
            width,
            thickness,
            quantity,
            openingDirection: direction,
            frameRequired: frame,
            finishPreference: finish,
            notes: notes || undefined
        };

        addItem(item);

        alert('Added to cart!'); // Replace with toast later
        if (redirect) {
            router.push('/cart');
        }
    };

    return (
        <div className="bg-stone-50 p-6 rounded-lg border border-stone-200">
            <h3 className="text-xl font-medium text-stone-900 mb-4">Configure Order</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Height (mm)</label>
                    <input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full border p-2 rounded bg-white text-stone-900" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Width (mm)</label>
                    <input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full border p-2 rounded bg-white text-stone-900" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Thickness (mm)</label>
                    <input type="number" value={thickness} onChange={e => setThickness(Number(e.target.value))} className="w-full border p-2 rounded bg-white text-stone-900" />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Quantity</label>
                    <input type="number" value={quantity} min={1} onChange={e => setQuantity(Number(e.target.value))} className="w-full border p-2 rounded bg-white text-stone-900" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Opening Direction</label>
                    <select value={direction} onChange={e => setDirection(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900">
                        <option>Left</option>
                        <option>Right</option>
                        <option>Both (Double Door)</option>
                        <option>Sliding</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Frame Required?</label>
                    <select value={frame ? 'Yes' : 'No'} onChange={e => setFrame(e.target.value === 'Yes')} className="w-full border p-2 rounded bg-white text-stone-900">
                        <option>No</option>
                        <option>Yes</option>
                    </select>
                </div>
            </div>

            <div className="mb-4">
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Finish Preference</label>
                <select value={finish} onChange={e => setFinish(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900">
                    <option>Match Catalog</option>
                    <option>Custom (Specify in Notes)</option>
                    <option>Unfinished / Primer Only</option>
                </select>
            </div>

            <div className="mb-6">
                <label className="block text-xs font-semibold text-stone-500 uppercase mb-1">Customization Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900 h-20 placeholder:text-stone-300" placeholder="E.g. specific stain color, glass type..." />
            </div>

            <div className="flex gap-4">
                <button onClick={() => handleAdd(false)} className="flex-1 bg-white border border-stone-300 text-stone-900 py-3 rounded hover:bg-stone-100 flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Add to Cart
                </button>
                <button onClick={() => handleAdd(true)} className="flex-1 bg-stone-900 text-white py-3 rounded hover:bg-stone-800 flex items-center justify-center gap-2">
                    <FileEdit className="h-4 w-4" /> Request Quote
                </button>
            </div>
        </div>
    );
}
