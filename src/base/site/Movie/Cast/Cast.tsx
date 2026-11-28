import SectionTitle from '@/components/SectionTitle/SectionTitle';
import type { CastMember } from '@/types/movie.types';
import { tmdbImage } from '@/utils/tmdb';
import cls from './Cast.module.css';

export default function Cast({ cast, tint }: { cast: CastMember[]; tint: string }) {
    return (
        <section className={cls.section}>
            <SectionTitle>CAST</SectionTitle>
            <div className={cls.list}>
                {cast.map((person) => {
                    const photo = tmdbImage(person.profilePath, 'w185');
                    return (
                        <div key={person.name} className={cls.person}>
                            <div className={cls.photo} style={{ background: `linear-gradient(175deg, ${tint}55, #07090a)` }}>
                                {photo ? (
                                    <img src={photo} alt={person.name} />
                                ) : (
                                    <svg viewBox="0 0 160 200" aria-hidden>
                                        <circle cx="80" cy="78" r="30" fill="currentColor" />
                                        <path d="M24 200c0-38 24-62 56-62s56 24 56 62z" fill="currentColor" />
                                    </svg>
                                )}
                            </div>
                            <div className={cls.name}>{person.name}</div>
                            <div className={cls.role}>{person.role}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
