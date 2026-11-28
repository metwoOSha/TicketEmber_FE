import type { ReactNode } from 'react';
import AdminLayout from '@/layout/AdminLayout/AdminLayout';

export default function Layout({ children }: { children: ReactNode }) {
    return <AdminLayout>{children}</AdminLayout>;
}
