import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    LayoutDashboard, FileText, Award, ShoppingBag, BookOpen,
    Users, ClipboardList, Settings, LogOut, Stethoscope,
    Shield, ChevronRight
} from 'lucide-react'

const navConfig = {
    PWD_USER: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/apply', icon: FileText, label: 'Apply for Certificate' },
        { to: '/my-applications', icon: ClipboardList, label: 'My Applications' },
        { to: '/my-certificates', icon: Award, label: 'My Certificates' },
        { to: '/schemes', icon: BookOpen, label: 'Government Schemes' },
        { to: '/equipment', icon: ShoppingBag, label: 'Assistive Equipment' },
        { to: '/orders', icon: ShoppingBag, label: 'My Orders' },
    ],
    ADMIN: [
        { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/admin/applications', icon: ClipboardList, label: 'Applications' },
        { to: '/admin/certificates', icon: Award, label: 'Certificates' },
        { to: '/admin/doctors', icon: Stethoscope, label: 'Doctors' },
        { to: '/admin/schemes', icon: BookOpen, label: 'Schemes' },
        { to: '/admin/products', icon: ShoppingBag, label: 'Products' },
    ],
    DOCTOR: [
        { to: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/doctor/cases', icon: ClipboardList, label: 'Assigned Cases' },
    ],
}

const roleMeta = {
    PWD_USER: { label: 'Citizen Portal', color: 'var(--color-green-700)', bg: 'var(--color-ivory)' },
    ADMIN: { label: 'Medical Authority', color: '#1e3a5f', bg: 'var(--surface-admin)' },
    DOCTOR: { label: 'Doctor Portal', color: '#1e4a35', bg: 'var(--surface-doctor)' },
}

const Sidebar = () => {
    const { user, role, logout } = useAuth()
    const navigate = useNavigate()
    const nav = navConfig[role] || []
    const meta = roleMeta[role] || roleMeta.PWD_USER

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <aside className="sidebar">
            {/* Header */}
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                    <div style={{
                        width: '36px', height: '36px', borderRadius: '8px',
                        background: meta.color, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                        <Shield size={18} color="white" />
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-slate-400)' }}>
                            {meta.label}
                        </div>
                    </div>
                </div>
                <div style={{
                    background: 'var(--color-ivory-dark)',
                    borderRadius: 'var(--radius-md)',
                    padding: '10px 12px',
                }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.name}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.email}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ padding: '12px 0', flex: 1 }}>
                {nav.map(({ to, icon: Icon, label }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={to.endsWith('dashboard')}
                        className={({ isActive }) =>
                            `sidebar-nav-link ${isActive ? 'active' : ''}`
                        }
                    >
                        <Icon size={16} className="sidebar-nav-icon" strokeWidth={2} />
                        <span style={{ flex: 1, fontSize: '13.5px' }}>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Footer */}
            <div style={{ padding: '12px 8px 16px', borderTop: '1px solid var(--border-light)' }}>
                <button
                    onClick={handleLogout}
                    className="sidebar-nav-link"
                    style={{ width: '100%', background: 'none', border: '1.5px solid transparent', cursor: 'pointer', color: 'var(--color-danger)' }}
                >
                    <LogOut size={16} strokeWidth={2} />
                    <span style={{ fontSize: '13.5px' }}>Sign Out</span>
                </button>
            </div>
        </aside>
    )
}

export default Sidebar
