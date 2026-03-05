import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../../services/apiServices'
import AuthLayout from '../../layouts/AuthLayout'
import { AlertCircle, Eye, EyeOff, Building2, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const AdminRegister = () => {
    const [form, setForm] = useState({
        name: '', email: '', password: '', confirmPassword: '',
        institution: '', designation: '',
    })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match')
            return
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        setLoading(true)
        try {
            const { name, email, password, institution, designation } = form
            await authService.registerAdmin({ name, email, password, institution, designation })
            toast.success('Medical Authority account created! Please sign in.')
            navigate('/login')
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Register as Medical Authority"
            subtitle="Create a government medical authority account"
        >
            <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px',
                background: 'var(--color-green-50)', borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-green-200)', marginBottom: '24px',
            }}>
                <ShieldCheck size={18} color="var(--color-green-700)" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: '12.5px', color: 'var(--color-green-800)', lineHeight: 1.5, margin: 0 }}>
                    Medical Authority accounts can review applications, assign doctors, approve certificates, and manage the platform.
                </p>
            </div>

            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-field">
                    <label className="form-label" htmlFor="name">Full Name</label>
                    <input id="name" type="text" className="form-input" placeholder="Dr. Priya Sharma"
                        value={form.name} onChange={set('name')} required autoComplete="name" />
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="email">Official Email</label>
                    <input id="email" type="email" className="form-input" placeholder="you@aiims.gov.in"
                        value={form.email} onChange={set('email')} required autoComplete="email" />
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="institution">Institution / Hospital</label>
                    <div style={{ position: 'relative' }}>
                        <Building2 size={15} color="var(--color-slate-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input id="institution" type="text" className="form-input" placeholder="AIIMS, New Delhi"
                            style={{ paddingLeft: '36px' }}
                            value={form.institution} onChange={set('institution')} required />
                    </div>
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="designation">Designation / Post</label>
                    <input id="designation" type="text" className="form-input"
                        placeholder="Chief Medical Officer / Civil Surgeon"
                        value={form.designation} onChange={set('designation')} required />
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
                            required minLength={6}
                            style={{ paddingRight: '44px' }}
                            autoComplete="new-password"
                        />
                        <button type="button" onClick={() => setShowPassword((v) => !v)}
                            style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)', padding: '4px' }}>
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
                    <input id="confirmPassword" type="password" className="form-input" placeholder="Re-enter password"
                        value={form.confirmPassword} onChange={set('confirmPassword')} required autoComplete="new-password" />
                </div>

                <button type="submit" className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '4px', justifyContent: 'center' }}>
                    {loading ? <span className="spinner spinner-sm" /> : 'Create Authority Account'}
                </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-slate-500)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-green-700)' }}>Sign in</Link>
            </p>
        </AuthLayout>
    )
}

export default AdminRegister
