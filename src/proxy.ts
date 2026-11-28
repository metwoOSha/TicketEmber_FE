import { NextResponse, type NextRequest } from 'next/server';
import { ACCESS_COOKIE, REFRESH_COOKIE } from '@/helpers/cookie-names';

// Only checks that a session cookie exists. Real authorization (and the admin role)
// is enforced by the backend. Matcher lists the protected areas.
// TODO: remove together with the mocks. Mock login sets no cookie, so protection is off until the backend is connected
// (set NEXT_PUBLIC_USE_MOCKS=false to test it).
const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== 'false';

export function proxy(request: NextRequest) {
    if (USE_MOCKS) return NextResponse.next();

    const hasSession = request.cookies.has(ACCESS_COOKIE) || request.cookies.has(REFRESH_COOKIE);

    if (!hasSession) {
        const url = new URL('/login', request.url);
        url.searchParams.set('next', request.nextUrl.pathname);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*', '/my-tickets/:path*', '/settings/:path*', '/tickets/:path*', '/checkout/:path*'],
};
