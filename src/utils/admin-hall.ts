import type { Hall, HallRowLayout, SeatKind } from '@/types/admin.types';

const ROW_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/** Rows and seats of a hall, with hand-painted overrides applied. */
export function buildHallLayout(hall: Hall): HallRowLayout[] {
    return Array.from({ length: hall.rows }, (_, i) => {
        const name = ROW_NAMES[i];
        const sofaRow = hall.sofaRow && i === hall.rows - 1 ? hall.sofaRow : null;
        const base: SeatKind = sofaRow ? 'sofa' : hall.premiumRows.includes(name) ? 'premium' : 'standard';
        return {
            name,
            aisles: sofaRow ? sofaRow.aisles : hall.aisles,
            seats: Array.from({ length: sofaRow ? sofaRow.count : hall.cols }, (_, c) => {
                const id = `${name}${c + 1}`;
                return { id, num: c + 1, kind: hall.overrides[id] ?? base };
            }),
        };
    });
}

/** The kind a seat has without overrides, to know when painting returns it to default. */
export function baseKind(hall: Hall, rowName: string): SeatKind {
    const isSofaRow = hall.sofaRow && ROW_NAMES.indexOf(rowName) === hall.rows - 1;
    return isSofaRow ? 'sofa' : hall.premiumRows.includes(rowName) ? 'premium' : 'standard';
}

export function countSeats(rows: HallRowLayout[]) {
    const count: Record<SeatKind, number> = { standard: 0, premium: 0, sofa: 0, blocked: 0 };
    for (const seat of rows.flatMap((r) => r.seats)) count[seat.kind] += 1;
    const total = count.standard + count.premium + count.sofa + count.blocked;
    return { ...count, total, sellable: total - count.blocked };
}
