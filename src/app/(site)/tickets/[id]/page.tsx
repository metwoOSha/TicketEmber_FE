import Ticket from '@/base/site/Ticket/Ticket';

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Ticket id={id} />;
}
