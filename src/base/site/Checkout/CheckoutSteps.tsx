import clsx from 'clsx';
import Link from 'next/link';
import cls from './CheckoutSteps.module.css';

/** SEATS -> PAYMENT -> TICKETS. Seats is a link back while the order is open. */
export default function CheckoutSteps({ seatsHref }: { seatsHref: string }) {
    return (
        <nav className={cls.steps} aria-label="Booking steps">
            <Link href={seatsHref} className={cls.done}>
                ✓ SEATS
            </Link>
            <span className={cls.line} />
            <span className={clsx(cls.step, cls.current)} aria-current="step">
                PAYMENT
            </span>
            <span className={cls.line} />
            <span className={cls.step}>TICKETS</span>
        </nav>
    );
}
