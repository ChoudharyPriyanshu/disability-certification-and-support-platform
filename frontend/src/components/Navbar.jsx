import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    const userNavLinks = [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/apply', label: 'Apply' },
        { to: '/schemes', label: 'Welfare Schemes' },
        { to: '/equipment', label: 'Equipment' },
    ];

    const adminNavLinks = [
        { to: '/admin', label: 'Dashboard' },
    ];

    const doctorNavLinks = [
        { to: '/doctor', label: 'Dashboard' },
    ];

    const getNavLinks = () => {
        if (!user) return [];
        switch (user.role) {
            case 'PWD_USER':
                return userNavLinks;
            case 'ADMIN':
                return adminNavLinks;
            case 'DOCTOR':
                return doctorNavLinks;
            default:
                return [];
        }
    };

    return (
        <nav style={{
            background: 'var(--color-surface-1)',
            borderBottom: '1px solid var(--color-border-default)',
            padding: 'var(--spacing-lg) 0', position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                <Link to="/" style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--color-text-primary)'
                }}>
                    Disability Certificate Platform
                </Link>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-xl)'
                }}>
                    {user && (
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-lg)'
                        }}>
                            {getNavLinks().map(link => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    style={{
                                        color: 'var(--color-text-secondary)',
                                        fontSize: '0.9375rem',
                                        fontWeight: 500,
                                        transition: 'color var(--transition-fast)'
                                    }}
                                    onMouseEnter={(e) => e.target.style.color = 'var(--color-text-primary)'}
                                    onMouseLeave={(e) => e.target.style.color = 'var(--color-text-secondary)'}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {user ? (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--spacing-md)'
                        }}>
                            <span style={{
                                color: 'var(--color-text-tertiary)',
                                fontSize: '0.875rem'
                            }}>
                                {user.profile?.firstName} {user.profile?.lastName}
                            </span>
                            <button
                                onClick={logout}
                                style={{
                                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                                    background: 'transparent',
                                    border: '1px solid var(--color-border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer',
                                    transition: 'all var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.borderColor = 'var(--color-border-strong)';
                                    e.target.style.background = 'var(--color-surface-2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.borderColor = 'var(--color-border-default)';
                                    e.target.style.background = 'transparent';
                                }}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                            <Link to="/login">
                                <button style={{
                                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                                    background: 'transparent',
                                    border: '1px solid var(--color-border-default)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text-secondary)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}>
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button style={{
                                    padding: 'var(--spacing-sm) var(--spacing-lg)',
                                    background: 'var(--color-accent-primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}>
                                    Register
                                </button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
