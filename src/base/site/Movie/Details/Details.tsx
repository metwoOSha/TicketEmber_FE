import SectionTitle from '@/components/SectionTitle/SectionTitle';
import type { MovieDetails } from '@/types/movie.types';
import cls from './Details.module.css';

export default function Details({ info }: { info: MovieDetails['info'] }) {
    return (
        <section className={cls.section}>
            <SectionTitle>DETAILS</SectionTitle>
            <div className={cls.grid}>
                {info.map((item) => (
                    <div key={item.label} className={cls.item}>
                        <div className={cls.label}>{item.label}</div>
                        <div className={cls.value}>{item.value}</div>
                    </div>
                ))}
            </div>
        </section>
    );
}
