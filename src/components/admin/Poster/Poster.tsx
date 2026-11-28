import cls from './Poster.module.css';

/** Small poster stand-in tinted with the movie colours (real TMDB posters come later). */
export default function Poster({ tint, large, title }: { tint: [string, string]; large?: boolean; title?: string }) {
    return (
        <span
            className={large ? cls.large : cls.small}
            style={{ background: `linear-gradient(170deg, ${tint[0]}, ${tint[1]})` }}
            aria-hidden={!title}
        >
            {title && <span className={cls.title}>{title}</span>}
        </span>
    );
}
