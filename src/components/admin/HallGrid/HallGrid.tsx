'use client';

import clsx from 'clsx';
import { type KeyboardEvent, useRef, useState } from 'react';
import type { HallRowLayout, HallSeat } from '@/types/admin.types';
import cls from './HallGrid.module.css';

type SaleState = 'sold' | 'held' | 'free';

type Props = {
    rows: HallRowLayout[];
    /** Accessible name of the whole map */
    label: string;
} & (
    | { mode: 'edit'; onPaint: (seat: HallSeat, rowName: string) => void; stateOf?: never }
    | { mode: 'view'; stateOf: (seatId: string) => SaleState; onPaint?: never }
);

const MOVES: Record<string, [number, number]> = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] };

/**
 * Seat map of a hall. Edit mode: every seat is a button, but only one is in the Tab order;
 * arrow keys move between seats, Enter or Space paints. View mode: a picture with a text label.
 */
export default function HallGrid(props: Props) {
    const { rows, label, mode } = props;
    const [focus, setFocus] = useState(rows[0]?.seats[0]?.id ?? '');
    const gridRef = useRef<HTMLDivElement>(null);

    const move = (r: number, c: number) => {
        const row = Math.max(0, Math.min(rows.length - 1, r));
        const col = Math.max(0, Math.min(rows[row].seats.length - 1, c));
        const next = rows[row].seats[col].id;
        setFocus(next);
        gridRef.current?.querySelector<HTMLButtonElement>(`[data-seat="${next}"]`)?.focus();
    };

    const onKey = (e: KeyboardEvent, r: number, c: number) => {
        const delta = MOVES[e.key];
        if (delta) move(r + delta[0], c + delta[1]);
        else if (e.key === 'Home') move(r, 0);
        else if (e.key === 'End') move(r, rows[r].seats.length - 1);
        else return;
        e.preventDefault();
    };

    return (
        <div className={cls.wrap}>
            <div className={cls.screen} aria-hidden />
            <span className={cls.screenLabel} aria-hidden>
                SCREEN
            </span>
            <div
                ref={gridRef}
                className={cls.grid}
                role={mode === 'edit' ? 'group' : 'img'}
                aria-label={mode === 'edit' ? `${label}. Arrow keys move between seats, Enter paints the seat.` : label}
            >
                {rows.map((row, r) => (
                    <div key={row.name} className={cls.row} aria-hidden={mode === 'view'}>
                        <span className={cls.rowName}>{row.name}</span>
                        <div className={cls.seats}>
                            {row.seats.map((seat, c) => {
                                const classes = clsx(
                                    cls.seat,
                                    cls[seat.kind],
                                    mode === 'view' && cls[props.stateOf(seat.id)],
                                    row.aisles.includes(seat.num) && cls.aisle
                                );
                                return mode === 'edit' ? (
                                    <button
                                        key={seat.id}
                                        type="button"
                                        data-seat={seat.id}
                                        tabIndex={seat.id === focus ? 0 : -1}
                                        className={classes}
                                        aria-label={`Row ${row.name}, seat ${seat.num}, ${seat.kind}`}
                                        onClick={() => {
                                            setFocus(seat.id);
                                            props.onPaint(seat, row.name);
                                        }}
                                        onKeyDown={(e) => onKey(e, r, c)}
                                    >
                                        {seat.kind === 'blocked' ? '×' : seat.num}
                                    </button>
                                ) : (
                                    <span key={seat.id} className={classes} title={`${seat.id}, ${props.stateOf(seat.id)}`} />
                                );
                            })}
                        </div>
                        <span className={cls.rowName}>{row.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/** Legend swatch that matches the seat look. */
export function SeatSwatch({ kind, state }: { kind: HallSeat['kind']; state?: SaleState }) {
    return <span className={clsx(cls.seat, cls.swatch, cls[kind], state && cls[state])} aria-hidden />;
}
