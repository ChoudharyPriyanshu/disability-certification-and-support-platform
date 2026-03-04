import { useState, useEffect } from 'react'
import { schemeService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ExternalLink, BookOpen, Filter } from 'lucide-react'

const DISABILITY_TYPES = ['All', 'Locomotor', 'Visual', 'Hearing', 'Speech & Language', 'Intellectual', 'Mental Illness']

const SchemesHub = () => {
    const [schemes, setSchemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('All')
    const [percentage, setPercentage] = useState(40)

    useEffect(() => {
        const params = {}
        if (filter !== 'All') params.disabilityType = filter
        if (percentage) params.percentage = percentage

        schemeService.getAll(params)
            .then((res) => setSchemes(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [filter, percentage])

    return (
        <DashboardLayout pageTitle="Government Schemes" pageSubtitle="Browse schemes you may be eligible for">
            {/* Filters */}
            <div className="card" style={{ marginBottom: '24px', padding: '20px 24px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, minWidth: '200px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Disability Type</label>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {DISABILITY_TYPES.map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setFilter(t)}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '100px',
                                        border: `1.5px solid ${filter === t ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                        background: filter === t ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                                        color: filter === t ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                                        fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-sans)',
                                    }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ width: '200px' }}>
                        <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>
                            Min. disability %: <strong>{percentage}%</strong>
                        </label>
                        <input
                            type="range" min={0} max={100} step={10}
                            value={percentage}
                            onChange={(e) => setPercentage(e.target.value)}
                            style={{ width: '100%', accentColor: 'var(--color-green-600)' }}
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <div className="spinner" />
                </div>
            ) : schemes.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-state-icon" />
                    <h3>No schemes found</h3>
                    <p style={{ fontSize: '14px' }}>Try adjusting your filters.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                    {schemes.map((scheme) => (
                        <div key={scheme._id} className="scheme-card">
                            <div className="scheme-ministry" style={{ marginBottom: '8px' }}>
                                {scheme.ministry || 'Government of India'}
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.0625rem', fontWeight: 600, color: 'var(--color-slate-900)', lineHeight: 1.35, marginBottom: '10px' }}>
                                {scheme.name}
                            </h3>
                            <p style={{ fontSize: '13.5px', color: 'var(--color-slate-600)', lineHeight: 1.6, marginBottom: '14px' }}>
                                {scheme.description.slice(0, 160)}{scheme.description.length > 160 ? '…' : ''}
                            </p>

                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
                                {(scheme.disabilityTypes || []).slice(0, 3).map((t) => (
                                    <span key={t} className="badge badge-success" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                                        {t}
                                    </span>
                                ))}
                                {scheme.minimumPercentage > 0 && (
                                    <span className="badge badge-submitted" style={{ textTransform: 'none', letterSpacing: 0, fontSize: '11px' }}>
                                        {scheme.minimumPercentage}%+ disability
                                    </span>
                                )}
                            </div>

                            <div className="card-inset" style={{ marginBottom: '14px', padding: '10px 14px' }}>
                                <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-slate-400)', marginBottom: '4px' }}>
                                    Benefits
                                </div>
                                <p style={{ fontSize: '13px', color: 'var(--color-slate-700)', margin: 0 }}>
                                    {scheme.benefits.slice(0, 120)}{scheme.benefits.length > 120 ? '…' : ''}
                                </p>
                            </div>

                            {scheme.applicationUrl && (
                                <a href={scheme.applicationUrl} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                                    Apply Online <ExternalLink size={13} />
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    )
}

export default SchemesHub
