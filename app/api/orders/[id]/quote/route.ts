
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { sendOrderNotification } from '@/lib/email';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        // @ts-ignore
        if (session?.user?.role !== 'ADMIN') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { id } = await params;
        const body = await req.json(); // { amount, details: { ... } }

        // Update Order
        const order = await prisma.order.update({
            where: { id },
            data: {
                status: 'QUOTED',
                quotedAmount: body.amount,
                quoteDetails: body.details
            },
            include: { items: true }
        });

        // Send Official Quote Email
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <body style="font-family: sans-serif; color: #333; line-height: 1.6;">
                <div style="max-w-xl mx-auto border border-gray-200 rounded-lg overflow-hidden">
                    <div style="background: #1c1917; color: white; padding: 20px; text-align: center;">
                        <h1 style="margin: 0; font-size: 24px;">Luxe Doors</h1>
                    </div>
                    <div style="padding: 30px;">
                        <h2 style="margin-top: 0; color: #1c1917;">Official Quotation</h2>
                        <p>Dear ${order.clientName},</p>
                        <p>Thank you for your interest in Luxe Doors. We are pleased to provide the following quotation for your Order <strong>#${order.orderNumber}</strong>.</p>
                        
                        <div style="background: #f5f5f4; padding: 20px; border-radius: 8px; margin: 25px 0;">
                            <div style="font-size: 14px; text-transform: uppercase; color: #78716c; font-weight: bold; letter-spacing: 0.05em; margin-bottom: 5px;">Total Quote Amount</div>
                            <div style="font-size: 32px; font-weight: bold; color: #1c1917;">$${body.amount.toLocaleString()}</div>
                        </div>

                        <h3 style="border-bottom: 2px solid #e7e5e4; padding-bottom: 10px; margin-top: 30px;">Breakdown</h3>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 14px;">
                            <tr style="border-bottom: 1px solid #e7e5e4;">
                                <td style="padding: 10px 0;">Base Material</td>
                                <td style="text-align: right; font-weight: bold;">${body.details.material}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e7e5e4;">
                                <td style="padding: 10px 0;">Items Subtotal</td>
                                <td style="text-align: right;">$${body.details.itemsTotal.toLocaleString()}</td>
                            </tr>
                            <tr style="border-bottom: 1px solid #e7e5e4;">
                                <td style="padding: 10px 0;">Installation & Shipping</td>
                                <td style="text-align: right;">$${body.details.installationCost.toLocaleString()}</td>
                            </tr>
                            <tr style="color: #16a34a;">
                                <td style="padding: 10px 0;">Discount</td>
                                <td style="text-align: right;">-$${body.details.discount.toLocaleString()}</td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 40px; text-align: center;">
                            <a href="#" style="background: #1c1917; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Accept & Proceed</a>
                        </div>
                    </div>
                    <div style="background: #f5f5f4; padding: 20px; text-align: center; font-size: 12px; color: #78716c;">
                        <p>&copy; ${new Date().getFullYear()} Luxe Doors. All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        await sendOrderNotification(emailHtml, order.orderNumber, order.email);

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Quote generation failed:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
