export type SeatKind = 'standard' | 'premium';

export type Seat = { id: string; row: string; num: number; kind: SeatKind };

export type HallRow = { name: string; seats: Seat[] };

export type HallLayout = {
    rows: HallRow[];
    /** Seat count after which an aisle gap is drawn (per row) */
    aisles: number[];
    /** Name of the premium seat kind in the legend: "Sofa", "Premium" */
    premiumLabel: string;
    /** Big halls get zoom controls */
    big: boolean;
    /** Default zoom for big halls so the whole hall fits */
    fitZoom: number;
};

export type SeatMap = {
    sessionId: string;
    movieId: string;
    movieTitle: string;
    /** ISO string */
    startsAt: string;
    hall: string;
    taken: string[];
    /** USD cents */
    standardCents: number;
    premiumCents: number;
};

export type OrderStatus = 'pending' | 'paid' | 'expired' | 'cancelled';

export type Order = {
    id: string;
    /** Short code printed on the ticket: "94DC0B8C" */
    code: string;
    status: OrderStatus;
    sessionId: string;
    movieId: string;
    movieTitle: string;
    startsAt: string;
    hall: string;
    seats: string[];
    totalCents: number;
    /** ISO string, the seat hold ends here */
    expiresAt: string;
    /** Set when the ticket was scanned at the cinema */
    usedAt: string | null;
    email: string;
    tintColor: string;
};

export type PayResult = { status: 'paid' | 'declined' | 'expired'; order: Order };
