import { NextResponse } from 'next/server';

// TODO: call the backend /auth/logout and clear the httpOnly cookies (helpers/cookies.ts).
export async function POST() {
    return NextResponse.json({ message: 'Not implemented' }, { status: 501 });
}
