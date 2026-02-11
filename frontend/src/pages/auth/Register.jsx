import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'PWD_USER',
        profile: {
            firstName: '',
            lastName: '',
            phone: '',
            dateOfBirth: ''
        }
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { register: registerUser } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'role' || name === 'email' || name === 'password' || name === 'confirmPassword') {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({
                ...formData,
                profile: { ...formData.profile, [name]: value }
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const userData = {
                email: formData.email,
                password: formData.password,
                role: formData.role,
                profile: formData.profile
            };

            const user = await registerUser(userData);

            if (user.role === 'PWD_USER') {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
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
                <div className="card" style={{ maxWidth: '500px', width: '100%' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        marginBottom: 'var(--spacing-sm)',
                        textAlign: 'center'
                    }}>
                        Register
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                        marginBottom: 'var(--spacing-xl)'
                    }}>
                        Create your account to apply for disability certificate
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-md)' }}>
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.profile.firstName}
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
                            <div>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.profile.lastName}
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
                        </div>

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Email
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

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.profile.phone}
                                onChange={handleChange}
                                required
                                pattern="[0-9]{10}"
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

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: 'var(--spacing-sm)',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                color: 'var(--color-text-secondary)'
                            }}>
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dateOfBirth"
                                value={formData.profile.dateOfBirth}
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

                        <div style={{ marginBottom: 'var(--spacing-md)' }}>
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
                                minLength="6"
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
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
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
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                    </form>

                    <p style={{
                        textAlign: 'center',
                        marginTop: 'var(--spacing-lg)',
                        fontSize: '0.875rem',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        Already have an account?{' '}
                        <a href="/login" style={{ color: 'var(--color-accent-primary)' }}>
                            Login here
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
};

export default Register;
