import type { Metadata } from 'next';
import { QueryProvider } from '@/providers/QueryProvider';
import '@/styles/globals.css';

export const metadata: Metadata = {
    title: { default: 'Ticketember', template: '%s · Ticketember' },
    description: 'Book cinema seats in a few clicks.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
