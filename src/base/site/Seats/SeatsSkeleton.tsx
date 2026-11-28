import Skeleton from '@/components/Skeleton/Skeleton';
import cls from './Seats.module.css';

export default function SeatsSkeleton() {
    return (
        <div className={cls.page}>
            <div className={cls.main}>
                <div className={cls.head}>
                    <Skeleton width={64} height={14} />
                    <Skeleton width={260} height={40} />
                    <Skeleton width={320} height={16} />
                </div>
                <div className={cls.skeletonMap}>
                    <Skeleton width={420} height={42} radius="50%" />
                    {Array.from({ length: 9 }, (_, i) => (
                        <Skeleton key={i} width={480} height={28} />
                    ))}
                </div>
            </div>
            <Skeleton width={280} height={460} radius={8} />
        </div>
    );
}
