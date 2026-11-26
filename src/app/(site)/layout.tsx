import { Inter, Space_Grotesk } from 'next/font/google';
import '@/styles/tokens.css';

const heading = Space_Grotesk({
    variable: '--font-heading-face',
    subsets: ['latin', 'latin-ext'],
    weight: ['500', '700'],
});

const body = Inter({
    variable: '--font-body-face',
    subsets: ['latin', 'cyrillic'],
    weight: ['300', '400', '500'],
});

export default function SiteLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-theme="site" className={`${heading.variable} ${body.variable}`} style={{ minHeight: '100vh' }}>
            {children}
        </div>
    );
}
