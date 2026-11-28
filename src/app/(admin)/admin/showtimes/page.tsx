import type { Metadata } from 'next';
import Showtimes from '@/base/admin/Showtimes/Showtimes';

export const metadata: Metadata = { title: 'Showtimes' };

export default function AdminShowtimesPage() {
    return <Showtimes />;
}
