import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { applicationService, certificateService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { FileText, Award, Clock, CheckCircle, ChevronRight, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const statusLabel = {
    SUBMITTED: { text: 'Submitted', cls: 'badge-submitted' },
    UNDER_REVIEW: { text: 'Under Review', cls: 'badge-review' },
    DOCTOR_ASSIGNED: { text: 'Doctor Assigned', cls: 'badge-assigned' },
    ASSESSMENT_SCHEDULED: { text: 'Assessment Scheduled', cls: 'badge-scheduled' },
    ASSESSMENT_COMPLETED: { text: 'Evaluation Done', cls: 'badge-completed' },
    APPROVED: { text: 'Approved', cls: 'badge-approved' },
    REJECTED: { text: 'Rejected', cls: 'badge-rejected' },
}

const UserDashboard = () => {
    const { user } = useAuth()
    const [applications, setApplications] = useState([])
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            try {
                const [appRes, certRes] = await Promise.all([
                    applicationService.getMyApplications(),
                    certificateService.getMyCertificates(),
                ])
                setApplications(appRes.data.data || [])
                setCertificates(certRes.data.data || [])
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const latest = applications[0]

    const stats = [
        { icon: FileText, value: applications.length, label: 'Applications', color: 'var(--color-green-600)' },
        { icon: Award, value: certificates.length, label: 'Certificates', color: '#1e4a6e' },
        { icon: CheckCircle, value: applications.filter(a => a.status === 'APPROVED').length, label: 'Approved', color: 'var(--color-success)' },
        { icon: Clock, value: applications.filter(a => !['APPROVED', 'REJECTED'].includes(a.status)).length, label: 'In Progress', color: 'var(--color-warning)' },
    ]

    return (
        <DashboardLayout pageTitle="Dashboard" pageSubtitle={`Welcome back, ${user?.name}`}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                    <div className="spinner" />
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                    {/* Welcome card */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        style={{
                            background: 'var(--color-green-800)',
                            borderRadius: 'var(--radius-lg)',
                            padding: '32px',
                            color: 'white',
                        }}
                    >
                        <h2 style={{ color: 'white', fontFamily: 'var(--font-serif)', fontSize: '1.375rem', marginBottom: '8px' }}>
                            Good day, {user?.name?.split(' ')[0]}.
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '14px', lineHeight: 1.6, marginBottom: '20px' }}>
                            Manage your disability certificate application and access government support schemes from your dashboard.
                        </p>
                        {!applications.length && (
                            <Link to="/apply" className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.25)', fontSize: '14px' }}>
                                Start your application <ChevronRight size={16} />
                            </Link>
                        )}
                    </motion.div>

                    {/* Stats row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                        {stats.map(({ icon: Icon, value, label, color }, i) => (
                            <motion.div
                                key={label}
                                className="stat-card"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.07 }}
                            >
                                <div className="stat-icon" style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}>
                                    <Icon size={20} color={color} />
                                </div>
                                <div>
                                    <div className="stat-value">{value}</div>
                                    <div className="stat-label">{label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Latest application */}
                    {latest && (
                        <div className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ fontSize: '1rem' }}>Latest Application</h3>
                                <Link to="/my-applications" className="btn btn-ghost btn-sm">View all</Link>
                            </div>
                            <div className="card-inset" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                                <div>
                                    <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', marginBottom: '4px' }}>
                                        {latest.disabilityType} Disability
                                    </div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-slate-400)' }}>
                                        Submitted {new Date(latest.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className={`badge ${statusLabel[latest.status]?.cls}`}>
                                        {statusLabel[latest.status]?.text}
                                    </span>
                                    <Link to={`/my-applications/${latest._id}`} className="btn btn-secondary btn-sm">
                                        Details <ChevronRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick actions */}
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Quick Actions</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                            {[
                                { to: '/apply', label: 'New Application', sub: 'Apply for disability certificate', icon: FileText },
                                { to: '/schemes', label: 'Government Schemes', sub: 'Browse eligible schemes', icon: Award },
                                { to: '/equipment', label: 'Assistive Equipment', sub: 'Shop adaptive devices', icon: Award },
                                { to: '/verify', label: 'Verify Certificate', sub: 'Check certificate authenticity', icon: CheckCircle },
                            ].map(({ to, label, sub, icon: Icon }) => (
                                <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                                    <div className="card-inset" style={{ cursor: 'pointer', transition: 'box-shadow 0.2s', height: '100%' }}
                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                            <Icon size={16} color="var(--color-green-600)" />
                                            <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--color-slate-800)' }}>{label}</span>
                                        </div>
                                        <p style={{ fontSize: '12px', color: 'var(--color-slate-400)', margin: 0 }}>{sub}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

export default UserDashboard
