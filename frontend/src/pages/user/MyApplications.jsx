import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ChevronRight, Clock, CheckCircle, XCircle, Search } from 'lucide-react'

const STATUS_CONFIG = {
    SUBMITTED: { text: 'Submitted', cls: 'badge-submitted', icon: '○' },
    UNDER_REVIEW: { text: 'Under Review', cls: 'badge-review', icon: '◐' },
    DOCTOR_ASSIGNED: { text: 'Doctor Assigned', cls: 'badge-assigned', icon: '◑' },
    ASSESSMENT_SCHEDULED: { text: 'Assessment Scheduled', cls: 'badge-scheduled', icon: '◑' },
    ASSESSMENT_COMPLETED: { text: 'Evaluation Submitted', cls: 'badge-completed', icon: '◕' },
    APPROVED: { text: 'Approved', cls: 'badge-approved', icon: '●' },
    REJECTED: { text: 'Rejected', cls: 'badge-rejected', icon: '✕' },
}

const MyApplications = () => {
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('ALL')

    useEffect(() => {
        applicationService.getMyApplications()
            .then((res) => setApplications(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const filtered = filter === 'ALL'
        ? applications
        : applications.filter((a) => a.status === filter)

    return (
        <DashboardLayout pageTitle="My Applications" pageSubtitle="Track your disability certificate applications">
            <div style={{ maxWidth: '760px' }}>
                {/* Header + New Application */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {['ALL', 'SUBMITTED', 'APPROVED', 'REJECTED'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                style={{
                                    padding: '6px 14px',
                                    borderRadius: '100px',
                                    border: `1.5px solid ${filter === f ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                    background: filter === f ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                                    color: filter === f ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                                    fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                    fontFamily: 'var(--font-sans)',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {f === 'ALL' ? 'All' : STATUS_CONFIG[f]?.text}
                            </button>
                        ))}
                    </div>
                    <Link to="/apply" className="btn btn-primary btn-sm">New Application</Link>
                </div>

                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div className="spinner" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <Search size={48} className="empty-state-icon" />
                        <h3 style={{ marginBottom: '8px' }}>No applications found</h3>
                        <p style={{ fontSize: '14px', marginBottom: '20px' }}>
                            {filter === 'ALL' ? "You haven't submitted any applications yet." : `No ${STATUS_CONFIG[filter]?.text?.toLowerCase()} applications.`}
                        </p>
                        {filter !== 'ALL' ? (
                            <button onClick={() => setFilter('ALL')} className="btn btn-secondary btn-sm">Show all</button>
                        ) : (
                            <Link to="/apply" className="btn btn-primary btn-sm">Start your application</Link>
                        )}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {filtered.map((app) => {
                            const s = STATUS_CONFIG[app.status]
                            return (
                                <Link key={app._id} to={`/my-applications/${app._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card" style={{ padding: '20px 24px', cursor: 'pointer', transition: 'box-shadow 0.18s ease' }}
                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', flexWrap: 'wrap' }}>
                                            <div>
                                                <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.0625rem', color: 'var(--color-slate-900)', marginBottom: '4px' }}>
                                                    {app.disabilityType} Disability
                                                </div>
                                                <div style={{ fontSize: '13px', color: 'var(--color-slate-400)' }}>
                                                    Applied {new Date(app.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <span className={`badge ${s?.cls}`}>{s?.text}</span>
                                                <ChevronRight size={16} color="var(--color-slate-400)" />
                                            </div>
                                        </div>

                                        {/* Mini timeline */}
                                        <div style={{ marginTop: '14px', display: 'flex', alignItems: 'center', gap: '4px', overflow: 'hidden' }}>
                                            {['SUBMITTED', 'UNDER_REVIEW', 'DOCTOR_ASSIGNED', 'ASSESSMENT_COMPLETED', 'APPROVED'].map((s, i, arr) => {
                                                const statuses = Object.keys(STATUS_CONFIG)
                                                const currentIdx = statuses.indexOf(app.status)
                                                const thisIdx = statuses.indexOf(s)
                                                const done = thisIdx < currentIdx || app.status === s
                                                return (
                                                    <div key={s} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                                                        <div style={{
                                                            width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0,
                                                            background: done ? 'var(--color-green-600)' : 'var(--border-color)',
                                                        }} />
                                                        {i < arr.length - 1 && (
                                                            <div style={{ flex: 1, height: '2px', background: done ? 'var(--color-green-400)' : 'var(--border-color)', transition: 'background 0.3s' }} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default MyApplications
