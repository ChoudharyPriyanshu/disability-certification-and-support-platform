import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/apiServices'
import AuthLayout from '../../layouts/AuthLayout'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const ROLES = [
    { value: 'PWD_USER', label: 'Citizen (PwD)' },
    { value: 'ADMIN', label: 'Medical Authority' },
    { value: 'DOCTOR', label: 'Doctor' },
]

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '', role: 'PWD_USER' })
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const { login } = useAuth()
    const navigate = useNavigate()

    const redirectMap = {
        PWD_USER: '/dashboard',
        ADMIN: '/admin/dashboard',
        DOCTOR: '/doctor/dashboard',
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const { data } = await authService.login(form)
            login(data.data)
            toast.success(`Welcome back, ${data.data.name}`)
            navigate(redirectMap[data.data.role] || '/dashboard')
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <AuthLayout
            title="Sign in"
            subtitle="Access your disability certificate portal"
        >
            {/* Role tabs */}
            <div style={{
                display: 'flex',
                background: 'var(--color-ivory-dark)',
                borderRadius: 'var(--radius-md)',
                padding: '4px',
                marginBottom: '28px',
                gap: '2px',
            }}>
                {ROLES.map((r) => (
                    <button
                        key={r.value}
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, role: r.value }))}
                        style={{
                            flex: 1,
                            padding: '7px 8px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 600,
                            fontFamily: 'var(--font-sans)',
                            transition: 'all 0.15s ease',
                            background: form.role === r.value ? 'var(--surface-secondary)' : 'transparent',
                            color: form.role === r.value ? 'var(--color-green-700)' : 'var(--color-slate-500)',
                            boxShadow: form.role === r.value ? 'var(--shadow-sm)' : 'none',
                        }}
                    >
                        {r.label}
                    </button>
                ))}
            </div>

            {error && (
                <div className="alert alert-danger" style={{ marginBottom: '20px' }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div className="form-field">
                    <label className="form-label" htmlFor="email">Email address</label>
                    <input
                        id="email"
                        type="email"
                        className="form-input"
                        placeholder="you@example.gov.in"
                        value={form.email}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        required
                        autoComplete="email"
                    />
                </div>

                <div className="form-field">
                    <label className="form-label" htmlFor="password">Password</label>
                    <div style={{ position: 'relative' }}>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="form-input"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                            required
                            autoComplete="current-password"
                            style={{ paddingRight: '44px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            style={{
                                position: 'absolute', right: '12px', top: '50%',
                                transform: 'translateY(-50%)', background: 'none',
                                border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)',
                                padding: '4px',
                            }}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                >
                    {loading ? <span className="spinner spinner-sm" /> : 'Sign in'}
                </button>
            </form>

            {form.role === 'PWD_USER' && (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-slate-500)' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-green-700)' }}>
                        Register here
                    </Link>
                </p>
            )}

            {form.role === 'ADMIN' && (
                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: 'var(--color-slate-500)' }}>
                    New Medical Authority?{' '}
                    <Link to="/register/authority" style={{ fontWeight: 600, color: 'var(--color-green-700)' }}>
                        Register your institution
                    </Link>
                </p>
            )}

            {form.role === 'DOCTOR' && (
                <div style={{
                    marginTop: '20px', padding: '12px 16px', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-ivory-dark)', border: '1px solid var(--border-color)',
                    fontSize: '13px', color: 'var(--color-slate-500)', textAlign: 'center', lineHeight: 1.55,
                }}>
                    Doctor accounts are created by the <strong style={{ color: 'var(--color-slate-700)' }}>Medical Authority</strong>.<br />
                    Contact your district medical officer to get registered.
                </div>
            )}

            <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--color-slate-400)', textAlign: 'center', lineHeight: 1.6 }}>
                By signing in, you agree to the terms of use under the<br />
                Information Technology Act, 2000.
            </p>
        </AuthLayout>
    )
}

export default Login
