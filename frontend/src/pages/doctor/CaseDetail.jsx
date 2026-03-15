import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { doctorService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AlertCircle, CheckCircle, FileText, Download, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const DISABILITY_TYPES = [
    'Locomotor', 'Visual', 'Hearing', 'Speech & Language',
    'Intellectual', 'Mental Illness', 'Multiple Disabilities', 'Other',
]

const CaseDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [caseData, setCaseData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ disabilityType: '', disabilityPercentage: '', notes: '' })

    useEffect(() => {
        doctorService.getCaseDetail(id)
            .then((res) => {
                const data = res.data.data
                setCaseData(data)
                if (data.doctorEvaluation?.disabilityType) {
                    setForm({
                        disabilityType: data.doctorEvaluation.disabilityType,
                        disabilityPercentage: data.doctorEvaluation.disabilityPercentage,
                        notes: data.doctorEvaluation.notes || '',
                    })
                }
                if (data.status === 'ASSESSMENT_COMPLETED') setSubmitted(true)
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.disabilityType || !form.disabilityPercentage) {
            toast.error('Please fill in all required fields')
            return
        }
        setSubmitting(true)
        try {
            await doctorService.evaluate(id, {
                ...form,
                disabilityPercentage: parseFloat(form.disabilityPercentage),
            })
            setSubmitted(true)
            toast.success('Evaluation submitted successfully')
            navigate('/doctor/cases')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Submission failed')
        } finally {
            setSubmitting(false)
        }
    }

    if (loading) return <DashboardLayout pageTitle="Case Assessment"><div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}><div className="spinner" /></div></DashboardLayout>
    if (!caseData) return <DashboardLayout pageTitle="Case Assessment"><div className="alert alert-danger">Case not found</div></DashboardLayout>

    const patient = caseData.applicant

    return (
        <DashboardLayout pageTitle="Case Assessment" pageSubtitle={`Patient: ${caseData.applicantName}`}>
            <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Patient details */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '14px' }}>Patient Information</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                            { label: 'Full Name', value: caseData.applicantName },
                            { label: 'DOB', value: caseData.dateOfBirth ? new Date(caseData.dateOfBirth).toLocaleDateString('en-IN') : '—' },
                            { label: 'Gender', value: caseData.gender || '—' },
                            { label: 'Phone', value: patient?.phone || '—' },
                            { label: 'Disability Type (Claimed)', value: caseData.disabilityType },
                            { label: 'Nature', value: caseData.congenitalOrAcquired || '—' },
                        ].map(({ label, value }) => (
                            <div key={label} className="card-inset" style={{ padding: '10px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', marginBottom: '2px' }}>{label}</div>
                                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)' }}>{value}</div>
                            </div>
                        ))}
                    </div>
                    {caseData.disabilityDescription && (
                        <div style={{ marginTop: '14px', padding: '12px 16px', background: 'var(--color-ivory)', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--color-green-400)' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '4px' }}>Patient's Description</div>
                            <p style={{ fontSize: '13.5px', color: 'var(--color-slate-700)', lineHeight: 1.6, margin: 0 }}>{caseData.disabilityDescription}</p>
                        </div>
                    )}
                    {caseData.assessmentDate && (
                        <div className="alert alert-info" style={{ marginTop: '12px' }}>
                            <AlertCircle size={15} style={{ flexShrink: 0 }} />
                            <span>Assessment scheduled for <strong>{new Date(caseData.assessmentDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></span>
                        </div>
                    )}
                </div>

                {/* Documents uploaded by patient */}
                <div className="card">
                    <h3 style={{ fontSize: '1rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="var(--color-slate-500)" />
                        Uploaded Documents
                        <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-slate-400)', marginLeft: '4px' }}>
                            ({caseData.documents?.length || 0})
                        </span>
                    </h3>
                    {!caseData.documents?.length ? (
                        <p style={{ fontSize: '13.5px', color: 'var(--color-slate-400)', fontStyle: 'italic' }}>
                            No documents uploaded by the patient.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {caseData.documents.map((doc, i) => (
                                <div key={i} className="card-inset" style={{
                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px',
                                }}>
                                    <FileText size={16} color="var(--color-green-600)" style={{ flexShrink: 0 }} />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {doc.name}
                                        </div>
                                        {doc.type && (
                                            <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '1px' }}>
                                                {doc.type.replace(/_/g, ' ')}
                                            </div>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                        <a href={doc.url} target="_blank" rel="noreferrer"
                                            className="btn btn-ghost btn-sm"
                                            style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Eye size={13} /> View
                                        </a>
                                        <a href={doc.url} download={doc.name}
                                            className="btn btn-ghost btn-sm"
                                            style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                            <Download size={13} />
                                        </a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Evaluation form */}
                {submitted ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card"
                        style={{ background: 'var(--color-green-50)', borderColor: 'var(--color-green-200)', textAlign: 'center', padding: '40px 32px' }}
                    >
                        <CheckCircle size={48} color="var(--color-green-700)" style={{ margin: '0 auto 16px' }} />
                        <h3 style={{ fontSize: '1.0625rem', color: 'var(--color-green-800)', marginBottom: '8px' }}>
                            Evaluation Submitted
                        </h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--color-green-700)' }}>
                            {form.disabilityType} — {form.disabilityPercentage}% disability<br />
                            Your evaluation has been sent to the medical authority.
                        </p>
                    </motion.div>
                ) : (
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>Medical Evaluation</h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--color-slate-400)', marginBottom: '20px' }}>
                            Complete this form after the physical assessment. This information will be used for the final certificate.
                        </p>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                            <div className="form-field">
                                <label className="form-label">Confirmed Disability Type</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                    {DISABILITY_TYPES.map((type) => (
                                        <button key={type} type="button"
                                            onClick={() => setForm((f) => ({ ...f, disabilityType: type }))}
                                            style={{
                                                padding: '8px 12px', borderRadius: 'var(--radius-md)',
                                                border: `1.5px solid ${form.disabilityType === type ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                                background: form.disabilityType === type ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                                                color: form.disabilityType === type ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                                                fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer', textAlign: 'left',
                                            }}>
                                            {type}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="pct">Disability Percentage</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <input id="pct" type="range" min={0} max={100} step={5}
                                        value={form.disabilityPercentage || 0}
                                        onChange={(e) => setForm((f) => ({ ...f, disabilityPercentage: e.target.value }))}
                                        style={{ flex: 1, accentColor: 'var(--color-green-600)' }} />
                                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-slate-900)', minWidth: '52px', textAlign: 'right' }}>
                                        {form.disabilityPercentage || 0}%
                                    </div>
                                </div>
                                <input type="number" className="form-input" min={0} max={100}
                                    value={form.disabilityPercentage}
                                    onChange={(e) => setForm((f) => ({ ...f, disabilityPercentage: e.target.value }))}
                                    placeholder="Or enter exact percentage"
                                    style={{ marginTop: '6px' }} />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="notes">Clinical Notes</label>
                                <textarea id="notes" className="form-input form-textarea" rows={4}
                                    placeholder="Describe your clinical findings, assessment observations, and any relevant notes..."
                                    value={form.notes}
                                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
                            </div>
                            <div className="alert alert-warning">
                                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                                <span>This evaluation is final and will directly determine the disability percentage on the official certificate.</span>
                            </div>
                            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ justifyContent: 'center' }}>
                                {submitting ? <span className="spinner spinner-sm" /> : 'Submit Evaluation'}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default CaseDetail
