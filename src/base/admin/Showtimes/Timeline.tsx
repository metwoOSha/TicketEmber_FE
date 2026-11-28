import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { CLEANING_MIN, TIMELINE_FROM_HOUR, TIMELINE_HOURS } from '@/config/admin';
import type { AdminShowtime, Hall } from '@/types/admin.types';
import { CINEMA_TZ, formatTime } from '@/utils/format';
import { buildHallLayout, countSeats } from '@/utils/admin-hall';
import cls from './Timeline.module.css';

export type DraftBlock = { hallId: string; title: string; startsAt: string; endsAt: string; conflict: boolean };

type Props = { date: string; halls: Hall[]; showtimes: AdminShowtime[]; draft: DraftBlock | null };

const FROM = TIMELINE_FROM_HOUR * 60;
const SPAN = TIMELINE_HOURS * 60;
const TICKS = Array.from({ length: TIMELINE_HOURS / 2 + 1 }, (_, i) => TIMELINE_FROM_HOUR + i * 2);

/** Minutes since midnight of `date`, so 01:00 the next night is 25:00. */
function minuteOf(iso: string, date: string) {
    return dayjs(iso).tz(CINEMA_TZ).diff(dayjs.tz(date, CINEMA_TZ), 'minute');
}
const pct = (min: number) => `${((min - FROM) / SPAN) * 100}%`;

/** One row per hall, a block per showtime. The striped tail is the cleaning time. */
export default function Timeline({ date, halls, showtimes, draft }: Props) {
    const nowMin = minuteOf(dayjs().toISOString(), date);
    const showNow = nowMin >= FROM && nowMin <= FROM + SPAN;

    const block = (
        key: string,
        title: string,
        startsAt: string,
        endsAt: string,
        lines: string[],
        className: string,
        href?: string,
        tint?: string
    ) => {
        const start = minuteOf(startsAt, date);
        const length = minuteOf(endsAt, date) - start;
        const style = {
            left: pct(start),
            width: `${((length + CLEANING_MIN) / SPAN) * 100}%`,
            '--cut': `${(length / (length + CLEANING_MIN)) * 100}%`,
            '--tint': tint,
        } as React.CSSProperties;
        const content = (
            <>
                <span className={cls.blockTitle}>{title}</span>
                {lines.map((l) => (
                    <span key={l} className={cls.blockLine}>
                        {l}
                    </span>
                ))}
            </>
        );
        return href ? (
            <Link key={key} href={href} className={clsx(cls.block, className)} style={style} title={`${title}, ${lines.join(', ')}`}>
                {content}
            </Link>
        ) : (
            <div key={key} className={clsx(cls.block, className)} style={style}>
                {content}
            </div>
        );
    };

    return (
        <div className={cls.scroll}>
            <div className={cls.timeline}>
                <span />
                <div className={cls.ticks} aria-hidden>
                    {TICKS.map((h) => (
                        <span key={h} style={{ left: pct(h * 60) }}>
                            {String(h % 24).padStart(2, '0')}:00
                        </span>
                    ))}
                </div>

                <div className={cls.hallNames}>
                    {halls.map((h) => (
                        <div key={h.id} className={cls.hallName}>
                            <span>{h.name}</span>
                            <span className={cls.muted}>
                                {countSeats(buildHallLayout(h)).sellable} seats, {h.formats.join(', ')}
                            </span>
                        </div>
                    ))}
                </div>

                <div className={cls.tracks}>
                    {TICKS.map((h) => (
                        <span key={h} className={cls.gridLine} style={{ left: pct(h * 60) }} aria-hidden />
                    ))}
                    {showNow && (
                        <span className={cls.now} style={{ left: pct(nowMin) }}>
                            <span className={cls.nowLabel}>Now {dayjs().tz(CINEMA_TZ).format('HH:mm')}</span>
                        </span>
                    )}
                    {halls.map((h) => (
                        <div key={h.id} className={cls.track}>
                            {showtimes
                                .filter((s) => s.hallId === h.id)
                                .map((s) => {
                                    const done = s.status === 'finished' || s.status === 'cancelled';
                                    return block(
                                        s.id,
                                        s.movieTitle,
                                        s.startsAt,
                                        s.endsAt,
                                        [
                                            `${formatTime(s.startsAt)}–${formatTime(s.endsAt)}`,
                                            s.status === 'cancelled' ? 'Cancelled' : `${done ? 'Done, ' : 'Sold '}${s.sold}/${s.capacity}`,
                                        ],
                                        done ? cls.past : cls.live,
                                        `/admin/showtimes/${s.id}`,
                                        s.tint[0]
                                    );
                                })}
                            {draft?.hallId === h.id &&
                                block(
                                    'draft',
                                    `New: ${draft.title}`,
                                    draft.startsAt,
                                    draft.endsAt,
                                    [`${formatTime(draft.startsAt)}–${formatTime(draft.endsAt)}`, 'Draft'],
                                    clsx(cls.draft, draft.conflict && cls.conflict)
                                )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
