import Skeleton from '@/components/Skeleton/Skeleton';
import cls from './MovieSkeleton.module.css';

/** Layout-matching placeholder while the movie loads. */
export default function MovieSkeleton() {
    return (
        <div className={cls.page} aria-busy="true">
            <div className={cls.text}>
                <Skeleton width={110} height={14} />
                <Skeleton width={120} height={12} />
                <Skeleton width="min(620px, 100%)" height={104} />
                <Skeleton width={420} height={16} />
                <Skeleton width={250} height={44} />
                <Skeleton width={540} height={14} />
                <Skeleton width={360} height={14} />
                <Skeleton width={190} height={52} radius={26} />
            </div>
            <Skeleton className={cls.poster} width={340} height={510} radius={6} />
        </div>
    );
}
