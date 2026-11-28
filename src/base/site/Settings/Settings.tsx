'use client';

import Link from 'next/link';
import Button from '@/components/Button/Button';
import PageContainer from '@/components/PageContainer/PageContainer';
import { useLogout } from '@/hooks/useAuth';
import { useOrders } from '@/hooks/useOrders';
import { useAuthStore } from '@/store/auth.store';
import cls from './Settings.module.css';

export default function Settings() {
    const user = useAuthStore((s) => s.user);
    const { data: orders } = useOrders();
    const logout = useLogout();

    // TODO: values come from /users/me; edit and change-password forms are added with the backend.
    const fields = [
        { label: 'NAME', value: user?.name ?? 'Dmytro', action: 'Edit' },
        { label: 'EMAIL', value: user?.email ?? 'dmytro@example.com', action: 'Edit' },
        { label: 'PASSWORD', value: '••••••••••', action: 'Change password' },
    ];

    return (
        <PageContainer>
            <div className={cls.layout}>
                <nav className={cls.menu}>
                    <span className={cls.active}>Profile</span>
                    <Link href="/my-tickets" className={cls.item}>
                        My tickets
                    </Link>
                    <span className={cls.item}>Security</span>
                </nav>

                <div className={cls.content}>
                    <h1 className={cls.title}>Profile</h1>
                    <p className={cls.meta}>Member since Oct 2026 · {orders?.length ?? 0} orders</p>

                    <div className={cls.list}>
                        {fields.map((f) => (
                            <div key={f.label} className={cls.field}>
                                <div className={cls.fieldText}>
                                    <span className={cls.label}>{f.label}</span>
                                    <span className={cls.value}>{f.value}</span>
                                </div>
                                <button type="button" className={cls.edit}>
                                    {f.action}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className={cls.footer}>
                        <Button variant="ghost" loading={logout.isPending} onClick={() => logout.mutate()}>
                            Log out
                        </Button>
                        <span className={cls.note}>You will stay logged in on other devices.</span>
                    </div>
                </div>
            </div>
        </PageContainer>
    );
}
