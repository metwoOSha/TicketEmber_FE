import clsx from 'clsx';
import type { HallLayout } from '@/types/booking.types';
import { getRowAisles } from '@/utils/hall';
import { formatMoney } from '@/utils/format';
import cls from './SeatMap.module.css';

type Props = {
    layout: HallLayout;
    hall: string;
    taken: Set<string>;
    selected: string[];
    /** Seat that was lost to someone else: flashes red */
    flashing: string | null;
    zoom: number;
    standardCents: number;
    premiumCents: number;
    onToggle: (id: string) => void;
};

export default function SeatMap({ layout, hall, taken, selected, flashing, zoom, standardCents, premiumCents, onToggle }: Props) {
    const wide = layout.premiumLabel === 'Sofa';
    const cols = Math.max(...layout.rows.map((r) => r.seats.length));
    // Screen arc is as wide as the widest row
    const screenWidth = Math.round(cols * 38 * 0.9);

    return (
        <div className={cls.wrap}>
            <div className={cls.screen} style={{ width: screenWidth }} />
            <span className={cls.screenLabel}>SCREEN</span>

            <div className={cls.grid} style={{ transform: `scale(${zoom})`, marginBottom: `${(zoom - 1) * layout.rows.length * 38}px` }}>
                {layout.rows.map((row, rowIndex) => {
                    const aisles = getRowAisles(layout, row.name, hall);
                    return (
                        <div key={row.name} className={cls.row} style={{ animationDelay: `${0.35 + rowIndex * 0.04}s` }}>
                            <span className={cls.rowName}>{row.name}</span>
                            <div className={cls.seats}>
                                {row.seats.map((seat) => {
                                    const isTaken = taken.has(seat.id);
                                    const isSelected = selected.includes(seat.id);
                                    const price = formatMoney(seat.kind === 'premium' ? premiumCents : standardCents);
                                    return (
                                        <span key={seat.id} className={cls.cell}>
                                            {aisles.includes(seat.num - 1) && <span className={cls.aisle} />}
                                            <button
                                                type="button"
                                                disabled={isTaken}
                                                aria-pressed={isSelected}
                                                aria-label={`Row ${seat.row}, seat ${seat.num}, ${isTaken ? 'taken' : `${seat.kind}, ${price}`}`}
                                                className={clsx(
                                                    cls.seat,
                                                    seat.kind === 'premium' && cls.premium,
                                                    seat.kind === 'premium' && wide && cls.wide,
                                                    isTaken && cls.taken,
                                                    isSelected && cls.selected,
                                                    flashing === seat.id && cls.flash
                                                )}
                                                onClick={() => onToggle(seat.id)}
                                            >
                                                {isTaken ? '' : seat.num}
                                            </button>
                                        </span>
                                    );
                                })}
                            </div>
                            <span className={cls.rowName}>{row.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
