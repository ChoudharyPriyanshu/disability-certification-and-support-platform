import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/apiServices'
import AuthLayout from '../../layouts/AuthLayout'
import { AlertCircle, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
    const [step, setStep] = useState(1)
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        phone: '', aadhaar: '', address: '', dateOfBirth: '', gender: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        setError('')
        setLoading(true)

        try {
            const { data } = await authService.register(form)
            login(data.data)
            toast.success('Account created successfully')
            navigate('/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Create account"
            subtitle="Register as a Person with Disability"
        >
            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Step indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
                {[1, 2].map((s) => (
                    <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: s === 1 ? 'none' : 1 }}>
                        {s > 1 && (
                            <div style={{ flex: 1, height: '2px', background: step >= s ? 'var(--color-green-400)' : 'var(--border-color)', transition: 'background 0.3s ease' }} />
                        )}
                        <div style={{
                            width: '28px', height: '28px', borderRadius: '50%',
                            background: step >= s ? 'var(--color-green-700)' : 'var(--surface-secondary)',
                            border: `2px solid ${step >= s ? 'var(--color-green-700)' : 'var(--border-color)'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '12px', fontWeight: 700, fontFamily: 'var(--font-mono)',
                            color: step >= s ? 'white' : 'var(--color-slate-400)',
                            transition: 'all 0.25s ease',
                        }}>
                            {s}
                        </div>
                    </div>
                ))}
                <div style={{ flex: 1, height: '2px', background: 'var(--border-color)' }} />
                <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', whiteSpace: 'nowrap' }}>
                    Step {step} of 2
                </div>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {step === 1 && (
                    <>
                        <div className="form-field">
                            <label className="form-label" htmlFor="name">Full name</label>
                            <input id="name" type="text" className="form-input" placeholder="As on Aadhaar card"
                                value={form.name} onChange={set('name')} required autoComplete="name" />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="email">Email address</label>
                            <input id="email" type="email" className="form-input" placeholder="you@example.com"
                                value={form.email} onChange={set('email')} required autoComplete="email" />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="password">Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Minimum 6 characters"
                                    value={form.password}
                                    onChange={set('password')}
                                    required
                                    minLength={6}
                                    style={{ paddingRight: '44px' }}
                                />
                                <button type="button" onClick={() => setShowPassword((v) => !v)}
                                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)', padding: '4px' }}>
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="confirmPassword">Confirm password</label>
                            <input id="confirmPassword" type="password" className="form-input" placeholder="Re-enter password"
                                value={form.confirmPassword} onChange={set('confirmPassword')} required />
                        </div>
                        <button type="button" className="btn btn-primary" style={{ width: '100%', marginTop: '4px', justifyContent: 'center' }}
                            onClick={() => {
                                if (!form.name || !form.email || !form.password) return
                                if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
                                setError(''); setStep(2)
                            }}>
                            Continue
                        </button>
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="form-field">
                            <label className="form-label" htmlFor="phone">Phone number</label>
                            <input id="phone" type="tel" className="form-input" placeholder="+91 98765 43210"
                                value={form.phone} onChange={set('phone')} />
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="aadhaar">Aadhaar number</label>
                            <input id="aadhaar" type="text" className="form-input" placeholder="XXXX XXXX XXXX (encrypted)"
                                value={form.aadhaar} onChange={set('aadhaar')} maxLength={12} />
                            <span className="form-hint">Stored with AES-256 encryption</span>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label" htmlFor="dob">Date of birth</label>
                                <input id="dob" type="date" className="form-input"
                                    value={form.dateOfBirth} onChange={set('dateOfBirth')} />
                            </div>
                            <div className="form-field">
                                <label className="form-label" htmlFor="gender">Gender</label>
                                <select id="gender" className="form-input form-select"
                                    value={form.gender} onChange={set('gender')}>
                                    <option value="">Select</option>
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label" htmlFor="address">Address</label>
                            <textarea id="address" className="form-input form-textarea" rows={3} placeholder="Full residential address"
                                value={form.address} onChange={set('address')} />
                        </div>
                        <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
                            <button type="button" className="btn btn-secondary" style={{ flex: 1 }}
                                onClick={() => setStep(1)}>Back</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 2, justifyContent: 'center' }}
                                disabled={loading}>
                                {loading ? <span className="spinner spinner-sm" /> : 'Create account'}
                            </button>
                        </div>
                    </>
                )}
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-slate-500)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-green-700)' }}>Sign in</Link>
            </p>
        </AuthLayout>
    )
}

export default Register
