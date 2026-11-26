import { cookies } from 'next/headers';
import { ACCESS_COOKIE, REFRESH_COOKIE } from './cookie-names';

// TODO: align with the backend token lifetimes (refresh is 7 days there).
const ACCESS_MAX_AGE = 60 * 15;
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

const base = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
};

export async function setAuthCookies(tokens: { accessToken: string; refreshToken: string }) {
    const store = await cookies();
    store.set(ACCESS_COOKIE, tokens.accessToken, { ...base, maxAge: ACCESS_MAX_AGE });
    store.set(REFRESH_COOKIE, tokens.refreshToken, { ...base, maxAge: REFRESH_MAX_AGE });
}

export async function clearAuthCookies() {
    const store = await cookies();
    store.delete(ACCESS_COOKIE);
    store.delete(REFRESH_COOKIE);
}

export async function getAccessToken() {
    return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken() {
    return (await cookies()).get(REFRESH_COOKIE)?.value;
}
