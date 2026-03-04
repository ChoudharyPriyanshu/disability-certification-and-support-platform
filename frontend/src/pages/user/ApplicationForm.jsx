import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { applicationService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AlertCircle, Upload, X, FileText } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

const STEPS = ['Personal Details', 'Disability Info', 'Documents', 'Review & Submit']

const DISABILITY_TYPES = [
    'Locomotor', 'Visual', 'Hearing', 'Speech & Language',
    'Intellectual', 'Mental Illness', 'Multiple Disabilities', 'Other',
]

const ApplicationForm = () => {
    const [step, setStep] = useState(0)
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [form, setForm] = useState({
        applicantName: '', dateOfBirth: '', gender: '', address: '', phone: '',
        disabilityType: '', disabilityDescription: '', congenitalOrAcquired: '',
    })
    const navigate = useNavigate()

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const addFiles = (e) => {
        const selected = Array.from(e.target.files)
        setFiles((prev) => [...prev, ...selected].slice(0, 5))
    }

    const removeFile = (i) => setFiles((prev) => prev.filter((_, idx) => idx !== i))

    const nextStep = () => {
        setError('')
        if (step === 0 && !form.applicantName) { setError('Please enter your full name'); return }
        if (step === 1 && !form.disabilityType) { setError('Please select a disability type'); return }
        setStep((s) => Math.min(s + 1, STEPS.length - 1))
    }

    const handleSubmit = async () => {
        setLoading(true)
        setError('')
        try {
            const formData = new FormData()
            Object.entries(form).forEach(([k, v]) => { if (v) formData.append(k, v) })
            files.forEach((f) => formData.append('documents', f))

            await applicationService.submit(formData)
            toast.success('Application submitted successfully')
            navigate('/my-applications')
        } catch (err) {
            setError(err.response?.data?.message || 'Submission failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout pageTitle="Apply for Certificate" pageSubtitle="Disability certificate application">
            <div style={{ maxWidth: '680px' }}>
                {/* Step indicator */}
                <div className="card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
                    <div className="step-container">
                        {STEPS.map((label, i) => (
                            <div key={i} className="step-item">
                                {i > 0 && <div className={`step-line ${i <= step ? 'done' : ''}`} />}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div className={`step-circle ${i === step ? 'active' : i < step ? 'done' : ''}`}>
                                        {i < step ? '✓' : i + 1}
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: i === step ? 'var(--color-green-700)' : 'var(--color-slate-400)', whiteSpace: 'nowrap' }}>
                                        {label}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {error && (
                    <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} /><span>{error}</span>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ duration: 0.22 }}
                    >
                        <div className="card">
                            {/* Step 0 — Personal Details */}
                            {step === 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <h3 style={{ marginBottom: '4px' }}>Personal Details</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--color-slate-400)', marginBottom: '8px' }}>
                                        Enter your details exactly as they appear on your Aadhaar card.
                                    </p>
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="applicantName">Full name</label>
                                        <input id="applicantName" type="text" className="form-input" placeholder="Full legal name"
                                            value={form.applicantName} onChange={set('applicantName')} required />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                        <div className="form-field">
                                            <label className="form-label" htmlFor="dob">Date of birth</label>
                                            <input id="dob" type="date" className="form-input" value={form.dateOfBirth} onChange={set('dateOfBirth')} />
                                        </div>
                                        <div className="form-field">
                                            <label className="form-label">Gender</label>
                                            <select className="form-input form-select" value={form.gender} onChange={set('gender')}>
                                                <option value="">Select</option>
                                                <option>Male</option><option>Female</option><option>Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="phone">Phone number</label>
                                        <input id="phone" type="tel" className="form-input" placeholder="+91 XXXXXXXXXX"
                                            value={form.phone} onChange={set('phone')} />
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="address">Residential address</label>
                                        <textarea id="address" className="form-input form-textarea" rows={3} placeholder="Full address"
                                            value={form.address} onChange={set('address')} />
                                    </div>
                                </div>
                            )}

                            {/* Step 1 — Disability Info */}
                            {step === 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                                    <h3 style={{ marginBottom: '4px' }}>Disability Information</h3>
                                    <div className="form-field">
                                        <label className="form-label">Disability type</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                                            {DISABILITY_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setForm((f) => ({ ...f, disabilityType: type }))}
                                                    style={{
                                                        padding: '10px 12px',
                                                        borderRadius: 'var(--radius-md)',
                                                        border: `1.5px solid ${form.disabilityType === type ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                                        background: form.disabilityType === type ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                                                        color: form.disabilityType === type ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                                                        fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans)',
                                                        cursor: 'pointer', textAlign: 'left',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label">Nature of disability</label>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            {['Congenital', 'Acquired'].map((opt) => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setForm((f) => ({ ...f, congenitalOrAcquired: opt }))}
                                                    style={{
                                                        flex: 1, padding: '10px', borderRadius: 'var(--radius-md)',
                                                        border: `1.5px solid ${form.congenitalOrAcquired === opt ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                                        background: form.congenitalOrAcquired === opt ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                                                        color: form.congenitalOrAcquired === opt ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                                                        fontSize: '13px', fontWeight: 600, fontFamily: 'var(--font-sans)', cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-field">
                                        <label className="form-label" htmlFor="desc">Description</label>
                                        <textarea
                                            id="desc"
                                            className="form-input form-textarea"
                                            rows={4}
                                            placeholder="Describe the nature, extent, and history of your disability..."
                                            value={form.disabilityDescription}
                                            onChange={set('disabilityDescription')}
                                            required
                                        />
                                        <span className="form-hint">Provide clear details to help the assessment doctor.</span>
                                    </div>
                                </div>
                            )}

                            {/* Step 2 — Documents */}
                            {step === 2 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <h3 style={{ marginBottom: '4px' }}>Supporting Documents</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--color-slate-400)' }}>
                                        Upload relevant medical reports, prescriptions, and identity documents. Max 5 files, 5MB each.
                                    </p>

                                    <label className="upload-zone" htmlFor="file-upload">
                                        <Upload size={32} color="var(--color-slate-400)" style={{ margin: '0 auto 12px' }} />
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-700)', marginBottom: '4px' }}>
                                            Drop files here or click to browse
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--color-slate-400)' }}>
                                            PDF, JPEG, PNG — up to 5MB each
                                        </div>
                                        <input id="file-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.webp"
                                            style={{ display: 'none' }} onChange={addFiles} />
                                    </label>

                                    {files.length > 0 && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            {files.map((file, i) => (
                                                <div key={i} className="card-inset" style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px' }}>
                                                    <FileText size={16} color="var(--color-green-600)" />
                                                    <span style={{ flex: 1, fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {file.name}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>
                                                        {(file.size / 1024).toFixed(0)} KB
                                                    </span>
                                                    <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-danger)', padding: '2px' }}>
                                                        <X size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="alert alert-info">
                                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                                        <span>Documents are encrypted and only accessible to authorized medical personnel during review.</span>
                                    </div>
                                </div>
                            )}

                            {/* Step 3 — Review */}
                            {step === 3 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <h3 style={{ marginBottom: '4px' }}>Review Your Application</h3>
                                    <p style={{ fontSize: '14px', color: 'var(--color-slate-400)' }}>
                                        Please review your information before submitting. You cannot edit after submission.
                                    </p>

                                    {[
                                        { label: 'Full Name', value: form.applicantName },
                                        { label: 'Date of Birth', value: form.dateOfBirth },
                                        { label: 'Gender', value: form.gender },
                                        { label: 'Phone', value: form.phone },
                                        { label: 'Address', value: form.address },
                                        { label: 'Disability Type', value: form.disabilityType },
                                        { label: 'Nature', value: form.congenitalOrAcquired },
                                        { label: 'Documents', value: `${files.length} file(s) attached` },
                                    ].map(({ label, value }) => (
                                        <div key={label} style={{ display: 'flex', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-light)' }}>
                                            <span style={{ width: '140px', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', flexShrink: 0, paddingTop: '2px' }}>
                                                {label}
                                            </span>
                                            <span style={{ fontSize: '14px', color: 'var(--color-slate-800)', fontWeight: 500 }}>
                                                {value || '—'}
                                            </span>
                                        </div>
                                    ))}

                                    <div className="form-field">
                                        <label style={{ display: 'flex', gap: '10px', cursor: 'pointer', alignItems: 'flex-start' }}>
                                            <input type="checkbox" required style={{ marginTop: '3px' }} />
                                            <span style={{ fontSize: '13px', color: 'var(--color-slate-600)', lineHeight: 1.6 }}>
                                                I declare that the information provided is true and correct to the best of my knowledge. I understand that submitting false information is punishable under applicable law.
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            )}

                            {/* Navigation */}
                            <div style={{ display: 'flex', gap: '12px', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
                                {step > 0 && (
                                    <button type="button" className="btn btn-secondary" onClick={() => setStep((s) => s - 1)}>
                                        Back
                                    </button>
                                )}
                                <div style={{ flex: 1 }} />
                                {step < STEPS.length - 1 ? (
                                    <button type="button" className="btn btn-primary" onClick={nextStep}>
                                        Continue
                                    </button>
                                ) : (
                                    <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
                                        {loading ? <span className="spinner spinner-sm" /> : 'Submit Application'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </DashboardLayout>
    )
}

export default ApplicationForm
