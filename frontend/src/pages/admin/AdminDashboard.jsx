import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService, certificateService, doctorService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FileText, Award, Stethoscope, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminDashboard = () => {
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, certs: 0 })
    const [recent, setRecent] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            applicationService.getAll({ limit: 5 }),
            certificateService.getAll(),
        ]).then(([appRes, certRes]) => {
            const apps = appRes.data.data || []
            const allApps = appRes.data
            setRecent(apps)
            setStats({
                total: allApps.total || 0,
                pending: apps.filter(a => !['APPROVED', 'REJECTED'].includes(a.status)).length,
                approved: apps.filter(a => a.status === 'APPROVED').length,
                rejected: apps.filter(a => a.status === 'REJECTED').length,
                certs: certRes.data.count || 0,
            })
        }).catch(console.error).finally(() => setLoading(false))
    }, [])

    const STATUS_BADGE = {
        SUBMITTED: 'badge-submitted', UNDER_REVIEW: 'badge-review',
        DOCTOR_ASSIGNED: 'badge-assigned', ASSESSMENT_SCHEDULED: 'badge-scheduled',
        ASSESSMENT_COMPLETED: 'badge-completed', APPROVED: 'badge-approved', REJECTED: 'badge-rejected',
    }

    const cards = [
        { icon: FileText, value: stats.total, label: 'Total Applications', color: 'var(--color-green-600)', to: '/admin/applications' },
        { icon: Clock, value: stats.pending, label: 'Pending Review', color: 'var(--color-warning)', to: '/admin/applications?status=SUBMITTED' },
        { icon: CheckCircle, value: stats.approved, label: 'Approved', color: 'var(--color-success)', to: '/admin/applications?status=APPROVED' },
        { icon: Award, value: stats.certs, label: 'Certificates Issued', color: '#1e4a6e', to: '/admin/certificates' },
    ]

    return (
        <DashboardLayout pageTitle="Admin Dashboard" pageSubtitle="Medical Authority Control Panel">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                {/* Stat cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                    {cards.map(({ icon: Icon, value, label, color, to }, i) => (
                        <motion.div
                            key={label}
                            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.07 }}
                        >
                            <Link to={to} style={{ textDecoration: 'none' }}>
                                <div className="stat-card" style={{ cursor: 'pointer' }}
                                    onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                    onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}>
                                    <div className="stat-icon" style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}>
                                        <Icon size={20} color={color} />
                                    </div>
                                    <div>
                                        <div className="stat-value">{loading ? '—' : value}</div>
                                        <div className="stat-label">{label}</div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>

                {/* Recent applications */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem' }}>Recent Applications</h3>
                        <Link to="/admin/applications" className="btn btn-ghost btn-sm">View all</Link>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                            <div className="spinner" />
                        </div>
                    ) : recent.length === 0 ? (
                        <div className="empty-state" style={{ padding: '32px' }}>
                            <p>No applications yet</p>
                        </div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Disability Type</th>
                                    <th>Status</th>
                                    <th>Date</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {recent.map((app) => (
                                    <tr key={app._id}>
                                        <td style={{ fontWeight: 600, color: 'var(--color-slate-800)' }}>
                                            {app.applicant?.name || app.applicantName}
                                        </td>
                                        <td>{app.disabilityType}</td>
                                        <td>
                                            <span className={`badge ${STATUS_BADGE[app.status] || 'badge-submitted'}`}>
                                                {app.status?.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>
                                            {new Date(app.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td>
                                            <Link to={`/admin/applications/${app._id}`} className="btn btn-ghost btn-sm">
                                                Review
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AdminDashboard
