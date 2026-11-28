import SectionTitle from '@/components/SectionTitle/SectionTitle';
import { tmdbImage } from '@/utils/tmdb';
import cls from './Stills.module.css';

export default function Stills({ paths }: { paths: string[] }) {
    if (paths.length === 0) return null;

    return (
        <section className={cls.section}>
            <div className={cls.head}>
                <SectionTitle action={<span className={cls.hint}>Scroll →</span>}>STILLS</SectionTitle>
            </div>
            <div className={cls.scroll}>
                {paths.map((path) => (
                    <img key={path} className={cls.still} src={tmdbImage(path, 'w780') ?? ''} alt="" loading="lazy" />
                ))}
            </div>
        </section>
    );
}
