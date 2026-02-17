'use client';

import { useCart } from '@/lib/cart';
import { Trash2, Send } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const { items, removeItem, clearCart } = useCart();
    const router = useRouter();

    // Checkout Form State
    const [clientName, setClientName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Villa');
    const [loading, setLoading] = useState(false);

    // Quotation Calculator State
    const [showQuote, setShowQuote] = useState(false);
    const [selectedMaterial, setSelectedMaterial] = useState('Solid Wood');

    const MATERIALS = {
        'Solid Wood': { rate: 15, name: 'Solid Teak Wood' },
        'Veneer': { rate: 8, name: 'Premium Veneer' },
        'Laminate': { rate: 5, name: 'High Pressure Laminate' },
        'HDF': { rate: 4, name: 'HDF Paint Grade' },
    };

    const calculateItemPrice = (item: any) => {
        // Area in SqFt approx: (H mm * W mm) / 92903 (mm² in sqft)
        // Let's use simpler metric: H(m) * W(m) * 10.764 -> SqFt
        const areaSqFt = (item.height / 1000) * (item.width / 1000) * 10.764;
        const materialRate = MATERIALS[selectedMaterial as keyof typeof MATERIALS].rate;
        // Base Cost + Finish Multiplier (fake logic)
        const finishMultiplier = item.finishPreference.includes('Polish') ? 1.5 : 1.2;

        // Cost per unit * Qty
        return Math.round(areaSqFt * materialRate * finishMultiplier * 100) * item.quantity;
    };

    const totalEstimatedPrice = items.reduce((acc, item) => acc + calculateItemPrice(item), 0);

    const handleSubmitScore = async (e: React.FormEvent) => {
        e.preventDefault();
        if (items.length === 0) return;

        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientName,
                    email,
                    phone,
                    location,
                    items,
                    estimatedTotal: showQuote ? totalEstimatedPrice : undefined
                })
            });

            if (!res.ok) throw new Error('Failed to submit order');

            const data = await res.json();
            clearCart();
            router.push(`/order-success?id=${data.orderId}`);
        } catch (error) {
            alert('Failed to submit order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="max-w-4xl mx-auto py-12 text-center">
                <h2 className="text-2xl text-stone-900 font-light mb-4">Your Quote Request is Empty</h2>
                <Link href="/catalog" className="text-stone-600 underline hover:text-stone-900">Browse Catalog</Link>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-light text-stone-900">Your Items</h1>
                    <button
                        onClick={() => setShowQuote(!showQuote)}
                        className="text-sm border border-stone-300 px-4 py-2 rounded hover:bg-stone-50"
                    >
                        {showQuote ? 'Hide Price Estimator' : 'Calculate Quotation'}
                    </button>
                </div>

                {showQuote && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                            <div>
                                <h3 className="font-bold text-amber-900">Tentative Price Estimator</h3>
                                <p className="text-xs text-amber-800">Select a material to calculate an estimated project cost.</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm font-semibold text-amber-900">Material:</label>
                                <select
                                    value={selectedMaterial}
                                    onChange={(e) => setSelectedMaterial(e.target.value)}
                                    className="p-2 border border-amber-300 rounded bg-white text-sm"
                                >
                                    {Object.keys(MATERIALS).map(m => (
                                        <option key={m} value={m}>{m}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {items.map((item) => {
                    const estimatedPrice = calculateItemPrice(item);
                    return (
                        <div key={item.uniqueId} className="flex gap-4 border border-stone-200 p-4 rounded-lg bg-white relative group">
                            <div className="w-24 h-24 bg-stone-100 flex-shrink-0">
                                {item.image && <img src={item.image} className="w-full h-full object-cover" alt="" />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium text-stone-900">{item.productName}</h3>
                                    <button onClick={() => removeItem(item.uniqueId)} className="text-stone-400 hover:text-red-500">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-stone-500 mb-2">{item.designCode}</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-1 gap-x-4 text-xs text-stone-600">
                                    <p><span className="font-semibold">Dims:</span> {item.height}x{item.width}x{item.thickness}mm</p>
                                    <p><span className="font-semibold">Qty:</span> {item.quantity}</p>
                                    <p><span className="font-semibold">Open:</span> {item.openingDirection}</p>
                                    <p><span className="font-semibold">Frame:</span> {item.frameRequired ? 'Yes' : 'No'}</p>
                                    <p><span className="font-semibold">Finish:</span> {item.finishPreference}</p>
                                </div>
                                {item.notes && <p className="text-xs text-stone-500 mt-2 bg-stone-50 p-2 rounded">Note: {item.notes}</p>}

                                {showQuote && (
                                    <div className="mt-3 pt-3 border-t border-stone-100 flex justify-between items-center text-sm">
                                        <span className="text-stone-500">Est. Price ({selectedMaterial}):</span>
                                        <span className="font-bold text-stone-900">${estimatedPrice.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}

                {showQuote && (
                    <div className="bg-stone-900 text-white p-6 rounded-lg flex justify-between items-center">
                        <div>
                            <p className="text-sm text-stone-400">Total Estimated Project Cost</p>
                            <p className="text-xs text-stone-500 mt-1">*Excludes installation & taxes</p>
                        </div>
                        <div className="text-3xl font-bold">
                            ${totalEstimatedPrice.toLocaleString()}
                        </div>
                    </div>
                )}
            </div>

            {/* Checkout Form */}
            <div className="bg-stone-100 p-6 rounded-lg h-fit">
                <h2 className="text-xl font-medium text-stone-900 mb-6">Client Details</h2>
                <form onSubmit={handleSubmitScore} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Client / Company Name</label>
                        <input required type="text" value={clientName} onChange={e => setClientName(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900 font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Email for Quote</label>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900 font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Phone Number</label>
                        <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900 font-medium" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-stone-700 uppercase mb-1">Installation Location</label>
                        <select value={location} onChange={e => setLocation(e.target.value)} className="w-full border p-2 rounded bg-white text-stone-900 font-medium">
                            <option>Villa</option>
                            <option>Flat / Apartment</option>
                            <option>Commercial Office</option>
                            <option>Showroom</option>
                        </select>
                    </div>

                    <div className="pt-4 border-t border-stone-200 mt-4">
                        <div className="flex justify-between mb-2 text-sm">
                            <span>Total Items:</span>
                            <span className="font-semibold">{items.reduce((acc, i) => acc + i.quantity, 0)}</span>
                        </div>
                        {showQuote && (
                            <div className="flex justify-between mb-4 text-sm text-stone-900 font-bold border-t border-stone-200 pt-2">
                                <span>Est. Total:</span>
                                <span>${totalEstimatedPrice.toLocaleString()}</span>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-stone-900 text-white py-3 rounded hover:bg-stone-800 disabled:bg-stone-500 flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? 'Submitting...' : (
                                <>
                                    <Send className="h-4 w-4" /> {showQuote ? 'Submit Quote Request' : 'Submit Request'}
                                </>
                            )}
                        </button>
                        <p className="text-xs text-stone-500 mt-2 text-center">
                            {showQuote ? 'We will review your estimated quote and verify pricing.' : 'We will review your requirements and send a formal quote within 24 hours.'}
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
}
