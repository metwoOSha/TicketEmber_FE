import { z } from 'zod';

const schema = z.object({
    API_URL: z.url(),
});

// Server-side only. Import this from route handlers and server code, never from client components.
export const env = schema.parse({ API_URL: process.env.API_URL });
