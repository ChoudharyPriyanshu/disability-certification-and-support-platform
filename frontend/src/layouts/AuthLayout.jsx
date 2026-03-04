import { Link } from 'react-router-dom'
import { Shield } from 'lucide-react'

const AuthLayout = ({ children, title, subtitle }) => {
    return (
        <div className="auth-layout">
            {/* Left panel — institutional branding */}
            <aside className="auth-panel">
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
                        <div style={{
                            width: '44px', height: '44px', borderRadius: '8px',
                            background: 'rgba(255,255,255,0.15)', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Shield size={24} color="white" />
                        </div>
                        <div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 700 }}>
                                Government of India
                            </div>
                            <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: 600, fontFamily: 'var(--font-serif)' }}>
                                Disability Certificate Platform
                            </div>
                        </div>
                    </div>

                    <h2 style={{ color: '#ffffff', fontSize: '2rem', fontFamily: 'var(--font-serif)', fontWeight: 600, lineHeight: 1.25, marginBottom: '20px' }}>
                        Supporting citizens with dignity and transparency.
                    </h2>

                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '15px', lineHeight: 1.7, maxWidth: '340px' }}>
                        Secure, accessible, and blockchain-verified disability certification under the Rights of Persons with Disabilities Act, 2016.
                    </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: '32px' }}>
                    <div style={{ display: 'flex', gap: '32px' }}>
                        {[
                            { num: '2.1 Cr+', label: 'Registered PwD' },
                            { num: 'RPwD 2016', label: 'Legal Framework' },
                            { num: 'ISO 27001', label: 'Data Security' },
                        ].map((stat) => (
                            <div key={stat.num}>
                                <div style={{ color: '#ffffff', fontSize: '1.125rem', fontFamily: 'var(--font-serif)', fontWeight: 700 }}>
                                    {stat.num}
                                </div>
                                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', marginTop: '2px' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>

            {/* Right panel — form */}
            <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px, 6vw, 72px)', background: 'var(--color-ivory)' }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    {/* Mobile logo */}
                    <div style={{ display: 'none', alignItems: 'center', gap: '10px', marginBottom: '32px' }} className="mobile-logo">
                        <Shield size={22} color="var(--color-green-700)" />
                        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-slate-800)' }}>
                            Disability Certificate Platform
                        </span>
                    </div>

                    {title && (
                        <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '1.75rem', marginBottom: '8px' }}>{title}</h1>
                            {subtitle && (
                                <p style={{ color: 'var(--color-slate-500)', fontSize: '15px' }}>{subtitle}</p>
                            )}
                        </div>
                    )}

                    {children}
                </div>
            </main>
        </div>
    )
}

export default AuthLayout
