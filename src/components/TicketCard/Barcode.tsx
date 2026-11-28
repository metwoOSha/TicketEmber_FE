import cls from './Barcode.module.css';

/** Decorative barcode with the order code under it. */
export default function Barcode({ code }: { code: string }) {
    return (
        <>
            <div className={cls.bars} aria-hidden />
            <span className={cls.code}>ORDER {code}</span>
        </>
    );
}
