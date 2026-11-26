import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

// Sessions are shown in cinema time, not the visitor's time.
export const CINEMA_TZ = 'Europe/Kyiv';

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
const usdWhole = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
});

/** Amount in cents -> "$12" or "$12.50". */
export function formatMoney(cents: number) {
    return cents % 100 === 0 ? usdWhole.format(cents / 100) : usd.format(cents / 100);
}

const inCinema = (date: Date | string) => dayjs(date).tz(CINEMA_TZ);

/** "18:00" */
export function formatTime(date: Date | string) {
    return inCinema(date).format('HH:mm');
}

/** "Today · 24 Nov", otherwise "Wed 25 Nov". */
export function formatDay(date: Date | string) {
    const d = inCinema(date);
    return d.isSame(dayjs().tz(CINEMA_TZ), 'day') ? `Today · ${d.format('D MMM')}` : d.format('ddd D MMM');
}
