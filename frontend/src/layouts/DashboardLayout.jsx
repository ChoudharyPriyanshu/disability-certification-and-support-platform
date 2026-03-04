import { Bell, Menu } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({ children, pageTitle, pageSubtitle }) => {
    const { user, role } = useAuth()

    const bgMap = {
        PWD_USER: 'var(--color-ivory)',
        ADMIN: 'var(--surface-admin)',
        DOCTOR: 'var(--surface-doctor)',
    }

    return (
        <div className="dashboard-layout">
            <Sidebar />

            <div className="dashboard-main">
                {/* Top bar */}
                <header className="dashboard-topbar">
                    <div>
                        {pageTitle && (
                            <h2 style={{ fontSize: '1.0625rem', fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-slate-900)' }}>
                                {pageTitle}
                            </h2>
                        )}
                        {pageSubtitle && (
                            <p style={{ fontSize: '12px', color: 'var(--color-slate-400)', marginTop: '1px' }}>
                                {pageSubtitle}
                            </p>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'var(--color-green-700)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontFamily: 'var(--font-serif)',
                            fontSize: '14px', fontWeight: 700
                        }}>
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Main content */}
                <main
                    className="dashboard-content"
                    style={{ background: bgMap[role] || 'var(--color-ivory)' }}
                >
                    {children}
                </main>
            </div>
        </div>
    )
}

export default DashboardLayout
