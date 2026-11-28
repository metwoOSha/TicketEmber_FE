import cls from './Switch.module.css';

type Props = { checked: boolean; onChange: (checked: boolean) => void; label: string };

export default function Switch({ checked, onChange, label }: Props) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            className={cls.switch}
            onClick={() => onChange(!checked)}
        >
            <span className={cls.knob} />
        </button>
    );
}
