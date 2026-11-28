import type { Metadata } from 'next';
import Halls from '@/base/admin/Halls/Halls';

export const metadata: Metadata = { title: 'Halls' };

export default function AdminHallsPage() {
    return <Halls />;
}
