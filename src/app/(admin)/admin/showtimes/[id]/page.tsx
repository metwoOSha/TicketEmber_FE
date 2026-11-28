import type { Metadata } from 'next';
import Showtime from '@/base/admin/Showtime/Showtime';

export const metadata: Metadata = { title: 'Showtime' };

export default async function AdminShowtimePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <Showtime id={id} />;
}
