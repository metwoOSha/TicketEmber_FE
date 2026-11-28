import clsx from 'clsx';
import Link from 'next/link';
import Chip from '@/components/Chip/Chip';
import type { Session } from '@/types/movie.types';
import { formatMoney, formatTime } from '@/utils/format';
import { getNextDayMark, getSessionStatus } from '@/utils/session';
import cls from './SessionRow.module.css';

const STATUS_TEXT = { ok: '', almost: 'Only ', sold: 'Sold out', started: 'Started' } as const;

export default function SessionRow({ session }: { session: Session }) {
    const status = getSessionStatus(session);
    const disabled = status === 'sold' || status === 'started';
    const pct = disabled ? 0 : Math.round((session.seatsFree / session.seatsTotal) * 100);
    const seatsText = disabled ? STATUS_TEXT[status] : `${STATUS_TEXT[status]}${session.seatsFree} of ${session.seatsTotal} left`;

    const content = (
        <>
            <span className={cls.start}>{formatTime(session.startsAt)}</span>
            <span className={cls.format}>
                <Chip>{session.format}</Chip>
                <span className={cls.lang}>{session.language}</span>
            </span>
            <span className={cls.text}>{session.hall}</span>
            <span className={cls.text}>
                {formatTime(session.endsAt)}
                <sup className={cls.plus}>{getNextDayMark(session)}</sup>
            </span>
            <span className={cls.seats}>
                <span className={cls.bar}>
                    <span className={clsx(cls.fill, status === 'almost' && cls.warn)} style={{ width: `${pct}%` }} />
                </span>
                <span className={clsx(cls.seatsText, status === 'almost' && cls.warnText)}>{seatsText}</span>
            </span>
            <span className={cls.text}>
                <span className={cls.from}>from </span>
                {formatMoney(session.priceFromCents)}
            </span>
            <span className={cls.arrow}>{disabled ? '' : '→'}</span>
        </>
    );

    if (disabled) {
        return (
            <div className={clsx(cls.row, cls.disabled, status === 'sold' ? cls.sold : cls.started)} aria-disabled>
                {content}
            </div>
        );
    }

    return (
        <Link href={`/seats/${session.id}`} className={cls.row}>
            {content}
        </Link>
    );
}
