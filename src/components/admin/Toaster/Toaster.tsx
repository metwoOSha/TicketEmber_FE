'use client';

import Icon from '@/components/Icon/Icon';
import { useAdminUi } from '@/store/admin-ui.store';
import cls from './Toaster.module.css';

/** Short confirmations after an action ("Order cancelled"). Read out by screen readers. */
export default function Toaster() {
    const { toasts, dismiss } = useAdminUi();

    return (
        <output className={cls.stack} aria-live="polite">
            {toasts.map((t) => (
                <div key={t.id} className={cls.toast}>
                    <Icon name="check" />
                    <span>{t.text}</span>
                    <button type="button" className={cls.dismiss} onClick={() => dismiss(t.id)}>
                        Dismiss
                    </button>
                </div>
            ))}
        </output>
    );
}
