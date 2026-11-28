import type { Metadata } from 'next';
import ResetForm from '@/base/site/Auth/ResetForm';

export const metadata: Metadata = { title: 'Set a new password' };

export default async function ResetPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams;
    return <ResetForm token={token ?? ''} />;
}
