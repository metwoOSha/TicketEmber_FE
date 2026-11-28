'use client';

import clsx from 'clsx';
import dayjs from 'dayjs';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { useState } from 'react';
import PageContainer from '@/components/PageContainer/PageContainer';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useOrder } from '@/hooks/useOrders';
import { formatDay, formatTime } from '@/utils/format';
import cls from './Ticket.module.css';

/** One ticket per seat: tabs switch between them. QR holds "<order code>-<seat number>". */
export default function Ticket({ id }: { id: string }) {
    const { data: order, isPending } = useOrder(id);
    const [index, setIndex] = useState(0);

    if (isPending) {
        return (
            <PageContainer>
                <div className={cls.page}>
                    <Skeleton width={920} height={380} radius={22} />
                </div>
            </PageContainer>
        );
    }
    if (!order || order.status !== 'paid') {
        return (
            <PageContainer>
                <p className={cls.missing}>
                    Ticket not found. <Link href="/my-tickets">My tickets</Link>
                </p>
            </PageContainer>
        );
    }

    const seat = order.seats[Math.min(index, order.seats.length - 1)];
    const code = `${order.code}-${String(order.seats.indexOf(seat) + 1).padStart(2, '0')}`;
    const used = !!order.usedAt;
    const row = seat[0];
    const num = seat.slice(1);

    return (
        <PageContainer>
            <div className={cls.page}>
                {order.seats.length > 1 && (
                    <div className={cls.tabs} role="tablist">
                        {order.seats.map((s, i) => (
                            <button
                                key={s}
                                type="button"
                                role="tab"
                                aria-selected={i === index}
                                className={cls.tab}
                                onClick={() => setIndex(i)}
                            >
                                TICKET {i + 1} OF {order.seats.length}
                            </button>
                        ))}
                    </div>
                )}

                <div className={clsx(cls.shadow, used && cls.shadowUsed)}>
                    <div className={cls.ticket}>
                        <div key={seat} className={cls.main}>
                            <div>
                                <div className={cls.head}>
                                    <span className={cls.admit}>ADMIT ONE</span>
                                    <span className={clsx(cls.state, used && cls.stateUsed)}>
                                        <i className={cls.stateDot} />
                                        {used ? 'USED' : 'VALID'}
                                    </span>
                                </div>
                                <div className={cls.title}>{order.movieTitle}</div>
                                <div className={cls.place}>Prospekt Mall, Kyiv</div>
                            </div>
                            <div className={cls.facts}>
                                <Fact label="DATE" value={formatDay(order.startsAt)} />
                                <Fact label="TIME" value={formatTime(order.startsAt)} />
                                <Fact label="HALL" value={order.hall} />
                                <Fact label="SEAT" value={`Row ${row} · Seat ${num}`} accent />
                            </div>
                        </div>

                        <div className={cls.qrSide}>
                            <div className={clsx(cls.qr, used && cls.qrUsed)}>
                                <QRCodeSVG title={`Ticket QR code ${code}`} value={code} size={176} bgColor="#F4F1EA" fgColor="#0B0B10" />
                            </div>
                            <span className={cls.idLabel}>TICKET ID</span>
                            <span className={cls.id}>{code}</span>
                            <span className={clsx(cls.help, used && cls.helpUsed)}>
                                {used ? `✓ Already scanned · ${dayjs(order.usedAt).format('D MMM HH:mm')}` : 'Scan at the entrance'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className={cls.actions}>
                    {/* TODO: PDF download comes from the backend */}
                    <button type="button" className={cls.primary} onClick={() => window.print()}>
                        Download PDF
                    </button>
                    <Link href="/my-tickets" className={cls.secondary}>
                        All tickets
                    </Link>
                </div>
            </div>
        </PageContainer>
    );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
    return (
        <div>
            <div className={cls.factLabel}>{label}</div>
            <div className={clsx(cls.factValue, accent && cls.factAccent)}>{value}</div>
        </div>
    );
}
