'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function OrderStatusUpdater({ id, status }: { id: string, status: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleChange = async (newStatus: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                router.refresh();
            }
        } catch (e) {
            alert('Failed to update status');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-stone-600">Current Status:</label>
            <select
                disabled={loading}
                value={status}
                onChange={(e) => handleChange(e.target.value)}
                className="border border-stone-300 rounded px-3 py-1 text-sm bg-white"
            >
                <option value="NEW">New Request</option>
                <option value="QUOTED">Quote Sent</option>
                <option value="APPROVED">Approved / Deposit Paid</option>
                <option value="IN_PRODUCTION">In Production</option>
                <option value="DELIVERED">Delivered</option>
            </select>
            {loading && <span className="text-xs text-stone-400">Updating...</span>}
        </div>
    );
}
