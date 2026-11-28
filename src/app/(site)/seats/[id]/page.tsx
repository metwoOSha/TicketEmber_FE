import Seats from '@/base/site/Seats/Seats';

export default async function SeatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Seats sessionId={decodeURIComponent(id)} />;
}
