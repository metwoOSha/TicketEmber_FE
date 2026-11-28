import type { HallLayout, HallRow, SeatKind } from '@/types/booking.types';

type HallConfig = {
    rows: number;
    cols: number;
    aisles: number[];
    premiumLabel: string;
    big: boolean;
    fitZoom: number;
    /** Decides which seats are premium */
    kindOf: (rowIndex: number, rowCount: number) => SeatKind;
    /** The last row can differ (sofas) */
    lastRowCols?: number;
    lastRowAisles?: number[];
};

const HALLS: Record<string, HallConfig> = {
    'Small Hall': {
        rows: 9,
        cols: 14,
        aisles: [7],
        premiumLabel: 'Sofa',
        big: false,
        fitZoom: 1,
        kindOf: (i, n) => (i === n - 1 ? 'premium' : 'standard'),
        lastRowCols: 8,
        lastRowAisles: [4],
    },
    'Big Hall': {
        rows: 12,
        cols: 15,
        aisles: [5, 10],
        premiumLabel: 'Premium',
        big: true,
        fitZoom: 0.8,
        kindOf: (i) => (i >= 4 && i <= 7 ? 'premium' : 'standard'),
    },
    'IMAX Hall': {
        rows: 15,
        cols: 20,
        aisles: [5, 15],
        premiumLabel: 'Premium',
        big: true,
        fitZoom: 0.6,
        kindOf: (i) => (i >= 5 && i <= 10 ? 'premium' : 'standard'),
    },
};

const ROW_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Seat grid of a hall by its name. The backend will send this later. */
export function getHallLayout(hall: string): HallLayout {
    const config = HALLS[hall] ?? HALLS['Small Hall'];

    const rows: HallRow[] = Array.from({ length: config.rows }, (_, i) => {
        const name = ROW_NAMES[i];
        const isLast = i === config.rows - 1;
        const cols = isLast && config.lastRowCols ? config.lastRowCols : config.cols;
        return {
            name,
            seats: Array.from({ length: cols }, (_, c) => ({
                id: `${name}${c + 1}`,
                row: name,
                num: c + 1,
                kind: config.kindOf(i, config.rows),
            })),
        };
    });

    return {
        rows,
        aisles: config.aisles,
        premiumLabel: config.premiumLabel,
        big: config.big,
        fitZoom: config.fitZoom,
    };
}

/** Aisles of a specific row (the sofa row has its own). */
export function getRowAisles(layout: HallLayout, rowName: string, hall: string) {
    const config = HALLS[hall] ?? HALLS['Small Hall'];
    const isLast = rowName === layout.rows[layout.rows.length - 1].name;
    return isLast && config.lastRowAisles ? config.lastRowAisles : layout.aisles;
}

export const MAX_SEATS = 6;
export const HOLD_MINUTES = 15;

/** "C5, C6" -> "Row C · 5, 6" (several rows are joined with " / "). */
export function formatSeats(ids: string[]) {
    const byRow = new Map<string, number[]>();
    for (const id of ids) {
        const row = id[0];
        byRow.set(row, [...(byRow.get(row) ?? []), Number(id.slice(1))]);
    }
    return [...byRow.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([row, nums]) => `Row ${row} · ${nums.sort((a, b) => a - b).join(', ')}`)
        .join(' / ');
}
