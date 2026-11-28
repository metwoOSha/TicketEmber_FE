import type { Metadata } from 'next';
import { Suspense } from 'react';
import Orders from '@/base/admin/Orders/Orders';

export const metadata: Metadata = { title: 'Orders' };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    // A new search from the top bar remounts the list with that query
    return (
        <Suspense>
            <Orders key={q ?? ''} />
        </Suspense>
    );
}
