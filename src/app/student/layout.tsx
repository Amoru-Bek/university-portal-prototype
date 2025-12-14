import { logout } from '../actions'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen">
            {/* Navbar */}
            <nav style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                borderBottom: '1px solid rgba(0,0,0,0.1)',
                padding: '16px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                position: 'sticky',
                top: 0,
                zIndex: 50
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img
                        src="/logo.jpg"
                        alt="UnivPortal Logo"
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover'
                        }}
                    />
                    <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--foreground)' }}>
                        بوابة الطالب
                    </span>
                </div>

                <form action={logout}>
                    <button type="submit" className="btn-danger">
                        تسجيل الخروج
                    </button>
                </form>
            </nav>

            {/* Main Content */}
            <main style={{ padding: '40px 24px' }}>
                {children}
            </main>
        </div>
    )
}
