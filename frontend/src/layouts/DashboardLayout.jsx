import { Bell, Menu, ArrowLeft } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

const DashboardLayout = ({ children, pageTitle, pageSubtitle }) => {
    const { user, role } = useAuth()
    const location = useLocation()

    const dashboardMap = {
        PWD_USER: '/dashboard',
        ADMIN: '/admin/dashboard',
        DOCTOR: '/doctor/dashboard',
    }

    const dashboardPath = dashboardMap[role] || '/dashboard'
    const isDashboard = location.pathname === dashboardPath

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        {!isDashboard && (
                            <Link
                                title="Back to Dashboard"
                                to={dashboardPath}
                                className="btn btn-ghost btn-sm"
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    padding: 0,
                                    borderRadius: '50%',
                                    justifyContent: 'center',
                                    color: 'var(--color-slate-400)'
                                }}
                            >
                                <ArrowLeft size={18} />
                            </Link>
                        )}
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
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link to="/profile" title="View Profile" style={{ textDecoration: 'none' }}>
                        <div style={{
                            width: '34px', height: '34px', borderRadius: '50%',
                            background: 'var(--color-green-700)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center',
                            color: 'white', fontFamily: 'var(--font-serif)',
                            fontSize: '14px', fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'transform 0.15s'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                    </Link>
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
