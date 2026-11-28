import type { ReactNode } from 'react';
import SiteLayout from '@/layout/SiteLayout/SiteLayout';

export default function Layout({ children }: { children: ReactNode }) {
    return <SiteLayout>{children}</SiteLayout>;
}
