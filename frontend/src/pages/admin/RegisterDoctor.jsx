import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../layouts/DashboardLayout'
import { AlertCircle, Eye, EyeOff, Stethoscope, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const SPECIALIZATIONS = [
    'General Medicine', 'Orthopedics', 'Neurology', 'Ophthalmology',
    'ENT', 'Psychiatry', 'Physical Medicine & Rehabilitation', 'Other',
]

const RegisterDoctor = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        specialization: '', licenseNumber: '', hospital: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [created, setCreated] = useState(null)
    const navigate = useNavigate()

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
        if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
        setLoading(true)
        try {
            const { name, email, password, specialization, licenseNumber, hospital } = form
            const { data } = await api.post('/auth/doctor/register', { name, email, password, specialization, licenseNumber, hospital })
            setCreated(data.data)
            toast.success(`Dr. ${data.data.name} registered successfully`)
            setForm({ name: '', email: '', password: '', confirmPassword: '', specialization: '', licenseNumber: '', hospital: '' })
        } catch (err) {
            setError(err.response?.data?.message || 'Doctor registration failed.')
        } finally {
            setLoading(false)
        }
    }

    if (created) return (
        <DashboardLayout pageTitle="Register Doctor" pageSubtitle="Add a new doctor to the platform">
            <div style={{ maxWidth: '480px' }}>
                <div className="card" style={{ textAlign: 'center', padding: '40px 32px', background: 'var(--color-green-50)', borderColor: 'var(--color-green-200)' }}>
                    <CheckCircle size={48} color="var(--color-green-700)" style={{ margin: '0 auto 16px' }} />
                    <h3 style={{ fontSize: '1.125rem', color: 'var(--color-green-800)', marginBottom: '8px' }}>
                        Doctor Registered Successfully
                    </h3>
                    <p style={{ fontSize: '14px', color: 'var(--color-green-700)', marginBottom: '24px' }}>
                        <strong>Dr. {created.name}</strong> has been added to the platform.<br />
                        They can now sign in using their email and password.
                    </p>
                    <div className="card-inset" style={{ background: 'white', padding: '12px 16px', marginBottom: '20px', textAlign: 'left' }}>
                        <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', marginBottom: '8px' }}>Login Credentials</div>
                        <div style={{ fontSize: '13px', color: 'var(--color-slate-700)' }}>
                            <div><strong>Email:</strong> {created.email}</div>
                            <div><strong>Specialization:</strong> {created.specialization}</div>
                            <div><strong>Hospital:</strong> {created.hospital}</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCreated(null)}>Register Another</button>
                        <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => navigate('/admin/doctors')}>
                            View All Doctors
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )

    return (
        <DashboardLayout pageTitle="Register Doctor" pageSubtitle="Add a new doctor to the platform">
            <div style={{ maxWidth: '540px' }}>
                {error && (
                    <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <span>{error}</span>
                    </div>
                )}
                <div className="card">
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                        <div className="form-field">
                            <label className="form-label" htmlFor="name">Full Name</label>
                            <input id="name" type="text" className="form-input" placeholder="Dr. Rajesh Kumar"
                                value={form.name} onChange={set('name')} required />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="email">Email Address</label>
                            <input id="email" type="email" className="form-input" placeholder="doctor@hospital.gov.in"
                                value={form.email} onChange={set('email')} required autoComplete="off" />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="specialization">Specialization</label>
                            <select id="specialization" className="form-input form-select"
                                value={form.specialization} onChange={set('specialization')} required>
                                <option value="">Select specialization...</option>
                                {SPECIALIZATIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="licenseNumber">Medical License Number</label>
                            <input id="licenseNumber" type="text" className="form-input" placeholder="MCI-XXXXXXXXXX"
                                value={form.licenseNumber} onChange={set('licenseNumber')} required />
                            <span className="form-hint">Stored with AES-256 encryption</span>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="hospital">Hospital / Institute</label>
                            <input id="hospital" type="text" className="form-input" placeholder="AIIMS, New Delhi"
                                value={form.hospital} onChange={set('hospital')} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label" htmlFor="drPassword">Password</label>
                                <div style={{ position: 'relative' }}>
                                    <input id="drPassword" type={showPassword ? 'text' : 'password'}
                                        className="form-input" placeholder="Min. 6 characters"
                                        value={form.password} onChange={set('password')}
                                        required minLength={6} style={{ paddingRight: '40px' }} autoComplete="new-password" />
                                    <button type="button" onClick={() => setShowPassword((v) => !v)}
                                        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)', padding: '4px' }}>
                                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                                    </button>
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="drConfirmPassword">Confirm Password</label>
                                <input id="drConfirmPassword" type="password" className="form-input" placeholder="Re-enter"
                                    value={form.confirmPassword} onChange={set('confirmPassword')} required autoComplete="new-password" />
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary" disabled={loading}
                            style={{ width: '100%', marginTop: '4px', justifyContent: 'center' }}>
                            {loading ? <span className="spinner spinner-sm" /> : <><Stethoscope size={15} /> Register Doctor</>}
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default RegisterDoctor
