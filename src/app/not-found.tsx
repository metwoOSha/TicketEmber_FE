import Link from 'next/link';
import StatusTicket from '@/components/StatusTicket/StatusTicket';
import StatusLayout from '@/layout/StatusLayout/StatusLayout';

export default function NotFound() {
    return (
        <StatusLayout>
            <StatusTicket
                code="404"
                title="This seat does not exist"
                text="The page you are looking for was moved or never existed. Let us get you back to a film."
                footer="ROW ? · SEAT ?"
                action={{ label: 'Now showing', href: '/' }}
                secondary={<Link href="/my-tickets">My tickets</Link>}
            />
        </StatusLayout>
    );
}
