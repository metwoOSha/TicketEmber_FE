import cls from './ZoomControls.module.css';

type Props = { zoom: number; onChange: (zoom: number) => void; fit: number };

const STEP = 0.1;

/** Zoom for big halls. */
export default function ZoomControls({ zoom, onChange, fit }: Props) {
    const set = (value: number) => onChange(Math.min(1.4, Math.max(0.4, Math.round(value * 10) / 10)));

    return (
        <div className={cls.zoom}>
            <button type="button" className={cls.btn} aria-label="Zoom out" onClick={() => set(zoom - STEP)}>
                −
            </button>
            <span className={cls.value}>{Math.round(zoom * 100)}%</span>
            <button type="button" className={cls.btn} aria-label="Zoom in" onClick={() => set(zoom + STEP)}>
                +
            </button>
            <button type="button" className={cls.fit} onClick={() => onChange(fit)}>
                Fit to screen
            </button>
        </div>
    );
}
