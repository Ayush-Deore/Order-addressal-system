import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');

export async function sendOrderNotification(orderHtml: string, orderId: string, clientEmail: string) {
    // 1. Mock Mode (Dev/No API Key)
    console.log(`[Email Debug] Checking API Key: ${process.env.RESEND_API_KEY ? 'EXISTS (...) ' + process.env.RESEND_API_KEY.slice(-4) : 'MISSING'}`);

    if (!process.env.RESEND_API_KEY) {
        console.log('\n--- 📧 MOCK EMAIL PREVIEW ------------------------------------------');
        console.log(`To: company@doorcatalog.com`);
        console.log(`Reply-To: ${clientEmail}`);
        console.log(`Subject: Official Quote for Order #${orderId}`);
        console.log('--- Body (HTML Simplified) ---');
        console.log(orderHtml.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').substring(0, 200) + '...');
        console.log('--------------------------------------------------------------------\n');
        return;
    }

    // 2. Real Mode (Resend)
    try {
        await resend.emails.send({
            from: 'Luxe Doors <admin@resend.dev>', // Update this if you have a custom domain verified in Resend
            to: clientEmail,
            subject: `Official Quote: Order #${orderId}`,
            html: orderHtml
        });
        console.log(`✅ Email sent successfully to ${clientEmail}`);
    } catch (error) {
        console.error('❌ Failed to send email via Resend:', error);
        throw error; // Re-throw to handle in API
    }
}
