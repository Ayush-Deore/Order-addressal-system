
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminQuoteGenerator({
    orderId,
    items,
    existingQuote,
    quotedAmount
}: {
    orderId: string,
    items: any[],
    existingQuote: any,
    quotedAmount: number | null
}) {
    const router = useRouter();
    const [showCalculator, setShowCalculator] = useState(false);
    const [material, setMaterial] = useState('Solid Wood');
    const [installationCost, setInstallationCost] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [loading, setLoading] = useState(false);

    const MATERIALS = {
        'Solid Wood': { rate: 15 },
        'Veneer': { rate: 8 },
        'Laminate': { rate: 5 },
        'HDF': { rate: 4 },
        'Custom': { rate: 0 } // Manual override if needed
    };

    const calculateItemPrice = (item: any) => {
        const areaSqFt = (item.height / 1000) * (item.width / 1000) * 10.764;
        const rate = MATERIALS[material as keyof typeof MATERIALS].rate;
        const finishMultiplier = item.finishPreference.includes('Polish') ? 1.5 : 1.2;
        return Math.round(areaSqFt * rate * finishMultiplier * 100) * item.quantity;
    };

    const itemsTotal = items.reduce((acc, item) => acc + calculateItemPrice(item), 0);
    const finalTotal = itemsTotal + Number(installationCost) - Number(discount);

    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });

    const handleSendQuote = async () => {
        setLoading(true);
        setStatus({ type: null, message: '' });
        try {
            const res = await fetch(`/api/orders/${orderId}/quote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: finalTotal,
                    details: {
                        material,
                        itemsTotal,
                        installationCost,
                        discount,
                        breakdown: items.map(i => ({ id: i.id, price: calculateItemPrice(i) }))
                    }
                })
            });

            if (!res.ok) throw new Error('Failed to send quote');

            setStatus({ type: 'success', message: 'Quote Sent Successfully!' });
            router.refresh();
            setTimeout(() => {
                setShowCalculator(false);
                setStatus({ type: null, message: '' });
            }, 1000);
        } catch (e) {
            setStatus({ type: 'error', message: 'Error sending quote. Check console.' });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    // View Mode (If Quote Exists)
    if (existingQuote && !showCalculator) {
        return (
            <div className="bg-white p-6 rounded-lg border border-stone-200 mt-8">
                <h3 className="font-bold text-stone-900 text-lg mb-4 border-b pb-2">Generated Quotation</h3>
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                    <div>
                        <p className="text-stone-700 font-bold text-xs uppercase mb-1">Quoted Material</p>
                        <p className="font-bold text-stone-900">{existingQuote.material}</p>
                    </div>
                    <div>
                        <p className="text-stone-700 font-bold text-xs uppercase mb-1">Date</p>
                        <p className="font-bold text-stone-900">{new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="mt-6 bg-stone-900 p-6 rounded text-right shadow-sm">
                    <p className="text-stone-400 text-xs uppercase font-bold tracking-wider mb-2">Final Quote Amount</p>
                    <p className="text-4xl font-extrabold text-white tracking-tight">
                        ${(quotedAmount ?? existingQuote?.amount ?? 0).toLocaleString()}
                    </p>
                </div>
                <button
                    onClick={() => { if (confirm('Generate new quote? Overwrites existing.')) setShowCalculator(true); }}
                    className="mt-4 text-xs text-stone-500 underline hover:text-stone-800"
                >
                    Regenerate Quote
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg border border-stone-200 mt-8">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="font-bold text-stone-900 text-lg">Generate Official Quote</h3>
                <button
                    onClick={() => setShowCalculator(!showCalculator)}
                    className="text-xs bg-stone-900 text-white px-3 py-1 rounded"
                >
                    {showCalculator ? 'Cancel' : 'Create Quote'}
                </button>
            </div>

            {showCalculator && (
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Base Material</label>
                        <select
                            value={material}
                            onChange={(e) => setMaterial(e.target.value)}
                            className="w-full border p-2 rounded text-sm"
                        >
                            {Object.keys(MATERIALS).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>

                    <div className="bg-stone-50 p-3 rounded">
                        <p className="text-sm font-semibold mb-2">Cost Breakdown</p>
                        {items.map(item => (
                            <div key={item.id} className="flex justify-between text-xs text-stone-600 mb-1">
                                <span>{item.product.name} (x{item.quantity})</span>
                                <span>${calculateItemPrice(item).toLocaleString()}</span>
                            </div>
                        ))}
                        <div className="border-t border-stone-200 mt-2 pt-2 flex justify-between font-bold text-sm">
                            <span>Subtotal</span>
                            <span>${itemsTotal.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Installation / Shipping</label>
                            <input type="number" value={installationCost} onChange={e => setInstallationCost(Number(e.target.value))} className="w-full border p-2 rounded text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Discount</label>
                            <input type="number" value={discount} onChange={e => setDiscount(Number(e.target.value))} className="w-full border p-2 rounded text-sm text-red-600" />
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-stone-900 text-white p-4 rounded">
                        <span>Total Quote Amount</span>
                        <span className="text-xl font-bold">${finalTotal.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                        {status.message && (
                            <div className={`p-3 rounded text-sm text-center ${status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {status.message}
                            </div>
                        )}
                        <button
                            onClick={handleSendQuote}
                            disabled={loading}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded font-bold disabled:opacity-50 transition-colors"
                        >
                            {loading ? 'Sending...' : 'Save & Email Quote to Client'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
