import cls from './StatTiles.module.css';

export type Stat = { label: string; value: string; note?: string };

/** A row of numbers on one card. */
export default function StatTiles({ stats }: { stats: Stat[] }) {
    return (
        <dl className={cls.tiles}>
            {stats.map((s) => (
                <div key={s.label} className={cls.tile}>
                    <dt className={cls.label}>{s.label}</dt>
                    <dd className={cls.value}>{s.value}</dd>
                    {s.note && <dd className={cls.note}>{s.note}</dd>}
                </div>
            ))}
        </dl>
    );
}
