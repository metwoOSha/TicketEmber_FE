import dayjs from 'dayjs';
import { CINEMA_TZ } from '@/utils/format';

const DATE_FMT = 'YYYY-MM-DD';

/** Today and the next days as "YYYY-MM-DD" in cinema time. */
export function getNextDays(count: number) {
    const today = dayjs().tz(CINEMA_TZ);
    return Array.from({ length: count }, (_, i) => today.add(i, 'day').format(DATE_FMT));
}

/** "Today · 24 Nov", otherwise "Wed 25 Nov". Takes "YYYY-MM-DD". */
export function formatDayLabel(date: string) {
    const d = dayjs.tz(date, CINEMA_TZ);
    return d.isSame(dayjs().tz(CINEMA_TZ), 'day') ? `Today · ${d.format('D MMM')}` : d.format('ddd D MMM');
}

/** "18:00" on a "YYYY-MM-DD" day -> ISO string. */
export function toStartsAt(date: string, time: string) {
    return dayjs.tz(`${date} ${time}`, CINEMA_TZ).toISOString();
}
