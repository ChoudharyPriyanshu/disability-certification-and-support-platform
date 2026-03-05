import { useState, useEffect } from 'react'
import { schemeService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { BookOpen, Plus, Trash2, Edit3, X, Check } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const EMPTY = { name: '', ministry: '', description: '', benefits: '', disabilityTypes: [], minimumPercentage: 0, applicationUrl: '' }
const ALL_TYPES = ['Locomotor', 'Visual', 'Hearing', 'Speech & Language', 'Intellectual', 'Mental Illness', 'Multiple Disabilities', 'Other']

const AdminSchemes = () => {
    const [schemes, setSchemes] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [editId, setEditId] = useState(null)

    const fetch = () => {
        setLoading(true)
        schemeService.getAll()
            .then(res => setSchemes(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }
    useEffect(fetch, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
    const toggleType = (t) => setForm(f => ({
        ...f,
        disabilityTypes: f.disabilityTypes.includes(t) ? f.disabilityTypes.filter(x => x !== t) : [...f.disabilityTypes, t]
    }))

    const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
    const openEdit = (s) => {
        setForm({ name: s.name, ministry: s.ministry || '', description: s.description, benefits: s.benefits, disabilityTypes: s.disabilityTypes || [], minimumPercentage: s.minimumPercentage || 0, applicationUrl: s.applicationUrl || '' })
        setEditId(s._id); setShowForm(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            if (editId) {
                const res = await schemeService.update(editId, form)
                setSchemes(prev => prev.map(s => s._id === editId ? res.data.data : s))
                toast.success('Scheme updated')
            } else {
                const res = await schemeService.create(form)
                setSchemes(prev => [res.data.data, ...prev])
                toast.success('Scheme added')
            }
            setShowForm(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save scheme')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete scheme "${name}"?`)) return
        try {
            await schemeService.remove(id)
            setSchemes(prev => prev.filter(s => s._id !== id))
            toast.success('Scheme deleted')
        } catch (err) {
            toast.error('Could not delete scheme')
        }
    }

    return (
        <DashboardLayout pageTitle="Government Schemes" pageSubtitle={`${schemes.length} schemes configured`}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>
                    <Plus size={15} /> Add Scheme
                </button>
            </div>

            {/* Add/Edit form */}
            {showForm && (
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem' }}>{editId ? 'Edit Scheme' : 'Add Scheme'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)' }}><X size={18} /></button>
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label">Scheme Name *</label>
                                <input className="form-input" value={form.name} onChange={set('name')} required placeholder="e.g. ADIP Scheme" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Ministry</label>
                                <input className="form-input" value={form.ministry} onChange={set('ministry')} placeholder="Ministry of Social Justice" />
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label">Description *</label>
                            <textarea className="form-input form-textarea" rows={3} value={form.description} onChange={set('description')} required />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Benefits *</label>
                            <textarea className="form-input form-textarea" rows={2} value={form.benefits} onChange={set('benefits')} required placeholder="What the beneficiary receives..." />
                        </div>
                        <div className="form-field">
                            <label className="form-label">Eligible Disability Types</label>
                            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                {ALL_TYPES.map(t => (
                                    <button key={t} type="button" onClick={() => toggleType(t)} style={{
                                        padding: '4px 10px', borderRadius: '100px', cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                                        fontFamily: 'var(--font-sans)',
                                        border: `1.5px solid ${form.disabilityTypes.includes(t) ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                                        background: form.disabilityTypes.includes(t) ? 'var(--color-green-50)' : 'transparent',
                                        color: form.disabilityTypes.includes(t) ? 'var(--color-green-700)' : 'var(--color-slate-500)',
                                    }}>{t}</button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label">Min. Disability % (0 = no minimum)</label>
                                <input className="form-input" type="number" min={0} max={100} value={form.minimumPercentage} onChange={set('minimumPercentage')} />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Application URL</label>
                                <input className="form-input" type="url" value={form.applicationUrl} onChange={set('applicationUrl')} placeholder="https://..." />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                {saving ? <span className="spinner spinner-sm" /> : <><Check size={13} /> {editId ? 'Update' : 'Save'} Scheme</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
            ) : schemes.length === 0 ? (
                <div className="empty-state">
                    <BookOpen size={48} className="empty-state-icon" />
                    <h3>No schemes yet</h3>
                    <p style={{ fontSize: '14px' }}>Add government schemes to display to PwD users.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Scheme</th><th>Ministry</th><th>Eligible Types</th><th>Min. %</th><th style={{ width: '80px' }}></th></tr>
                        </thead>
                        <tbody>
                            {schemes.map((s, i) => (
                                <motion.tr key={s._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: '13.5px' }}>{s.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-slate-400)', marginTop: '2px' }}>{s.description?.slice(0, 80)}…</div>
                                    </td>
                                    <td style={{ fontSize: '13px' }}>{s.ministry || '—'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {(s.disabilityTypes || []).slice(0, 3).map(t => (
                                                <span key={t} className="badge badge-submitted" style={{ fontSize: '10px', textTransform: 'none', letterSpacing: 0 }}>{t}</span>
                                            ))}
                                            {(s.disabilityTypes || []).length > 3 && <span style={{ fontSize: '11px', color: 'var(--color-slate-400)' }}>+{s.disabilityTypes.length - 3}</span>}
                                        </div>
                                    </td>
                                    <td style={{ fontWeight: 600 }}>{s.minimumPercentage > 0 ? `${s.minimumPercentage}%` : 'None'}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => openEdit(s)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}><Edit3 size={13} /></button>
                                            <button onClick={() => handleDelete(s._id, s.name)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
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

export default AdminSchemes
