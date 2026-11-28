import clsx from 'clsx';
import { formatMoney } from '@/utils/format';
import cls from './SeatLegend.module.css';

type Props = { premiumLabel: string; standardCents: number; premiumCents: number; free: number; total: number };

export default function SeatLegend({ premiumLabel, standardCents, premiumCents, free, total }: Props) {
    return (
        <>
            <div className={cls.legend}>
                <span>
                    <i className={cls.dot} />
                    Standard {formatMoney(standardCents)}
                </span>
                <span>
                    <i className={clsx(cls.dot, cls.premium)} />
                    {premiumLabel} {formatMoney(premiumCents)}
                </span>
                <span>
                    <i className={clsx(cls.dot, cls.mine)} />
                    Your seat
                </span>
                <span>
                    <i className={clsx(cls.dot, cls.taken)} />
                    Taken
                </span>
            </div>
            <div className={clsx(cls.free, free < 10 && cls.low)}>
                {free} of {total} seats left
            </div>
        </>
    );
}
