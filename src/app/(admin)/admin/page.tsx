import type { Metadata } from 'next';
import Dashboard from '@/base/admin/Dashboard/Dashboard';

export const metadata: Metadata = { title: 'Admin dashboard' };

export default function AdminDashboardPage() {
    return <Dashboard />;
}
