# Ticketember FE

Cinema ticket booking: public site and admin CRM in one Next.js app.
Backend is a separate NestJS API (`TicketEmber_BE`).

## Stack

Next.js 16 (App Router, `src/`), React 19, TypeScript, CSS Modules, TanStack Query, Zustand,
react-hook-form + zod, dayjs. ESLint + Prettier, Husky + lint-staged. Node 22. npm.

## Scripts

`npm run dev` (port 3001) · `build` · `start` · `lint` · `typecheck` · `format`

## Env

Copy `.env.example` to `.env.local`. `API_URL` is the backend base URL, server-side only.
The app refuses to start without it. Set it in Vercel project settings for deploys.

## Folders (`src/`)

- `app/` routes: `(site)` public site, `(admin)/admin` CRM, `login`, `api/` (see Auth)
- `base/` page-level feature components (`site/`, `admin/`)
- `components/` shared UI (`admin/` for admin-only)
- `api/` fetch wrappers per resource, `hooks/`, `store/`, `providers/`, `layout/`
- `config/`, `helpers/`, `utils/`, `types/`, `styles/`
- `proxy.ts` redirects to `/login` when there is no session cookie (admin and account areas)

## Two visual systems

- **Site**: dark cinematic. `styles/tokens.css`, scoped to `[data-theme='site']` (set in the
  `(site)` layout). Fonts: Space Grotesk (headings), Inter (body). Variables `--color-*`,
  `--space-*`, `--radius-*`.
- **Admin**: plain and light. `styles/admin-tokens.css`, scoped to `[data-theme='admin']`.
  Variables `--adm-*`, system font.

Breakpoints (use literal px in `@media`): **768px** and **1024px**.

## Auth

Tokens live only in httpOnly cookies (`tk_access`, `tk_refresh`).
The browser calls our own `/api/*`: `app/api/[...path]/route.ts` adds the `Authorization` header
from the cookie and forwards to `API_URL`. `app/api/auth/*` will call the backend and set or clear
the cookies (stubs for now).

## Money, time, images

Money is stored in cents and shown in USD (`utils/format.ts`). Session times use Europe/Kyiv.
Movie images are hotlinked from the TMDB CDN (`utils/tmdb.ts`), attribution is required.
