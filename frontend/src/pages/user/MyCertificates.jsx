import { useState, useEffect } from 'react'
import { certificateService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Award, Download, Eye, Shield } from 'lucide-react'
import { motion } from 'framer-motion'

const MyCertificates = () => {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        certificateService.getMyCertificates()
            .then((res) => setCertificates(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <DashboardLayout pageTitle="My Certificates" pageSubtitle="Your disability certificates">
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                    <div className="spinner" />
                </div>
            ) : certificates.length === 0 ? (
                <div className="empty-state">
                    <Award size={48} className="empty-state-icon" />
                    <h3>No certificates yet</h3>
                    <p style={{ fontSize: '14px' }}>Certificates will appear here once your application is approved.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '640px' }}>
                    {certificates.map((cert, i) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="certificate-container"
                        >
                            {/* Certificate header */}
                            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
                                    <Shield size={16} color="var(--color-green-700)" />
                                    <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-slate-400)' }}>
                                        Government of India
                                    </span>
                                </div>
                                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--color-slate-900)', marginBottom: '4px' }}>
                                    Disability Certificate
                                </h2>
                                <p style={{ fontSize: '12px', color: 'var(--color-slate-400)', fontStyle: 'italic' }}>
                                    Issued under the Rights of Persons with Disabilities Act, 2016
                                </p>
                            </div>

                            <hr className="rule-serif" style={{ margin: '0 0 20px' }} />

                            {/* Certificate details */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                                {[
                                    { label: 'Certificate No.', value: cert.certificateNumber },
                                    { label: 'Disability Type', value: cert.disabilityType },
                                    { label: 'Disability Percentage', value: `${cert.disabilityPercentage}%` },
                                    { label: 'Issued By', value: cert.issuedBy?.name },
                                    { label: 'Institution', value: cert.issuedBy?.institution },
                                    { label: 'Issue Date', value: cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                                    { label: 'Valid Until', value: cert.validUntil ? new Date(cert.validUntil).toLocaleDateString('en-IN') : 'Lifetime validity' },
                                ].map(({ label, value }) => (
                                    <div key={label} style={{ display: 'flex', gap: '12px' }}>
                                        <span style={{ width: '148px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', flexShrink: 0, paddingTop: '1px' }}>
                                            {label}
                                        </span>
                                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--color-slate-800)' }}>{value || '—'}</span>
                                    </div>
                                ))}
                            </div>

                            <hr className="rule-serif" style={{ margin: '0 0 14px' }} />

                            {/* Blockchain hash */}
                            <div style={{ marginBottom: '20px' }}>
                                <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--color-slate-400)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Shield size={10} />
                                    Verification Hash
                                </div>
                                <div className="certificate-hash">{cert.certificateHash}</div>
                                {cert.blockchainTxHash && (
                                    <div style={{ marginTop: '4px', fontSize: '10px', color: 'var(--color-green-600)', fontFamily: 'var(--font-mono)' }}>
                                        On-chain: {cert.blockchainTxHash.slice(0, 20)}…
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <a
                                    href={certificateService.getDownloadUrl(cert._id)}
                                    download
                                    className="btn btn-primary btn-sm"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <Download size={14} /> Download PDF
                                </a>
                                <a
                                    href={`/verify/${cert.certificateHash}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn btn-secondary btn-sm"
                                >
                                    <Eye size={14} /> Verify
                                </a>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}

export default MyCertificates
