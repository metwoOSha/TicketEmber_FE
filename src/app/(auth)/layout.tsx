import type { ReactNode } from 'react';
import AuthLayout from '@/layout/AuthLayout/AuthLayout';

export default function Layout({ children }: { children: ReactNode }) {
    return <AuthLayout>{children}</AuthLayout>;
}
