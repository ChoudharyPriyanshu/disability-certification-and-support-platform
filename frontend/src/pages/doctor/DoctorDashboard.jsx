import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { doctorService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Stethoscope, ChevronRight, Clock, XCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const BADGE_MAP = {
    DOCTOR_ASSIGNED: 'badge-assigned', ASSESSMENT_SCHEDULED: 'badge-scheduled',
    ASSESSMENT_COMPLETED: 'badge-completed', REJECTED: 'badge-rejected',
}

const DoctorDashboard = () => {
    const [cases, setCases] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        doctorService.getCases()
            .then((res) => setCases(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    const pending = cases.filter((c) => !['ASSESSMENT_COMPLETED', 'REJECTED'].includes(c.status))
    const completed = cases.filter((c) => c.status === 'ASSESSMENT_COMPLETED')
    const rejected = cases.filter((c) => c.status === 'REJECTED')

    return (
        <DashboardLayout pageTitle="Doctor Dashboard" pageSubtitle="Your assigned assessment cases">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                        { value: cases.length, label: 'Total Cases', color: 'var(--color-green-600)' },
                        { value: pending.length, label: 'Pending', color: 'var(--color-warning)' },
                        { value: completed.length, label: 'Completed', color: 'var(--color-success)' },
                        { value: rejected.length, label: 'Rejected', color: 'var(--color-danger)' },
                    ].map(({ value, label, color }, i) => (
                        <motion.div key={label} className="stat-card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                            <div className="stat-icon" style={{ background: `color-mix(in srgb, ${color} 12%, white)` }}>
                                <Stethoscope size={20} color={color} />
                            </div>
                            <div>
                                <div className="stat-value">{loading ? '—' : value}</div>
                                <div className="stat-label">{label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Cases list */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '1rem' }}>Assigned Cases</h3>
                        <Link to="/doctor/cases" className="btn btn-ghost btn-sm">View all</Link>
                    </div>
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><div className="spinner" /></div>
                    ) : cases.length === 0 ? (
                        <div className="empty-state" style={{ padding: '40px' }}>
                            <Stethoscope size={40} className="empty-state-icon" />
                            <h3>No cases assigned yet</h3>
                            <p style={{ fontSize: '14px' }}>Cases will appear here when assigned by the medical authority.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {cases.slice(0, 5).map((c) => (
                                <Link key={c._id} to={`/doctor/cases/${c._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card-inset" style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                                        onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                                        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 600, fontSize: '13.5px', color: 'var(--color-slate-800)', marginBottom: '2px' }}>
                                                {c.applicantName}
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>
                                                {c.disabilityType}
                                                {c.assessmentDate && ` · Assessment: ${new Date(c.assessmentDate).toLocaleDateString('en-IN')}`}
                                            </div>
                                        </div>
                                        <span className={`badge ${BADGE_MAP[c.status] || 'badge-assigned'}`}>
                                            {c.status?.replace(/_/g, ' ')}
                                        </span>
                                        <ChevronRight size={15} color="var(--color-slate-400)" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default DoctorDashboard
