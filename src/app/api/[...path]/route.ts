import { env } from '@/config/env';
import { getAccessToken } from '@/helpers/cookies';

type Ctx = { params: Promise<{ path: string[] }> };

// Hop-by-hop / encoding headers must not be copied: fetch already decoded the body.
const SKIP_RESPONSE_HEADERS = ['content-encoding', 'content-length', 'transfer-encoding', 'connection'];

async function forward(req: Request, ctx: Ctx) {
    const { path } = await ctx.params;
    const { search } = new URL(req.url);
    const target = `${env.API_URL}/${path.join('/')}${search}`;

    const headers = new Headers();
    const contentType = req.headers.get('content-type');
    if (contentType) headers.set('content-type', contentType);
    headers.set('accept', req.headers.get('accept') ?? 'application/json');

    const token = await getAccessToken();
    if (token) headers.set('authorization', `Bearer ${token}`);

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD';
    const upstream = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? await req.arrayBuffer() : undefined,
        cache: 'no-store',
    });

    const responseHeaders = new Headers(upstream.headers);
    SKIP_RESPONSE_HEADERS.forEach((h) => responseHeaders.delete(h));
    // Auth cookies are only set by our own /api/auth/* handlers.
    responseHeaders.delete('set-cookie');

    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
}

// TODO: on 401, try /auth/refresh once (rotating refresh token) and retry the request.
export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
