
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== 'ADMIN') {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const orders = await prisma.order.findMany({
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        });

        // CSV Header
        const header = [
            'Order Number',
            'Date',
            'Status',
            'Client Name',
            'Email',
            'Phone',
            'Location',
            'Product Name',
            'Design Code',
            'Dimensions (HxWxT)',
            'Quantity',
            'Opening',
            'Frame',
            'Finish',
            'Notes',
            'Quoted Amount'
        ].join(',');

        // CSV Rows
        const rows = orders.flatMap(order => {
            return order.items.map(item => {
                return [
                    order.orderNumber,
                    new Date(order.createdAt).toISOString().split('T')[0],
                    order.status,
                    `"${order.clientName}"`,
                    order.email,
                    `"${order.phone}"`,
                    `"${order.installationLocation}"`,
                    `"${item.product.name}"`,
                    item.product.designCode,
                    `"${item.height}x${item.width}x${item.thickness}"`,
                    item.quantity,
                    item.openingDirection,
                    item.frameRequired ? 'Yes' : 'No',
                    `"${item.finishPreference}"`,
                    `"${item.notes || ''}"`,
                    order.quotedAmount || 0
                ].join(',');
            });
        });

        const csvContent = [header, ...rows].join('\n');

        return new NextResponse(csvContent, {
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="orders-export-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });

    } catch (error) {
        console.error('CSV Export failed:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
