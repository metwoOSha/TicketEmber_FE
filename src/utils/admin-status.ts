import type { OrderStatus } from '@/types/booking.types';
import type { ShowtimeStatus, Tone } from '@/types/admin.types';

export const ORDER_STATUS: Record<OrderStatus, { label: string; tone: Tone }> = {
    pending: { label: 'Awaiting payment', tone: 'warn' },
    paid: { label: 'Paid', tone: 'ok' },
    expired: { label: 'Expired', tone: 'mute' },
    cancelled: { label: 'Cancelled', tone: 'mute' },
};

export const SHOWTIME_STATUS: Record<ShowtimeStatus, { label: string; tone: Tone }> = {
    finished: { label: 'Finished', tone: 'mute' },
    running: { label: 'Running', tone: 'info' },
    'on-sale': { label: 'On sale', tone: 'ok' },
    'almost-full': { label: 'Almost full', tone: 'warn' },
    'sold-out': { label: 'Sold out', tone: 'bad' },
    cancelled: { label: 'Cancelled', tone: 'mute' },
};

/** 12 -> "+12%", -3 -> "−3%" */
export const formatChange = (value: number, unit = '') => `${value >= 0 ? '+' : '−'}${Math.abs(value)}${unit}`;
