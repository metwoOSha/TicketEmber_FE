import type { NextConfig } from 'next';

// Fail fast on startup (dev/build) if the backend URL is missing.
if (!process.env.API_URL) {
    throw new Error('API_URL is not set. Copy .env.example to .env.local and fill it in.');
}

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'image.tmdb.org', pathname: '/t/p/**' }],
    },
};

export default nextConfig;
