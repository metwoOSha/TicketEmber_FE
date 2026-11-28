import clsx from 'clsx';
import type { ReactNode } from 'react';
import { formatDay, formatTime } from '@/utils/format';
import cls from './TicketCard.module.css';

type Props = {
    admit: string;
    movieTitle: string;
    startsAt: string;
    seatsText: string;
    /** Under the perforation: barcode, QR code */
    bottom: ReactNode;
    /** Tinted when the ticket was used */
    muted?: boolean;
};

/** Big ticket with side notches and a dashed perforation, used at checkout and on the ticket page. */
export default function TicketCard({ admit, movieTitle, startsAt, seatsText, bottom, muted }: Props) {
    return (
        <div className={clsx(cls.card, muted && cls.muted)}>
            <div className={cls.top}>
                <span className={cls.label}>{admit}</span>
                <span className={cls.title}>{movieTitle}</span>
                <span className={cls.day}>{formatDay(startsAt)}</span>
                <span className={cls.time}>{formatTime(startsAt)}</span>
                <span className={cls.label + ' ' + cls.seatsLabel}>SEATS</span>
                <span className={cls.seats}>{seatsText}</span>
            </div>
            <div className={cls.perf} />
            <div className={cls.bottom}>{bottom}</div>
        </div>
    );
}
