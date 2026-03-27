import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { applicationService, certificateService } from '../../services/apiServices'
import api from '../../utils/api'
import DashboardLayout from '../../layouts/DashboardLayout'
import { CheckCircle, XCircle, Stethoscope, Calendar, User, AlertCircle, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const BADGE_MAP = {
    SUBMITTED: 'badge-submitted', UNDER_REVIEW: 'badge-review',
    DOCTOR_ASSIGNED: 'badge-assigned', ASSESSMENT_SCHEDULED: 'badge-scheduled',
    ASSESSMENT_COMPLETED: 'badge-completed', APPROVED: 'badge-approved', REJECTED: 'badge-rejected',
}

const AdminApplicationDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [app, setApp] = useState(null)
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState('')
    const [selectedDoctor, setSelectedDoctor] = useState('')
    const [assessmentDate, setAssessmentDate] = useState('')
    const [remarks, setRemarks] = useState('')
    const [certLoading, setCertLoading] = useState(false)

    useEffect(() => {
        // Fetch application + doctors in parallel
        Promise.all([
            applicationService.getById(id),
            api.get('/auth/doctors'),
        ]).then(([appRes, doctorRes]) => {
            setApp(appRes.data.data)
            setDoctors(doctorRes.data.data || [])
        }).catch(console.error).finally(() => setLoading(false))
    }, [id])

    const refresh = async () => {
        const res = await applicationService.getById(id)
        setApp(res.data.data)
    }

    const action = async (fn, label) => {
        setActionLoading(label)
        try {
            await fn()
            await refresh()
            toast.success(`${label} successful`)
        } catch (err) {
            toast.error(err.response?.data?.message || `${label} failed`)
        } finally {
            setActionLoading('')
        }
    }

    const handleReview = () => action(() => applicationService.review(id, { remarks }), 'Review started')
    const handleAssignDoctor = () => {
        if (!selectedDoctor) { toast.error('Select a doctor'); return }
        action(() => applicationService.assignDoctor(id, { doctorId: selectedDoctor }), 'Doctor assigned')
    }
    const handleSchedule = () => {
        if (!assessmentDate) { toast.error('Select assessment date'); return }
        action(() => applicationService.schedule(id, { assessmentDate }), 'Assessment scheduled')
    }
    const handleApprove = () => action(() => applicationService.approve(id, { remarks }), 'Application approved')
    const handleReject = () => {
        if (!remarks) { toast.error('Please provide rejection remarks'); return }
        action(() => applicationService.reject(id, { remarks }), 'Application rejected')
    }
    const handleGenerateCert = async () => {
        setCertLoading(true)
        try {
            await certificateService.generate(id)
            toast.success('Certificate generated successfully')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Certificate generation failed')
        } finally {
            setCertLoading(false)
        }
    }

    if (loading) return <DashboardLayout pageTitle="Application Review"><div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div></DashboardLayout>
    if (!app) return <DashboardLayout pageTitle="Application Review"><div className="alert alert-danger">Application not found</div></DashboardLayout>

    const isRejected = app.status === 'REJECTED'
    const isApproved = app.status === 'APPROVED'
    const canReview = app.status === 'SUBMITTED'
    const canAssign = ['SUBMITTED', 'UNDER_REVIEW'].includes(app.status)
    const canSchedule = app.status === 'DOCTOR_ASSIGNED'
    const canApprove = app.status === 'ASSESSMENT_COMPLETED'
    const canGenCert = isApproved

    return (
        <DashboardLayout pageTitle="Application Review" pageSubtitle={`Ref: ${app._id?.slice(-8).toUpperCase()}`}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'flex-start' }}>
                {/* Left — application info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Header */}
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
                            <div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', marginBottom: '4px' }}>
                                    {app.applicantName}
                                </h2>
                                <p style={{ fontSize: '13px', color: 'var(--color-slate-400)' }}>
                                    {app.applicant?.email} · {app.applicant?.phone}
                                </p>
                            </div>
                            <span className={`badge ${BADGE_MAP[app.status]}`}>{app.status?.replace(/_/g, ' ')}</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                { label: 'Disability Type', value: app.disabilityType },
                                { label: 'Nature', value: app.congenitalOrAcquired || '—' },
                                { label: 'Date of Birth', value: app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString('en-IN') : '—' },
                                { label: 'Gender', value: app.gender || '—' },
                                { label: 'Documents', value: `${app.documents?.length || 0} uploaded` },
                                { label: 'Submitted', value: new Date(app.createdAt).toLocaleDateString('en-IN') },
                            ].map(({ label, value }) => (
                                <div key={label} className="card-inset" style={{ padding: '10px 14px' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', marginBottom: '2px' }}>{label}</div>
                                    <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)' }}>{value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="card">
                        <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Disability Description</h3>
                        <p style={{ fontSize: '14px', color: 'var(--color-slate-600)', lineHeight: 1.7 }}>{app.disabilityDescription}</p>
                    </div>

                    {/* Documents */}
                    {app.documents?.length > 0 && (
                        <div className="card">
                            <h3 style={{ fontSize: '14px', marginBottom: '12px' }}>Applicant Documents ({app.documents.length})</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {app.documents.map((doc, i) => (
                                    <div key={i} className="card-inset" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px 14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ flex: 1, fontSize: '13px', fontWeight: 600, color: 'var(--color-slate-700)' }}>{doc.name}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span className={`badge ${doc.status === 'APPROVED' ? 'badge-approved' : doc.status === 'REJECTED' ? 'badge-rejected' : 'badge-submitted'}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                                                    {doc.status || 'PENDING'}
                                                </span>
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '12px', padding: '4px 8px' }}>View</a>
                                            </div>
                                        </div>
                                        {doc.doctorRemarks && (
                                            <div style={{ fontSize: '12px', padding: '8px 10px', background: 'var(--color-rose-50)', borderRadius: '4px', color: 'var(--color-rose-700)', borderLeft: '2px solid var(--color-rose-300)' }}>
                                                <strong>Doctor's Remark:</strong> {doc.doctorRemarks}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Doctor Evaluation */}
                    {app.doctorEvaluation?.disabilityPercentage && (
                        <div className="card" style={{ background: 'var(--color-green-50)', borderColor: 'var(--color-green-200)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <Stethoscope size={16} color="var(--color-green-700)" />
                                <h3 style={{ fontSize: '14px', color: 'var(--color-green-800)' }}>Doctor Evaluation</h3>
                            </div>
                            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-green-600)', marginBottom: '4px' }}>Type</div>
                                    <div style={{ fontWeight: 600 }}>{app.doctorEvaluation.disabilityType}</div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-green-600)', marginBottom: '4px' }}>Percentage</div>
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-green-800)' }}>
                                        {app.doctorEvaluation.disabilityPercentage}%
                                    </div>
                                </div>
                            </div>
                            {app.doctorEvaluation.notes && (
                                <p style={{ marginTop: '10px', fontSize: '13px', color: 'var(--color-green-700)', fontStyle: 'italic' }}>"{app.doctorEvaluation.notes}"</p>
                            )}

                            {/* Supporting Evidence from Doctor */}
                            {app.doctorEvaluation.supportingDocuments?.length > 0 && (
                                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px dashed var(--color-green-200)' }}>
                                    <h4 style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-green-600)', marginBottom: '10px' }}>Supporting Evidence</h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        {app.doctorEvaluation.supportingDocuments.map((doc, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 10px', background: 'var(--color-white)', borderRadius: '4px', border: '1px solid var(--color-green-100)' }}>
                                                <div style={{ flex: 1, fontSize: '12px', fontWeight: 500, color: 'var(--color-slate-600)' }}>{doc.name}</div>
                                                <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ fontSize: '11px', padding: '2px 6px' }}>View</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right — actions panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* Rejection banner */}
                    {isRejected && (
                        <div className="card" style={{ background: '#fef2f2', borderColor: '#fecaca' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                <XCircle size={20} color="var(--color-danger)" />
                                <h3 style={{ fontSize: '15px', color: 'var(--color-danger)' }}>Application Rejected</h3>
                            </div>
                            <p style={{ fontSize: '13px', color: 'var(--color-slate-600)', lineHeight: 1.6, margin: 0 }}>
                                This application has been rejected. No further actions can be taken.
                            </p>
                            {app.adminRemarks && (
                                <div style={{ marginTop: '12px', padding: '10px 12px', background: 'var(--color-white)', borderRadius: '6px', border: '1px solid #fecaca' }}>
                                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '4px' }}>Admin Remarks</div>
                                    <div style={{ fontSize: '13px', color: 'var(--color-slate-700)' }}>{app.adminRemarks}</div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Remarks input — only for non-terminal states */}
                    {!isRejected && !isApproved && (
                        <div className="card">
                            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Remarks / Notes</h3>
                            <textarea
                                className="form-input form-textarea"
                                rows={3}
                                placeholder="Add remarks for this action..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Doctor assignment */}
                    {canAssign && (
                        <div className="card">
                            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Assign Doctor</h3>
                            <select className="form-input form-select" style={{ marginBottom: '10px' }}
                                value={selectedDoctor} onChange={(e) => setSelectedDoctor(e.target.value)}>
                                <option value="">Select doctor...</option>
                                {doctors.map((d) => (
                                    <option key={d._id} value={d._id}>Dr. {d.name} — {d.specialization}</option>
                                ))}
                            </select>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleAssignDoctor} disabled={actionLoading === 'Doctor assigned'}>
                                {actionLoading === 'Doctor assigned' ? <span className="spinner spinner-sm" /> : <><Stethoscope size={14} /> Assign Doctor</>}
                            </button>
                        </div>
                    )}

                    {/* Schedule assessment */}
                    {canSchedule && (
                        <div className="card">
                            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Schedule Assessment</h3>
                            <input type="datetime-local" className="form-input" style={{ marginBottom: '10px' }}
                                value={assessmentDate} onChange={(e) => setAssessmentDate(e.target.value)} />
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleSchedule} disabled={actionLoading === 'Assessment scheduled'}>
                                {actionLoading === 'Assessment scheduled' ? <span className="spinner spinner-sm" /> : <><Calendar size={14} /> Schedule</>}
                            </button>
                        </div>
                    )}

                    {/* Approve/Reject — only for non-terminal states */}
                    {(canReview || canApprove) && (
                        <div className="card">
                            <h3 style={{ fontSize: '14px', marginBottom: '10px' }}>Final Decision</h3>
                            {canReview && (
                                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px' }}
                                    onClick={handleReview} disabled={!!actionLoading}>
                                    Start Review
                                </button>
                            )}
                            {canApprove && (
                                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: '8px', background: 'var(--color-green-700)' }}
                                    onClick={handleApprove} disabled={!!actionLoading}>
                                    {actionLoading === 'Application approved' ? <span className="spinner spinner-sm" /> : <><CheckCircle size={14} /> Approve</>}
                                </button>
                            )}
                            {!['APPROVED', 'REJECTED'].includes(app.status) && (
                                <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center' }}
                                    onClick={handleReject} disabled={!!actionLoading}>
                                    {actionLoading === 'Application rejected' ? <span className="spinner spinner-sm" /> : <><XCircle size={14} /> Reject</>}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Generate certificate — only for approved */}
                    {canGenCert && (
                        <div className="card" style={{ background: 'var(--color-green-50)', borderColor: 'var(--color-green-200)' }}>
                            <h3 style={{ fontSize: '14px', color: 'var(--color-green-800)', marginBottom: '8px' }}>
                                <Award size={14} style={{ display: 'inline', marginRight: '6px' }} />
                                Generate Certificate
                            </h3>
                            <p style={{ fontSize: '12px', color: 'var(--color-green-700)', marginBottom: '12px' }}>
                                Application approved. Generate and issue the disability certificate.
                            </p>
                            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                                onClick={handleGenerateCert} disabled={certLoading}>
                                {certLoading ? <span className="spinner spinner-sm" /> : 'Generate Certificate'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AdminApplicationDetail
