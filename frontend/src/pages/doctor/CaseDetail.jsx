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
    const [files, setFiles] = useState([])

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

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles((prev) => [...prev, ...selectedFiles])
    }

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    const handleVerifyDoc = async (docId, status) => {
        let remarks = ''
        if (status === 'REJECTED') {
            remarks = window.prompt('Please enter reason for rejection:')
            if (remarks === null) return // Cancelled
        }

        setProcessingDoc(docId)
        try {
            const res = await doctorService.verifyDocument(id, docId, { status, remarks })
            setCaseData(res.data.data)
            toast.success(`Document ${status.toLowerCase()} successfully`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Verification failed')
        } finally {
            setProcessingDoc(null)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.disabilityType || !form.disabilityPercentage) {
            toast.error('Please fill in all required fields')
            return
        }
        setSubmitting(true)

        const formData = new FormData()
        formData.append('disabilityType', form.disabilityType)
        formData.append('disabilityPercentage', form.disabilityPercentage)
        formData.append('notes', form.notes)
        files.forEach((file) => {
            formData.append('evidence', file)
        })

        try {
            await doctorService.evaluate(id, formData)
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
                                        display: 'flex', flexDirection: 'column', gap: '10px', padding: '12px 14px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <FileText size={16} color="var(--color-green-600)" style={{ flexShrink: 0 }} />
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.name}
                                                </div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    {doc.type && (
                                                        <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                                            {doc.type.replace(/_/g, ' ')}
                                                        </div>
                                                    )}
                                                    <div style={{
                                                        fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '4px',
                                                        background: doc.status === 'APPROVED' ? 'var(--color-green-100)' : doc.status === 'REJECTED' ? 'var(--color-rose-100)' : 'var(--color-slate-100)',
                                                        color: doc.status === 'APPROVED' ? 'var(--color-green-700)' : doc.status === 'REJECTED' ? 'var(--color-rose-700)' : 'var(--color-slate-600)',
                                                    }}>
                                                        {doc.status || 'PENDING'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                                                <a href={doc.url} target="_blank" rel="noreferrer"
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Eye size={13} />
                                                </a>
                                                <a href={doc.url} download={doc.name}
                                                    className="btn btn-ghost btn-sm"
                                                    style={{ padding: '5px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                    <Download size={13} />
                                                </a>
                                            </div>
                                        </div>

                                        {doc.doctorRemarks && (
                                            <div style={{ fontSize: '12px', padding: '8px 12px', background: 'var(--surface-secondary)', borderRadius: '4px', color: 'var(--color-slate-600)', borderLeft: '2px solid var(--color-rose-400)' }}>
                                                <strong>Doctor's Remarks:</strong> {doc.doctorRemarks}
                                            </div>
                                        )}

                                        {!submitted && (
                                            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '2px' }}>
                                                <button type="button"
                                                    onClick={() => handleVerifyDoc(doc._id, 'APPROVED')}
                                                    disabled={processingDoc === doc._id || doc.status === 'APPROVED'}
                                                    className="btn btn-sm"
                                                    style={{ 
                                                        flex: 1, fontSize: '11px', padding: '6px', justifyContent: 'center',
                                                        background: doc.status === 'APPROVED' ? 'var(--color-green-50)' : 'var(--color-white)',
                                                        borderColor: doc.status === 'APPROVED' ? 'var(--color-green-200)' : 'var(--border-color)',
                                                        color: doc.status === 'APPROVED' ? 'var(--color-green-700)' : 'var(--color-slate-600)'
                                                    }}>
                                                    {processingDoc === doc._id ? <span className="spinner spinner-sm" /> : 'Approve'}
                                                </button>
                                                <button type="button"
                                                    onClick={() => handleVerifyDoc(doc._id, 'REJECTED')}
                                                    disabled={processingDoc === doc._id || doc.status === 'REJECTED'}
                                                    className="btn btn-sm"
                                                    style={{ 
                                                        flex: 1, fontSize: '11px', padding: '6px', justifyContent: 'center',
                                                        background: doc.status === 'REJECTED' ? 'var(--color-rose-50)' : 'var(--color-white)',
                                                        borderColor: doc.status === 'REJECTED' ? 'var(--color-rose-200)' : 'var(--border-color)',
                                                        color: doc.status === 'REJECTED' ? 'var(--color-rose-700)' : 'var(--color-slate-600)'
                                                    }}>
                                                    Reject
                                                </button>
                                            </div>
                                        )}
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
                        <p style={{ fontSize: '13.5px', color: 'var(--color-green-700)', marginBottom: '24px' }}>
                            {form.disabilityType} — {form.disabilityPercentage}% disability<br />
                            Your evaluation has been sent to the medical authority.
                        </p>
                        {caseData.doctorEvaluation?.supportingDocuments?.length > 0 && (
                            <div style={{ textAlign: 'left', background: 'var(--color-white)', borderRadius: 'var(--radius-md)', padding: '16px', border: '1px solid var(--color-green-200)' }}>
                                <h4 style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText size={14} /> Supporting Evidence
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {caseData.doctorEvaluation.supportingDocuments.map((doc, i) => (
                                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{ 
                                                width: '32px', height: '32px', borderRadius: '4px', 
                                                background: 'var(--color-slate-50)', display: 'flex', 
                                                alignItems: 'center', justifyContent: 'center', flexShrink: 0 
                                            }}>
                                                {doc.type === 'photograph' ? <Eye size={16} color="var(--color-green-600)" /> : <FileText size={16} color="var(--color-blue-600)" />}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-slate-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {doc.name}
                                                </div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', textTransform: 'uppercase' }}>{doc.type}</div>
                                            </div>
                                            <a href={doc.url} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                                View
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    <div className="card">
                        <h3 style={{ fontSize: '1rem', marginBottom: '6px' }}>Medical Evaluation</h3>
                        <p style={{ fontSize: '13.5px', color: 'var(--color-slate-400)', marginBottom: '20px' }}>
                            Complete this form after the physical assessment. This information will be used for the final certificate.
                        </p>

                        {caseData.status !== 'ASSESSMENT_SCHEDULED' ? (
                            <div className="alert alert-warning" style={{ marginBottom: 0 }}>
                                <AlertCircle size={16} />
                                <div>
                                    <strong>Evaluation Locked:</strong> You can only submit the final evaluation after the assessment has been scheduled by the administrator.
                                    <div style={{ fontSize: '12px', marginTop: '4px', opacity: 0.8 }}>Current Status: {caseData.status.replace(/_/g, ' ')}</div>
                                </div>
                            </div>
                        ) : (
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
                                    <label className="form-label">Supporting Evidence (Photographs & Reports)</label>
                                    <div style={{ 
                                        border: '2px dashed var(--border-color)', 
                                        borderRadius: 'var(--radius-md)', 
                                        padding: '24px', 
                                        textAlign: 'center',
                                        background: 'var(--surface-secondary)',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => document.getElementById('evidence-upload').click()}
                                    >
                                        <input id="evidence-upload" type="file" multiple 
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }} 
                                            accept=".pdf,image/*"
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ padding: '10px', background: 'var(--color-white)', borderRadius: '50%', boxShadow: 'var(--shadow-sm)' }}>
                                                <Download size={20} color="var(--color-slate-400)" />
                                            </div>
                                            <div>
                                                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-slate-700)' }}>Click to upload files</div>
                                                <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', marginTop: '2px' }}>PNG, JPG or PDF up to 5MB</div>
                                            </div>
                                        </div>
                                    </div>

                                    {files.length > 0 && (
                                        <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {files.map((file, i) => (
                                                <div key={i} className="card-inset" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px' }}>
                                                    <FileText size={14} color="var(--color-slate-400)" />
                                                    <div style={{ flex: 1, fontSize: '12.5px', color: 'var(--color-slate-700)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {file.name}
                                                    </div>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeFile(i); }} 
                                                        style={{ border: 'none', background: 'none', color: 'var(--color-rose-500)', fontSize: '18px', cursor: 'pointer', padding: '0 4px' }}>
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}

export default CaseDetail
