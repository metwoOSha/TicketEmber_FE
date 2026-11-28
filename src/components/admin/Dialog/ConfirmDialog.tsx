'use client';

import { useState } from 'react';
import Button from '@/components/Button/Button';
import Dialog from './Dialog';
import cls from './Dialog.module.css';

type Props = {
    open: boolean;
    title: string;
    /** What will happen, one line each */
    consequences: string[];
    confirmLabel: string;
    cancelLabel: string;
    onConfirm: () => void;
    onClose: () => void;
    loading?: boolean;
    /** When set, the confirm button stays disabled until this box is ticked */
    acknowledge?: string;
};

/** Confirmation for actions that can't be undone: says what happens, then asks. */
export default function ConfirmDialog({ open, title, onClose, ...body }: Props) {
    return (
        <Dialog open={open} alert width={520} title={title} onClose={onClose}>
            {/* Mounted only while open, so the checkbox starts unticked every time */}
            <ConfirmBody onClose={onClose} {...body} />
        </Dialog>
    );
}

function ConfirmBody({ consequences, confirmLabel, cancelLabel, onConfirm, onClose, loading, acknowledge }: Omit<Props, 'open' | 'title'>) {
    const [ack, setAck] = useState(false);

    return (
        <>
            <p className={cls.muted}>What happens:</p>
            <ul className={cls.list}>
                {consequences.map((c) => (
                    <li key={c}>{c}</li>
                ))}
            </ul>
            <p className={cls.strong}>This can&apos;t be undone.</p>
            {acknowledge && (
                <label className={cls.check}>
                    <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} />
                    <span>{acknowledge}</span>
                </label>
            )}
            <div className={cls.actions}>
                <Button
                    variant="ghost"
                    size="md"
                    // The safe choice gets the first focus in a destructive dialog
                    data-autofocus
                    onClick={onClose}
                >
                    {cancelLabel}
                </Button>
                <Button variant="dangerSolid" size="md" loading={loading} disabled={!!acknowledge && !ack} onClick={onConfirm}>
                    {confirmLabel}
                </Button>
            </div>
        </>
    );
}
