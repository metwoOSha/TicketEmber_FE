import '@/styles/admin-tokens.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div data-theme="admin" style={{ minHeight: '100vh' }}>
            {children}
        </div>
    );
}
