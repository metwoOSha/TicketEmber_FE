import type { Metadata } from 'next';
import ForgotSent from '@/base/site/Auth/ForgotSent';

export const metadata: Metadata = { title: 'Check your inbox' };

export default async function ForgotSentPage({ searchParams }: { searchParams: Promise<{ email?: string }> }) {
    const { email } = await searchParams;
    return <ForgotSent email={email ?? 'your email'} />;
}
