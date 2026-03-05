import { useState, useEffect } from 'react'
import { productService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { ShoppingBag, Plus, Trash2, Edit3, X, Check, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const CATEGORIES = ['Mobility Aids', 'Hearing Aids', 'Visual Aids', 'Daily Living Aids', 'Communication Devices', 'Orthotics & Prosthetics']
const EMPTY = { name: '', category: '', description: '', price: '', discountedPrice: '', stock: 10, isAvailable: true }

const AdminProducts = () => {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(EMPTY)
    const [saving, setSaving] = useState(false)
    const [editId, setEditId] = useState(null)

    const fetch = () => {
        setLoading(true)
        productService.getAll()
            .then(res => setProducts(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false))
    }
    useEffect(fetch, [])

    const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))
    const openAdd = () => { setForm(EMPTY); setEditId(null); setShowForm(true) }
    const openEdit = (p) => {
        setForm({ name: p.name, category: p.category, description: p.description, price: p.price, discountedPrice: p.discountedPrice || '', stock: p.stock, isAvailable: p.isAvailable })
        setEditId(p._id); setShowForm(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = { ...form, price: Number(form.price), discountedPrice: form.discountedPrice ? Number(form.discountedPrice) : undefined, stock: Number(form.stock) }
            if (editId) {
                const res = await productService.update(editId, payload)
                setProducts(prev => prev.map(p => p._id === editId ? res.data.data : p))
                toast.success('Product updated')
            } else {
                const res = await productService.create(payload)
                setProducts(prev => [res.data.data, ...prev])
                toast.success('Product added')
            }
            setShowForm(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save product')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"?`)) return
        try {
            await productService.remove(id)
            setProducts(prev => prev.filter(p => p._id !== id))
            toast.success('Product deleted')
        } catch {
            toast.error('Could not delete product')
        }
    }

    return (
        <DashboardLayout pageTitle="Assistive Products" pageSubtitle={`${products.length} products in catalogue`}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <button className="btn btn-primary btn-sm" onClick={openAdd}>
                    <Plus size={15} /> Add Product
                </button>
            </div>

            {showForm && (
                <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem' }}>{editId ? 'Edit Product' : 'Add Product'}</h3>
                        <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-slate-400)' }}><X size={18} /></button>
                    </div>
                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label">Product Name *</label>
                                <input className="form-input" value={form.name} onChange={set('name')} required placeholder="e.g. Folding Wheelchair" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Category *</label>
                                <select className="form-input form-select" value={form.category} onChange={set('category')} required>
                                    <option value="">Select category</option>
                                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="form-field">
                            <label className="form-label">Description *</label>
                            <textarea className="form-input form-textarea" rows={2} value={form.description} onChange={set('description')} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                            <div className="form-field">
                                <label className="form-label">Price (₹) *</label>
                                <input className="form-input" type="number" min={0} value={form.price} onChange={set('price')} required placeholder="e.g. 5000" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Discounted Price (₹)</label>
                                <input className="form-input" type="number" min={0} value={form.discountedPrice} onChange={set('discountedPrice')} placeholder="Optional" />
                            </div>
                            <div className="form-field">
                                <label className="form-label">Stock</label>
                                <input className="form-input" type="number" min={0} value={form.stock} onChange={set('stock')} />
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button type="button" className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
                                {saving ? <span className="spinner spinner-sm" /> : <><Check size={13} /> {editId ? 'Update' : 'Add'} Product</>}
                            </button>
                        </div>
                    </form>
                </motion.div>
            )}

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}><div className="spinner" /></div>
            ) : products.length === 0 ? (
                <div className="empty-state">
                    <Package size={48} className="empty-state-icon" />
                    <h3>No products yet</h3>
                    <p style={{ fontSize: '14px' }}>Add assistive products to the catalogue.</p>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th style={{ width: '80px' }}></th></tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <motion.tr key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: '13.5px' }}>{p.name}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>{p.description?.slice(0, 60)}…</div>
                                    </td>
                                    <td style={{ fontSize: '13px' }}>{p.category}</td>
                                    <td>
                                        <div style={{ fontWeight: 700, fontSize: '13.5px' }}>₹{p.discountedPrice?.toLocaleString('en-IN') || p.price?.toLocaleString('en-IN')}</div>
                                        {p.discountedPrice && <div style={{ fontSize: '11px', color: 'var(--color-slate-400)', textDecoration: 'line-through' }}>₹{p.price?.toLocaleString('en-IN')}</div>}
                                    </td>
                                    <td style={{ fontWeight: 600, color: p.stock === 0 ? 'var(--color-danger)' : 'var(--color-slate-700)' }}>{p.stock}</td>
                                    <td>
                                        <span className={`badge ${p.isAvailable && p.stock > 0 ? 'badge-approved' : 'badge-rejected'}`}>
                                            {p.isAvailable && p.stock > 0 ? 'Available' : 'Unavailable'}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <button onClick={() => openEdit(p)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px' }}><Edit3 size={13} /></button>
                                            <button onClick={() => handleDelete(p._id, p.name)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', color: 'var(--color-danger)' }}><Trash2 size={13} /></button>
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

export default AdminProducts
