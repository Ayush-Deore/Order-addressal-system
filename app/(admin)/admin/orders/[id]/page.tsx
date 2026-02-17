import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { OrderStatusUpdater } from '@/components/OrderStatusUpdater';
import Link from 'next/link';
import AdminQuoteGenerator from '@/components/AdminQuoteGenerator';
import { ArrowLeft } from 'lucide-react';

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            items: {
                include: { product: true }
            }
        }
    });

    if (!order) notFound();

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/admin" className="text-stone-500 hover:text-stone-900">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                    <h1 className="text-2xl font-bold text-stone-900">Order {order.orderNumber}</h1>
                </div>
                <OrderStatusUpdater id={order.id} status={order.status} />
            </div>

            {/* Quote Generator Area */}
            <AdminQuoteGenerator
                orderId={order.id}
                items={order.items}
                existingQuote={order.quoteDetails}
                quotedAmount={order.quotedAmount}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 mt-8">
                <div className="md:col-span-2 bg-white p-6 rounded-lg border border-stone-200">
                    <h3 className="font-semibold text-stone-900 mb-4 border-b pb-2">Order Items</h3>
                    <div className="space-y-6">
                        {order.items.map(item => (
                            <div key={item.id} className="flex gap-4">
                                <div className="h-16 w-16 bg-stone-100 rounded overflow-hidden">
                                    {item.product.images[0] && <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />}
                                </div>
                                <div>
                                    <h4 className="font-medium text-stone-900">{item.product.name}</h4>
                                    <p className="text-xs text-stone-500 mb-1">Code: {item.product.designCode}</p>
                                    <div className="text-xs text-stone-600 grid grid-cols-2 gap-x-4 gap-y-1">
                                        <p>Qty: {item.quantity}</p>
                                        <p>Size: {item.height} x {item.width} x {item.thickness}mm</p>
                                        <p>Opening: {item.openingDirection}</p>
                                        <p>Frame: {item.frameRequired ? 'Yes' : 'No'}</p>
                                        <p>Finish: {item.finishPreference}</p>
                                    </div>
                                    {item.notes && (
                                        <p className="text-xs text-amber-700 mt-1 bg-amber-50 p-1 rounded inline-block">Note: {item.notes}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg border border-stone-200 h-fit">
                    <h3 className="font-semibold text-stone-900 mb-4 border-b pb-2">Client Details</h3>
                    <div className="space-y-4 text-sm">
                        <div>
                            <span className="block text-stone-700 text-xs font-bold uppercase tracking-wider mb-1">Client Name</span>
                            <p className="text-stone-900 text-base font-medium">{order.clientName}</p>
                        </div>
                        <div>
                            <span className="block text-stone-700 text-xs font-bold uppercase tracking-wider mb-1">Email</span>
                            <p className="text-stone-900 text-base font-medium">{order.email}</p>
                        </div>
                        <div>
                            <span className="block text-stone-700 text-xs font-bold uppercase tracking-wider mb-1">Phone</span>
                            <p className="text-stone-900 text-base font-medium">{order.phone}</p>
                        </div>
                        <div>
                            <span className="block text-stone-700 text-xs font-bold uppercase tracking-wider mb-1">Location</span>
                            <p className="text-stone-900 text-base font-medium">{order.installationLocation}</p>
                        </div>
                        <div>
                            <span className="block text-stone-700 text-xs font-bold uppercase tracking-wider mb-1">Request Date</span>
                            <p className="text-stone-900 text-base font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
