import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import { QueryProvider } from '@/providers/QueryProvider';
import '@/styles/globals.css';

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

export const metadata: Metadata = {
    title: { default: 'Ticketember', template: '%s · Ticketember' },
    description: 'Book cinema seats in a few clicks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${heading.variable} ${body.variable}`}>
            <body>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
