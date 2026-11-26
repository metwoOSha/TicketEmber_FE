// We store only poster_path / backdrop_path and hotlink the TMDB CDN.
// TMDB attribution is required in the site footer.
const BASE = 'https://image.tmdb.org/t/p';

export type TmdbSize = 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export function tmdbImage(path: string | null | undefined, size: TmdbSize = 'w500') {
    return path ? `${BASE}/${size}${path}` : null;
}
