import clsx from 'clsx';
import type { ReactNode } from 'react';
import Button from '@/components/Button/Button';
import cls from './Table.module.css';

/** Table on a card: scrolls sideways inside its box on narrow screens, never the page. */
export default function Table({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div className={cls.scroll}>
            <table className={clsx(cls.table, className)}>{children}</table>
        </div>
    );
}

/** Header cell that sorts the table. */
export function SortHeader({ label, active, onSort, align }: { label: string; active: boolean; onSort: () => void; align?: 'right' }) {
    return (
        <th aria-sort={active ? 'descending' : 'none'} className={clsx(align === 'right' && cls.right)}>
            <button type="button" className={cls.sort} onClick={onSort}>
                {label}
                {active && <span aria-hidden>↓</span>}
            </button>
        </th>
    );
}

export function Pager({
    page,
    pages,
    total,
    shown,
    onPage,
}: {
    page: number;
    pages: number;
    total: number;
    shown: number;
    onPage: (page: number) => void;
}) {
    return (
        <div className={cls.pager}>
            <span className={cls.muted}>
                Showing {shown} of {total}
            </span>
            <div className={cls.pagerButtons}>
                <Button variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>
                    Previous
                </Button>
                <span>
                    Page {page} of {pages}
                </span>
                <Button variant="ghost" size="sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}

export const tableCls = cls;
