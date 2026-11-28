import Modal from '@/components/Modal/Modal';
import type { MovieDetails } from '@/types/movie.types';
import cls from './TrailerModal.module.css';

type Props = { movie: MovieDetails; onClose: () => void };

export default function TrailerModal({ movie, onClose }: Props) {
    return (
        <Modal label={`${movie.title}, official trailer`} onClose={onClose}>
            <div className={cls.player}>
                {movie.trailerKey ? (
                    <iframe
                        src={`https://www.youtube-nocookie.com/embed/${movie.trailerKey}?autoplay=1`}
                        title={`${movie.title} trailer`}
                        allow="autoplay; encrypted-media; picture-in-picture"
                        allowFullScreen
                    />
                ) : (
                    <p className={cls.none}>Trailer is not available yet.</p>
                )}
            </div>
        </Modal>
    );
}
