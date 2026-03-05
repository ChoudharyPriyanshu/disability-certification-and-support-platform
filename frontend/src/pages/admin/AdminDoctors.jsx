import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Stethoscope, Plus, Trash2, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchDoctors = () => {
        setLoading(true)
        api.get('/auth/doctors')
            .then(res => setDoctors(res.data.data || []))
            .catch(() => {
                // Fallback: try alternate route
                api.get('/auth/doctor/list')
                    .then(res => setDoctors(res.data.data || []))
                    .catch(console.error)
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchDoctors() }, [])

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Remove Dr. ${name} from the platform?`)) return
        try {
            await api.delete(`/auth/doctors/${id}`)
            setDoctors(prev => prev.filter(d => d._id !== id))
            toast.success(`Dr. ${name} removed`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not remove doctor')
        }
    }

    return (
        <DashboardLayout pageTitle="Doctors" pageSubtitle={`${doctors.length} registered doctors`}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                <Link to="/admin/doctors/register" className="btn btn-primary btn-sm">
                    <Plus size={15} /> Register Doctor
                </Link>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                    <div className="spinner" />
                </div>
            ) : doctors.length === 0 ? (
                <div className="empty-state">
                    <Stethoscope size={48} className="empty-state-icon" />
                    <h3>No doctors registered yet</h3>
                    <p style={{ fontSize: '14px', marginBottom: '16px' }}>Register doctors to assign them to PwD assessment cases.</p>
                    <Link to="/admin/doctors/register" className="btn btn-primary btn-sm">
                        Register First Doctor
                    </Link>
                </div>
            ) : (
                <div className="card" style={{ padding: 0 }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Doctor</th>
                                <th>Specialization</th>
                                <th>Hospital</th>
                                <th>Cases Assigned</th>
                                <th>Joined</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doc, i) => (
                                <motion.tr key={doc._id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div style={{
                                                width: '32px', height: '32px', borderRadius: '50%',
                                                background: 'var(--color-green-50)', border: '1px solid var(--color-green-200)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                            }}>
                                                <Stethoscope size={14} color="var(--color-green-700)" />
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: '13.5px' }}>
                                                    Dr. {doc.name}
                                                </div>
                                                <div style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>{doc.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: '13px' }}>{doc.specialization}</td>
                                    <td style={{ fontSize: '13px', color: 'var(--color-slate-600)' }}>{doc.hospital}</td>
                                    <td>
                                        <span className="badge badge-assigned">
                                            {doc.assignedCases?.length || 0} cases
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>
                                        {new Date(doc.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleDelete(doc._id, doc.name)}
                                            className="btn btn-ghost btn-sm"
                                            style={{ color: 'var(--color-danger)', padding: '4px 8px' }}
                                        >
                                            <Trash2 size={14} />
                                        </button>
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

export default AdminDoctors
