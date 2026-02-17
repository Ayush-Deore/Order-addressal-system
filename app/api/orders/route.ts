import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendOrderNotification } from '@/lib/email';

const OrderSchema = z.object({
    clientName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    location: z.string().min(1),
    items: z.array(z.object({
        productId: z.string(),
        height: z.number(),
        width: z.number(),
        thickness: z.number(),
        quantity: z.number(),
        openingDirection: z.string(),
        frameRequired: z.boolean(),
        finishPreference: z.string(),
        notes: z.string().optional()
    })),
    estimatedTotal: z.number().optional()
});

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const json = await req.json();
        const body = OrderSchema.parse(json);

        // Create Order
        // Count total orders to generate simple order number
        const count = await prisma.order.count();
        const orderNumber = `ORD-${new Date().getFullYear()}-${(count + 1).toString().padStart(3, '0')}`;

        const order = await prisma.order.create({
            data: {
                orderNumber,
                clientName: body.clientName,
                email: body.email,
                phone: body.phone,
                installationLocation: body.location,
                status: 'NEW',
                items: {
                    create: body.items.map(item => ({
                        productId: item.productId,
                        height: item.height,
                        width: item.width,
                        thickness: item.thickness,
                        quantity: item.quantity,
                        openingDirection: item.openingDirection,
                        frameRequired: item.frameRequired,
                        finishPreference: item.finishPreference,
                        notes: item.notes
                    }))
                }
            },
            include: { items: true } // Include to confirm creation
        });

        // Send Email
        const itemsHtml = order.items.map(i => `
        <li>
           Product ID: ${i.productId} <br/>
           Dims: ${i.height}x${i.width}x${i.thickness}mm <br/>
           Qty: ${i.quantity} <br/>
           Notes: ${i.notes || '-'}
        </li>
      `).join('');

        const html = `
        <h1>New Quote Request: ${order.orderNumber}</h1>
        <p><strong>Client:</strong> ${order.clientName}</p>
        <p><strong>Email:</strong> ${order.email}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Location:</strong> ${order.installationLocation}</p>
        <hr/>
        <h3>Items:</h3>
        <ul>${itemsHtml}</ul>
        ${body.estimatedTotal ? `<hr/><h3>Estimated Project Cost (Tentative): $${body.estimatedTotal.toLocaleString()}</h3>` : ''}
      `;

        await sendOrderNotification(html, order.orderNumber, order.email);

        return NextResponse.json({ orderId: order.orderNumber });

    } catch (error) {
        console.error('Order creation failed:', error);
        return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
    }
}
