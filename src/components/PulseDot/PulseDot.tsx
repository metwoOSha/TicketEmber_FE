import clsx from 'clsx';
import cls from './PulseDot.module.css';

type Props = { color?: 'accent' | 'warning'; size?: number; className?: string };

export default function PulseDot({ color = 'accent', size = 10, className }: Props) {
    return <span className={clsx(cls.dot, cls[color], className)} style={{ width: size, height: size }} aria-hidden />;
}
