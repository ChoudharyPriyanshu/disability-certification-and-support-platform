import { useState, useEffect } from 'react'
import { certificateService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Award, Download, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const AdminCertificates = () => {
    const [certificates, setCertificates] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        certificateService.getAll()
            .then(res => setCertificates(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    return (
        <DashboardLayout pageTitle="Certificates" pageSubtitle={`${certificates.length} certificates issued`}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <div className="spinner" />
                </div>
            ) : certificates.length === 0 ? (
                <div className="empty-state">
                    <Award size={48} className="empty-state-icon" />
                    <h3>No certificates issued yet</h3>
                    <p style={{ fontSize: '14px' }}>Certificates are generated from approved applications.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Certificate No.</th>
                                <th>Holder</th>
                                <th>Disability Type</th>
                                <th>Percentage</th>
                                <th>Issued By</th>
                                <th>Issue Date</th>
                                <th>Blockchain</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {certificates.map((cert, i) => (
                                <motion.tr key={cert._id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                                    <td>
                                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--color-slate-700)' }}>
                                            {cert.certificateNumber}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: '13.5px' }}>
                                            {cert.applicant?.name || '—'}
                                        </div>
                                        <div style={{ fontSize: '11px', color: 'var(--color-slate-400)' }}>
                                            {cert.applicant?.email}
                                        </div>
                                    </td>
                                    <td>{cert.disabilityType}</td>
                                    <td>
                                        <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--color-green-700)' }}>
                                            {cert.disabilityPercentage}%
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--color-slate-600)' }}>
                                        {cert.issuedBy?.name ? `Dr. ${cert.issuedBy.name}` : '—'}
                                    </td>
                                    <td style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>
                                        {cert.issuedDate ? new Date(cert.issuedDate).toLocaleDateString('en-IN') : '—'}
                                    </td>
                                    <td>
                                        {cert.blockchainTxHash ? (
                                            <span className="badge badge-approved" style={{ fontSize: '10px' }}>On-chain</span>
                                        ) : (
                                            <span className="badge badge-submitted" style={{ fontSize: '10px' }}>DB only</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <a href={`/verify/${cert.certificateHash}`} target="_blank" rel="noreferrer"
                                                className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
                                                <Eye size={13} />
                                            </a>
                                            <a href={certificateService.getDownloadUrl(cert._id)} download
                                                className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}>
                                                <Download size={13} />
                                            </a>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </DashboardLayout>
    )
}

export default AdminCertificates
