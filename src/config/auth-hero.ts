// Big headline on the poster side of auth pages, by route.
export const AUTH_EYEBROW = 'YOUR SEATS ARE WAITING';

const HEROES: Record<string, [string, string]> = {
    '/register': ['Book in', 'two clicks.'],
};

export const DEFAULT_HERO: [string, string] = ['Welcome', 'back.'];
export const HOLD_HERO: [string, string] = ['Your seat', 'is waiting.'];

export function getAuthHero(pathname: string, hasHold: boolean) {
    if (pathname === '/login' && hasHold) return HOLD_HERO;
    return HEROES[pathname] ?? DEFAULT_HERO;
}
