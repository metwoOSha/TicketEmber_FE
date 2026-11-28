import type { Metadata } from 'next';
import Movies from '@/base/admin/Movies/Movies';

export const metadata: Metadata = { title: 'Movies' };

export default function AdminMoviesPage() {
    return <Movies />;
}
