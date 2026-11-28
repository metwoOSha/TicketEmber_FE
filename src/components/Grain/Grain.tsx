import cls from './Grain.module.css';

/** Film-grain overlay. Put it as the first child of a `position: relative` container. */
export default function Grain() {
    return <div className={cls.grain} aria-hidden />;
}
