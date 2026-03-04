import { useState } from 'react'
import { certificateService } from '../../services/apiServices'
import { Search, CheckCircle, XCircle, Shield, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const VerifyCertificate = () => {
    const [hash, setHash] = useState('')
    const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searched, setSearched] = useState(false)

    const handleVerify = async (e) => {
        e.preventDefault()
        if (!hash.trim()) return
        setLoading(true)
        setResult(null)
        setSearched(false)
        try {
            const { data } = await certificateService.verify(hash.trim())
            setResult(data)
            setSearched(true)
        } catch (err) {
            setResult({ verified: false, message: 'Verification failed. Please try again.' })
            setSearched(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--color-ivory)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 'clamp(40px, 8vh, 80px) 24px' }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--color-green-800)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Shield size={22} color="white" />
                    </div>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.125rem', fontWeight: 600, color: 'var(--color-slate-800)' }}>
                        Disability Certificate Platform
                    </span>
                </div>
                <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', marginBottom: '10px', color: 'var(--color-slate-900)' }}>
                    Verify Certificate
                </h1>
                <p style={{ color: 'var(--color-slate-500)', fontSize: '15px', maxWidth: '440px', lineHeight: 1.6 }}>
                    Enter a certificate hash or scan the QR code to verify the authenticity of a disability certificate.
                </p>
            </div>

            {/* Search form */}
            <div style={{ width: '100%', maxWidth: '520px' }}>
                <form onSubmit={handleVerify} style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Hash size={16} color="var(--color-slate-400)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                        <input
                            type="text"
                            className="form-input"
                            style={{ paddingLeft: '40px', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
                            placeholder="Enter certificate hash (SHA-256)"
                            value={hash}
                            onChange={(e) => setHash(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={loading} style={{ flexShrink: 0 }}>
                        {loading ? <span className="spinner spinner-sm" /> : <Search size={16} />}
                        Verify
                    </button>
                </form>

                {/* Result */}
                <AnimatePresence mode="wait">
                    {searched && result && (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="verification-result" style={{
                                borderColor: result.verified ? 'var(--color-green-200)' : '#fecaca',
                                background: result.verified ? 'var(--color-green-50)' : '#fef2f2',
                            }}>
                                <div className={`verification-icon ${result.verified ? 'success' : 'failure'}`}>
                                    {result.verified
                                        ? <CheckCircle size={36} strokeWidth={1.5} />
                                        : <XCircle size={36} strokeWidth={1.5} />
                                    }
                                </div>

                                <h2 style={{
                                    fontFamily: 'var(--font-serif)',
                                    fontSize: '1.375rem',
                                    marginBottom: '6px',
                                    color: result.verified ? 'var(--color-green-800)' : 'var(--color-danger)',
                                }}>
                                    {result.verified ? 'Certificate Verified' : 'Certificate Not Found'}
                                </h2>

                                <p style={{ fontSize: '14px', color: result.verified ? 'var(--color-green-700)' : 'var(--color-danger)', marginBottom: result.data ? '24px' : 0 }}>
                                    {result.message}
                                </p>

                                {result.data && (
                                    <div style={{ borderTop: `1px solid ${result.verified ? 'var(--color-green-200)' : '#fecaca'}`, paddingTop: '20px', textAlign: 'left' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {[
                                                { label: 'Certificate No.', value: result.data.certificateNumber },
                                                { label: 'Holder Name', value: result.data.holderName },
                                                { label: 'Disability Type', value: result.data.disabilityType },
                                                { label: 'Disability Percentage', value: `${result.data.disabilityPercentage}%` },
                                                { label: 'Issued By', value: result.data.issuedBy },
                                                { label: 'Institution', value: result.data.institution },
                                                { label: 'Issue Date', value: result.data.issuedDate ? new Date(result.data.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                                                { label: 'Valid Until', value: result.data.validUntil ? new Date(result.data.validUntil).toLocaleDateString('en-IN') : 'Lifetime' },
                                            ].map(({ label, value }) => (
                                                <div key={label} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                                    <span style={{ width: '130px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-green-600)', flexShrink: 0, paddingTop: '1px' }}>
                                                        {label}
                                                    </span>
                                                    <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--color-slate-800)' }}>{value || '—'}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {result.data.isOnChain && (
                                            <div className="alert alert-success" style={{ marginTop: '16px' }}>
                                                <CheckCircle size={14} style={{ flexShrink: 0 }} />
                                                <div>
                                                    <div style={{ fontWeight: 700, marginBottom: '2px' }}>Blockchain verified</div>
                                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', wordBreak: 'break-all' }}>
                                                        {result.data.blockchainTxHash}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <p style={{ textAlign: 'center', fontSize: '12px', color: 'var(--color-slate-400)', marginTop: '32px', lineHeight: 1.6 }}>
                    Certificate hashes are stored in our secure database and optionally on the Polygon blockchain.<br />
                    This service is provided under the Information Technology Act, 2000.
                </p>
            </div>
        </div>
    )
}

export default VerifyCertificate
