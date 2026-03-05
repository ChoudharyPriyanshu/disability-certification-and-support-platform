import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Shield, Award, ShoppingBag, BookOpen, ChevronRight,
    CheckCircle, Lock, Zap, Users, FileText, ArrowRight
} from 'lucide-react'

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] } }),
}

const FEATURES = [
    {
        icon: Shield,
        title: 'Blockchain-Verified Certificates',
        desc: 'Every certificate is cryptographically hashed and optionally anchored on the Polygon blockchain, making forgery impossible.',
        color: '#1e5236',
    },
    {
        icon: FileText,
        title: 'Digital Certificate Applications',
        desc: 'Apply for your disability certificate online. Upload documents, track status in real time, and receive your certificate digitally.',
        color: '#1e3a5f',
    },
    {
        icon: BookOpen,
        title: 'Government Schemes Hub',
        desc: 'Discover all central and state government schemes you are eligible for — filtered by disability type and percentage.',
        color: '#4a3500',
    },
    {
        icon: ShoppingBag,
        title: 'Assistive Equipment Store',
        desc: 'Browse and order government-subsidised mobility aids, hearing devices, visual aids, and more from one platform.',
        color: '#3d1a00',
    },
    {
        icon: Lock,
        title: 'AES-256 Encrypted Data',
        desc: 'Aadhaar numbers and medical license data are encrypted with military-grade AES-256 before storage.',
        color: '#1e3a5f',
    },
    {
        icon: Users,
        title: 'Multi-Role Workflow',
        desc: 'Integrated roles for PwD citizens, Medical Authority officers, and assigned doctors — each with tailored access.',
        color: '#1e5236',
    },
]

const STATS = [
    { value: '2.1 Cr+', label: 'Registered PwD in India' },
    { value: 'RPwD 2016', label: 'Legal Framework' },
    { value: 'ISO 27001', label: 'Data Security Standard' },
    { value: 'Polygon', label: 'Blockchain Network' },
]

const HOW_IT_WORKS = [
    { step: '01', title: 'Register & Apply', desc: 'Create your citizen account, fill the application form, and upload supporting medical documents.' },
    { step: '02', title: 'Medical Assessment', desc: 'The Medical Authority assigns a certified doctor who evaluates your case and records the disability percentage.' },
    { step: '03', title: 'Certificate Issued', desc: 'Upon approval, a tamper-proof, QR-coded disability certificate is generated and optionally recorded on blockchain.' },
    { step: '04', title: 'Access Benefits', desc: 'Use your certificate to avail government schemes and shop for assistive equipment at subsidised rates.' },
]

