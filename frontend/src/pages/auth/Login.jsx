import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const user = await login(formData.email, formData.password);

            // Redirect based on role
            if (user.role === 'PWD_USER') {
                navigate('/dashboard');
            } else if (user.role === 'ADMIN') {
                navigate('/admin');
            } else if (user.role === 'DOCTOR') {
                navigate('/doctor');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: 'calc(100vh - 80px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 'var(--spacing-xl)'
            }}>
                <div className="card" style={{
                    maxWidth: '440px',
                    width: '100%'
                }}>
                    <h1 style={{
                        fontSize: '2rem',
                        marginBottom: 'var(--spacing-sm)',
                        textAlign: 'center'
                    }}>
                        Login
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        Access your disability certificate account
                    </p>

                    {error && (
                        <div style={{
                            padding: 'var(--spacing-md)',
                            background: 'var(--color-error-muted)',
                            border: '1px solid rgba(245, 101, 101, 0.2)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-error)',
                            marginBottom: 'var(--spacing-lg)',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-surface-2)',
                                    border: '1px solid var(--color-border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '0.9375rem'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-xl)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-surface-2)',
                                    border: '1px solid var(--color-border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-primary)',
                                    fontSize: '0.9375rem'
                                }}
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            disabled={loading}
                            style={{ width: '100%' }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: 'var(--spacing-lg)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        Don't have an account?{' '}
                        <a href="/register" style={{ color: 'var(--color-accent-primary)' }}>
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Login;
