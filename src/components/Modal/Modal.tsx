'use client';

import { type ReactNode, useEffect } from 'react';
import cls from './Modal.module.css';

type Props = { label: string; onClose: () => void; children: ReactNode };

/** Full-screen dimmed overlay. Closes on ESC and on click outside the content. */
export default function Modal({ label, onClose, children }: Props) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
    }, [onClose]);

    return (
        <dialog open className={cls.overlay} aria-label={label}>
            <button type="button" className={cls.backdrop} aria-label="Close" tabIndex={-1} onClick={onClose} />
            <button type="button" className={cls.close} onClick={onClose} aria-label="Close">
                <span className={cls.esc}>ESC</span>Close
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                    <path d="M2 2l10 10M12 2L2 12" />
                </svg>
            </button>
            <div className={cls.content}>{children}</div>
        </dialog>
    );
}