const LandingPage = () => {
    return (
        <div style={{ fontFamily: 'var(--font-sans)', background: 'var(--color-ivory)', minHeight: '100vh' }}>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: 'sticky', top: 0, zIndex: 100,
                background: 'rgba(250, 248, 245, 0.92)', backdropFilter: 'blur(12px)',
                borderBottom: '1px solid var(--border-light)',
                padding: '0 clamp(20px, 5vw, 80px)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: '64px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="/logo.png" alt="SAKSHAM logo" style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }} />
                    <div>
                        <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-green-800)', lineHeight: 1 }}>
                            SAKSHAM
                        </div>
                        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-slate-400)', lineHeight: 1 }}>
                            Disability Portal
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link to="/verify" style={{ fontSize: '13.5px', fontWeight: 500, color: 'var(--color-slate-600)', textDecoration: 'none', padding: '6px 12px' }}>
                        Verify Certificate
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-sm">Sign In</Link>
                    <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section style={{
                padding: 'clamp(64px, 10vh, 112px) clamp(20px, 5vw, 80px)',
                maxWidth: '1200px', margin: '0 auto',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px',
                alignItems: 'center',
            }}>
                <motion.div initial="hidden" animate="visible" variants={fadeUp}>
                    <motion.div custom={0} variants={fadeUp}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '5px 12px', borderRadius: '100px',
                            background: 'var(--color-green-50)', border: '1px solid var(--color-green-200)',
                            fontSize: '12px', fontWeight: 700, letterSpacing: '0.05em',
                            color: 'var(--color-green-700)', textTransform: 'uppercase',
                            marginBottom: '24px',
                        }}>
                        <Shield size={12} />
                        Government of India — Digital Public Infrastructure
                    </motion.div>

                    <motion.h1 custom={1} variants={fadeUp}
                        style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
                            fontWeight: 700, lineHeight: 1.15,
                            color: 'var(--color-slate-900)', marginBottom: '20px',
                        }}>
                        Dignity. Transparency.<br />
                        <span style={{ color: 'var(--color-green-700)' }}>Empowerment.</span>
                    </motion.h1>

                    <motion.p custom={2} variants={fadeUp}
                        style={{
                            fontSize: '1.0625rem', color: 'var(--color-slate-500)',
                            lineHeight: 1.75, marginBottom: '36px', maxWidth: '480px',
                        }}>
                        <strong style={{ color: 'var(--color-slate-700)' }}>SAKSHAM</strong> is India's blockchain-enabled disability certification platform — secure, verifiable, and built for every Person with Disability under the Rights of Persons with Disabilities Act, 2016.
                    </motion.p>

                    <motion.div custom={3} variants={fadeUp} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Link to="/register" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '15px' }}>
                            Apply for Certificate <ArrowRight size={16} />
                        </Link>
                        <Link to="/verify" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '15px' }}>
                            Verify a Certificate
                        </Link>
                    </motion.div>

                    <motion.div custom={4} variants={fadeUp}
                        style={{ display: 'flex', gap: '24px', marginTop: '40px', flexWrap: 'wrap' }}>
                        {[
                            'Free to use — no fees',
                            'Blockchain-backed',
                            'Works on all devices',
                        ].map((t) => (
                            <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--color-slate-500)' }}>
                                <CheckCircle size={14} color="var(--color-green-600)" />
                                {t}
                            </div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Hero visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    style={{ position: 'relative' }}
                >
                    {/* Certificate mockup card */}
                    <div style={{
                        background: 'white', borderRadius: '16px',
                        boxShadow: '0 24px 80px rgba(30,82,54,0.12), 0 4px 16px rgba(0,0,0,0.06)',
                        padding: '32px', border: '1px solid var(--border-color)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, var(--color-green-700), #2d8a5e)' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <img src="/logo.png" alt="SAKSHAM" style={{ width: '32px', height: '32px', borderRadius: '6px' }} />
                            <div>
                                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-slate-400)' }}>Government of India</div>
                                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '15px', fontWeight: 700, color: 'var(--color-slate-900)' }}>SAKSHAM — Disability Certificate</div>
                            </div>
                        </div>
                        <div style={{ height: '1px', background: 'var(--border-light)', margin: '0 0 20px' }} />
                        {[
                            { label: 'Certificate No.', value: 'SKSM-2026-00142' },
                            { label: 'Disability Type', value: 'Locomotor' },
                            { label: 'Percentage', value: '65%' },
                            { label: 'Issued By', value: 'Dr. Anjali Sharma, AIIMS' },
                            { label: 'Valid Until', value: 'Lifetime' },
                        ].map(({ label, value }) => (
                            <div key={label} style={{ display: 'flex', gap: '12px', marginBottom: '10px', alignItems: 'flex-start' }}>
                                <span style={{ width: '120px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-slate-400)', flexShrink: 0 }}>{label}</span>
                                <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)' }}>{value}</span>
                            </div>
                        ))}
                        <div style={{ height: '1px', background: 'var(--border-light)', margin: '16px 0' }} />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', background: 'var(--color-green-50)', borderRadius: '8px', border: '1px solid var(--color-green-200)' }}>
                            <CheckCircle size={14} color="var(--color-green-700)" />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-green-700)', fontFamily: 'var(--font-mono)', letterSpacing: '0.02em' }}>
                                Blockchain Verified — 0x3f7...d4a1
                            </span>
                        </div>
                    </div>

                    {/* Floating badge */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                        style={{
                            position: 'absolute', bottom: '-16px', left: '-16px',
                            background: 'var(--color-green-800)', color: 'white',
                            borderRadius: '12px', padding: '12px 16px',
                            boxShadow: '0 8px 24px rgba(30,82,54,0.3)',
                            fontSize: '12px', fontWeight: 700,
                        }}>
                        <Zap size={14} style={{ display: 'inline', marginRight: '4px' }} />
                        Instant Verification
                    </motion.div>
                </motion.div>
            </section>

            {/* ── STATS ── */}
            <section style={{ background: 'var(--color-green-800)', padding: 'clamp(40px, 6vh, 64px) clamp(20px, 5vw, 80px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '32px' }}>
                    {STATS.map(({ value, label }, i) => (
                        <motion.div key={label}
                            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                            style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '6px' }}>
                                {value}
                            </div>
                            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 600 }}>
                                {label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section style={{ padding: 'clamp(64px, 10vh, 96px) clamp(20px, 5vw, 80px)', maxWidth: '1200px', margin: '0 auto' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    style={{ textAlign: 'center', marginBottom: '56px' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '14px' }}>
                        Built for trust, built for scale
                    </h2>
                    <p style={{ fontSize: '1.0625rem', color: 'var(--color-slate-500)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.7 }}>
                        Every feature of SAKSHAM is designed with accessibility, security, and transparency at its core.
                    </p>
                </motion.div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                    {FEATURES.map(({ icon: Icon, title, desc, color }, i) => (
                        <motion.div key={title}
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                            style={{
                                background: 'white', borderRadius: '14px',
                                border: '1px solid var(--border-color)',
                                padding: '28px', transition: 'box-shadow 0.2s, transform 0.2s',
                            }}
                            whileHover={{ y: -4, boxShadow: '0 16px 48px rgba(0,0,0,0.08)' }}
                        >
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '10px',
                                background: `color-mix(in srgb, ${color} 10%, white)`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                marginBottom: '16px', border: `1px solid color-mix(in srgb, ${color} 20%, white)`,
                            }}>
                                <Icon size={20} color={color} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-slate-900)', marginBottom: '10px' }}>
                                {title}
                            </h3>
                            <p style={{ fontSize: '13.5px', color: 'var(--color-slate-500)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section style={{ background: 'var(--color-ivory-dark)', padding: 'clamp(64px, 10vh, 96px) clamp(20px, 5vw, 80px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                        style={{ textAlign: 'center', marginBottom: '56px' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '14px' }}>
                            How SAKSHAM works
                        </h2>
                        <p style={{ fontSize: '1.0625rem', color: 'var(--color-slate-500)', maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
                            From application to blockchain-verified certificate in four transparent steps.
                        </p>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
                        {HOW_IT_WORKS.map(({ step, title, desc }, i) => (
                            <motion.div key={step}
                                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                                style={{ position: 'relative' }}>
                                <div style={{
                                    fontFamily: 'var(--font-serif)', fontSize: '3rem', fontWeight: 700,
                                    color: 'var(--color-green-100)', lineHeight: 1, marginBottom: '12px',
                                    letterSpacing: '-0.02em',
                                }}>
                                    {step}
                                </div>
                                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-slate-900)', marginBottom: '10px' }}>
                                    {title}
                                </h3>
                                <p style={{ fontSize: '13.5px', color: 'var(--color-slate-500)', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section style={{ padding: 'clamp(64px, 10vh, 96px) clamp(20px, 5vw, 80px)', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <div style={{
                        background: 'linear-gradient(135deg, var(--color-green-800) 0%, #2d8a5e 100%)',
                        borderRadius: '20px', padding: 'clamp(40px, 6vh, 64px) clamp(24px, 4vw, 64px)',
                        position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                        <div style={{ position: 'absolute', bottom: '-60px', left: '-20px', width: '240px', height: '240px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
                        <div style={{ position: 'relative' }}>
                            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, color: 'white', marginBottom: '16px' }}>
                                Begin your journey today
                            </h2>
                            <p style={{ fontSize: '1.0625rem', color: 'rgba(255,255,255,0.75)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
                                Join thousands of PwD citizens who have received their official disability certificate through SAKSHAM.
                            </p>
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <Link to="/register"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '13px 28px', borderRadius: '8px',
                                        background: 'white', color: 'var(--color-green-800)',
                                        fontWeight: 700, fontSize: '15px', textDecoration: 'none',
                                        transition: 'transform 0.15s', fontFamily: 'var(--font-sans)',
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
                                >
                                    Register as Citizen <ArrowRight size={16} />
                                </Link>
                                <Link to="/register/authority"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                                        padding: '13px 24px', borderRadius: '8px',
                                        background: 'transparent', color: 'white',
                                        fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                                        border: '1.5px solid rgba(255,255,255,0.4)',
                                        fontFamily: 'var(--font-sans)',
                                    }}
                                >
                                    Register Authority
                                </Link>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ borderTop: '1px solid var(--border-color)', padding: 'clamp(32px, 5vh, 48px) clamp(20px, 5vw, 80px)' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src="/logo.png" alt="SAKSHAM" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                        <div>
                            <div style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, color: 'var(--color-slate-800)', fontSize: '15px' }}>SAKSHAM</div>
                            <div style={{ fontSize: '11px', color: 'var(--color-slate-400)' }}>Disability Certificate Portal — Government of India</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Verify Certificate', to: '/verify' },
                            { label: 'Sign In', to: '/login' },
                            { label: 'Register', to: '/register' },
                            { label: 'Authority Registration', to: '/register/authority' },
                        ].map(({ label, to }) => (
                            <Link key={to} to={to} style={{ fontSize: '13px', color: 'var(--color-slate-500)', textDecoration: 'none', fontWeight: 500 }}>
                                {label}
                            </Link>
                        ))}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', width: '100%', textAlign: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
                        © 2026 SAKSHAM — Ministry of Social Justice & Empowerment, Government of India · IT Act 2000 · RPwD Act 2016
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default LandingPage
