// Browser-side API client. Always talks to our own /api/* (see app/api/[...path]/route.ts),
// which adds the auth header from the httpOnly cookie and forwards to the backend.

export class ApiError extends Error {
    constructor(
        public status: number,
        message: string,
        public body?: unknown
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type RequestOptions = Omit<RequestInit, 'body'> & { body?: unknown };

export async function http<T>(path: string, { body, headers, ...init }: RequestOptions = {}) {
    const finalHeaders = new Headers(headers);
    if (body !== undefined) finalHeaders.set('Content-Type', 'application/json');

    const res = await fetch(`/api${path}`, {
        ...init,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const data: unknown = res.status === 204 ? null : await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            typeof data === 'object' && data !== null && 'message' in data
                ? String((data as { message: unknown }).message)
                : res.statusText;
        throw new ApiError(res.status, message, data);
    }

    return data as T;
}
