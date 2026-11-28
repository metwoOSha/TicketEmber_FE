'use client';

import { type ReactNode, useEffect, useId, useRef } from 'react';
import Button from '@/components/Button/Button';
import Icon from '@/components/Icon/Icon';
import cls from './Dialog.module.css';

type Props = {
    open: boolean;
    title: string;
    onClose: () => void;
    children: ReactNode;
    footer?: ReactNode;
    /** alertdialog for destructive confirmations: no close button, ESC still cancels */
    alert?: boolean;
    width?: number;
};

/**
 * Native <dialog> opened with showModal(): the browser traps focus, ESC closes,
 * and focus goes back to the button that opened it.
 */
export default function Dialog({ open, title, onClose, children, footer, alert, width = 560 }: Props) {
    const ref = useRef<HTMLDialogElement>(null);
    const titleId = useId();

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog) return;
        if (open && !dialog.open) {
            dialog.showModal();
            // showModal() focuses the first control; a child can ask for the focus with data-autofocus
            dialog.querySelector<HTMLElement>('[data-autofocus]')?.focus();
        }
        if (!open && dialog.open) dialog.close();
    }, [open]);

    return (
        <dialog
            ref={ref}
            className={cls.dialog}
            style={{ width: `min(${width}px, calc(100vw - 32px))` }}
            role={alert ? 'alertdialog' : undefined}
            aria-labelledby={titleId}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
        >
            {open && (
                <>
                    <div className={cls.head}>
                        <h2 id={titleId} className={cls.title}>
                            {title}
                        </h2>
                        {!alert && (
                            <Button variant="ghost" size="sm" aria-label="Close" onClick={onClose}>
                                <Icon name="close" size={16} />
                            </Button>
                        )}
                    </div>
                    <div className={cls.body}>{children}</div>
                    {footer && <div className={cls.footer}>{footer}</div>}
                </>
            )}
        </dialog>
    );
}
