import cls from './Highlight.module.css';

/** Wraps the part of `text` that matches `query` (case-insensitive) in an accent span. */
export default function Highlight({ text, query }: { text: string; query: string }) {
    const q = query.trim();
    const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (i < 0) return <>{text}</>;

    return (
        <>
            {text.slice(0, i)}
            <span className={cls.mark}>{text.slice(i, i + q.length)}</span>
            {text.slice(i + q.length)}
        </>
    );
}
