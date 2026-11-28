import type { Metadata } from 'next';
import MovieEdit from '@/base/admin/MovieEdit/MovieEdit';

export const metadata: Metadata = { title: 'Edit movie' };

export default async function AdminMoviePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <MovieEdit key={id} id={id} />;
}
