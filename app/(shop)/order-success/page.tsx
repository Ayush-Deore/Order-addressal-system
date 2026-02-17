import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default async function OrderSuccessPage({
    searchParams,
}: {
    searchParams: Promise<{ id?: string }>;
}) {
    const { id } = await searchParams;

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <CheckCircle className="h-20 w-20 text-green-500 mb-6" />
            <h1 className="text-4xl font-light text-stone-900 mb-2">Request Received</h1>
            <p className="text-xl text-stone-600 mb-8">Ref: {id || 'N/A'}</p>

            <div className="max-w-md bg-stone-50 p-6 rounded-lg mb-8 text-sm text-stone-500">
                We have received your quote request. Our team will verify technical requirements and verify the pricing. You will receive an invoice via email shortly.
            </div>

            <Link href="/catalog" className="bg-stone-900 text-white px-8 py-3 rounded hover:bg-stone-800 transition-colors">
                Back to Catalog
            </Link>
        </div>
    );
}
