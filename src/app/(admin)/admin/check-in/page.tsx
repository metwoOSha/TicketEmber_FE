import type { Metadata } from 'next';
import { Suspense } from 'react';
import CheckIn from '@/base/admin/CheckIn/CheckIn';

export const metadata: Metadata = { title: 'Check-in' };

export default function AdminCheckInPage() {
    return (
        <Suspense>
            <CheckIn />
        </Suspense>
    );
}
