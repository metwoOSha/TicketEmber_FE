import Link from 'next/link';

export default function NotFound() {
    return (
        <main style={{ padding: 32 }}>
            <h1>404</h1>
            <p>This page does not exist.</p>
            <Link href="/">Back to the site</Link>
        </main>
    );
}
