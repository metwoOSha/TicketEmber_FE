'use client';

import Link from 'next/link';
import StatusTicket from '@/components/StatusTicket/StatusTicket';
import StatusLayout from '@/layout/StatusLayout/StatusLayout';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <StatusLayout>
            <StatusTicket
                danger
                code="500"
                title="Something went wrong"
                text="It is our fault, not yours. Held seats stay held until their timer ends. Try again in a moment."
                footer={`ERROR ID ${error.digest ?? 'UNKNOWN'}`}
                action={{ label: 'Try again', onClick: reset }}
                secondary={<Link href="/my-tickets">My tickets</Link>}
            />
        </StatusLayout>
    );
}
