import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileDown } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 50
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-stone-900">Recent Orders</h1>
                <a
                    href="/api/admin/export-csv"
                    className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-md hover:bg-stone-800 text-sm font-medium transition-colors"
                >
                    <FileDown className="h-4 w-4" />
                    Export CSV
                </a>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                        <tr>
                            <th className="px-6 py-4">Ref</th>
                            <th className="px-6 py-4">Client</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-stone-50">
                                <td className="px-6 py-4 font-mono text-stone-600">{order.orderNumber}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-stone-900">{order.clientName}</div>
                                    <div className="text-xs text-stone-500">{order.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full
                                    ${order.status === 'NEW' ? 'bg-blue-100 text-blue-800' :
                                            order.status === 'QUOTED' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    'bg-stone-100 text-stone-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-stone-500">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 font-medium">
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-stone-400">No orders found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
