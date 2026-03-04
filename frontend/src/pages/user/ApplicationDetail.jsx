import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { applicationService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Clock, User, Stethoscope, CheckCircle, XCircle, AlertCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const STATUS_META = {
    SUBMITTED: { label: 'Application Submitted', icon: '○', done: true },
    UNDER_REVIEW: { label: 'Under Medical Review', icon: '◐', done: true },
    DOCTOR_ASSIGNED: { label: 'Doctor Assigned', icon: '◑', done: true },
    ASSESSMENT_SCHEDULED: { label: 'Assessment Scheduled', icon: '◑', done: true },
    ASSESSMENT_COMPLETED: { label: 'Evaluation Submitted', icon: '◕', done: true },
    APPROVED: { label: 'Application Approved', icon: '●', done: true },
    REJECTED: { label: 'Application Rejected', icon: '✕', done: true },
}

const ALL_STEPS = [
    'SUBMITTED', 'UNDER_REVIEW', 'DOCTOR_ASSIGNED',
    'ASSESSMENT_SCHEDULED', 'ASSESSMENT_COMPLETED', 'APPROVED',
]

const ApplicationDetail = () => {
    const { id } = useParams()
    const [app, setApp] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        applicationService.getById(id)
            .then((res) => setApp(res.data.data))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <DashboardLayout pageTitle="Application Detail">
            <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                <div className="spinner" />
            </div>
        </DashboardLayout>
    )

    if (!app) return (
        <DashboardLayout pageTitle="Application Detail">
            <div className="alert alert-danger">Application not found</div>
        </DashboardLayout>
    )

    const currentIdx = ALL_STEPS.indexOf(app.status)
    const isRejected = app.status === 'REJECTED'

    return (
        <DashboardLayout
            pageTitle="Application Detail"
            pageSubtitle={`Ref: ${app._id?.slice(-8).toUpperCase()}`}
        >
            <div style={{ maxWidth: '680px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Status banner */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card"
                    style={{
                        background: isRejected ? '#fef2f2' : app.status === 'APPROVED' ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                        borderColor: isRejected ? '#fecaca' : app.status === 'APPROVED' ? 'var(--color-green-200)' : 'var(--border-color)',
                        display: 'flex', alignItems: 'center', gap: '16px',
                    }}
                >
                    <div style={{
                        width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                        background: isRejected ? '#fee2e2' : app.status === 'APPROVED' ? 'var(--color-green-100)' : 'var(--color-ivory-dark)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {app.status === 'APPROVED' ? <CheckCircle size={24} color="var(--color-green-700)" /> :
                            isRejected ? <XCircle size={24} color="var(--color-danger)" /> :
                                <Clock size={24} color="var(--color-slate-400)" />}
                    </div>
                    <div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, fontSize: '1.0625rem', marginBottom: '4px' }}>
                            {STATUS_META[app.status]?.label}
                        </div>
                        {app.adminRemarks && (
                            <div style={{ fontSize: '13px', color: 'var(--color-slate-500)' }}>{app.adminRemarks}</div>
                        )}
                    </div>
                </motion.div>

                {/* Timeline */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>Application Timeline</h3>
                    <div className="timeline">
                        {ALL_STEPS.map((s, i) => {
                            const isPast = i < currentIdx || (s === app.status && !isRejected)
                            const isCurrent = s === app.status
                            const histEntry = app.statusHistory?.find((h) => h.status === s)
                            return (
                                <div key={s} className="timeline-item">
                                    <div className={`timeline-dot ${isPast ? 'active' : ''}`} />
                                    <div>
                                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: isPast ? 'var(--color-slate-800)' : 'var(--color-slate-300)' }}>
                                            {STATUS_META[s]?.label}
                                        </div>
                                        {histEntry && (
                                            <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', marginTop: '2px' }}>
                                                {new Date(histEntry.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                {histEntry.remarks && ` — ${histEntry.remarks}`}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                        {isRejected && (
                            <div className="timeline-item">
                                <div className="timeline-dot" style={{ background: 'var(--color-danger)', borderColor: 'var(--color-danger)' }} />
                                <div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-danger)' }}>Application Rejected</div>
                                    {app.adminRemarks && <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', marginTop: '2px' }}>{app.adminRemarks}</div>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Application Details</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {[
                                { label: 'Disability Type', value: app.disabilityType },
                                { label: 'Nature', value: app.congenitalOrAcquired },
                                { label: 'Description', value: app.disabilityDescription },
                                { label: 'Assigned Doctor', value: app.assignedDoctor ? `Dr. ${app.assignedDoctor.name} — ${app.assignedDoctor.specialization}` : 'Pending' },
                                { label: 'Assessment Date', value: app.assessmentDate ? new Date(app.assessmentDate).toLocaleDateString('en-IN') : 'Not scheduled' },
                                { label: 'Documents', value: `${app.documents?.length || 0} file(s)` },
                            ].map(({ label, value }) => (
                                <tr key={label}>
                                    <td style={{ padding: '10px 0', borderBottom: '1px solid var(--border-light)', width: '140px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', verticalAlign: 'top', paddingTop: '12px' }}>
                                        {label}
                                    </td>
                                    <td style={{ padding: '10px 0 10px 12px', borderBottom: '1px solid var(--border-light)', fontSize: '14px', color: 'var(--color-slate-700)' }}>
                                        {value || '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Doctor evaluation result */}
                {app.doctorEvaluation?.disabilityPercentage && (
                    <div className="card" style={{ background: 'var(--color-green-50)', borderColor: 'var(--color-green-200)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <Stethoscope size={18} color="var(--color-green-700)" />
                            <h3 style={{ fontSize: '1rem', color: 'var(--color-green-800)' }}>Doctor Evaluation</h3>
                        </div>
                        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-green-600)', marginBottom: '4px' }}>Disability Type</div>
                                <div style={{ fontWeight: 600 }}>{app.doctorEvaluation.disabilityType}</div>
                            </div>
                            <div>
                                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-green-600)', marginBottom: '4px' }}>Disability Percentage</div>
                                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-green-800)' }}>
                                    {app.doctorEvaluation.disabilityPercentage}%
                                </div>
                            </div>
                        </div>
                        {app.doctorEvaluation.notes && (
                            <p style={{ marginTop: '12px', fontSize: '13px', color: 'var(--color-green-700)', fontStyle: 'italic' }}>
                                "{app.doctorEvaluation.notes}"
                            </p>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default ApplicationDetail
