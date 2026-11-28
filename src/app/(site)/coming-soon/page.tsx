import type { Metadata } from 'next';
import ComingSoon from '@/base/site/ComingSoon/ComingSoon';
import PageContainer from '@/components/PageContainer/PageContainer';

export const metadata: Metadata = { title: 'Coming soon' };

export default function ComingSoonPage() {
    return (
        <PageContainer>
            <ComingSoon />
        </PageContainer>
    );
}
