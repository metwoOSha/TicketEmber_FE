import dayjs from 'dayjs';
import type { Session, SessionStatus } from '@/types/movie.types';
import { CINEMA_TZ } from '@/utils/format';

export function getSessionStatus(session: Session): SessionStatus {
    if (dayjs(session.startsAt).isBefore(dayjs())) return 'started';
    if (session.seatsFree === 0) return 'sold';
    if (session.seatsFree < 10) return 'almost';
    return 'ok';
}

/** "+1" when the session ends after midnight, otherwise "". */
export function getNextDayMark(session: Session) {
    const start = dayjs(session.startsAt).tz(CINEMA_TZ);
    const end = dayjs(session.endsAt).tz(CINEMA_TZ);
    return end.isSame(start, 'day') ? '' : '+1';
}

/** "YYYY-MM-DD" of the session in cinema time. */
export function getSessionDay(session: Session) {
    return dayjs(session.startsAt).tz(CINEMA_TZ).format('YYYY-MM-DD');
}
