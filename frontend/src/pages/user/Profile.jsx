import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { authService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { User, Mail, Phone, MapPin, Calendar, Hash, Briefcase, Award, Building, Save, Edit2, X } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const Profile = () => {
    const { user: authUser, role, setUser: setAuthUser } = useAuth()
    const [profile, setProfile] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({})
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await authService.getProfile()
                setProfile(res.data.data)
                setFormData(res.data.data)
            } catch (error) {
                console.error('Error fetching profile:', error)
                toast.error('Failed to load profile details')
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await authService.updateProfile(formData)
            setProfile(res.data.data)
            // Update auth context if name changed
            if (res.data.data.name !== authUser.name) {
                setAuthUser({ ...authUser, name: res.data.data.name })
            }
            setIsEditing(false)
            toast.success('Profile updated successfully')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error(error.response?.data?.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <DashboardLayout pageTitle="Profile">
                <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
                    <div className="spinner" />
                </div>
            </DashboardLayout>
        )
    }

    const renderField = (label, value, Icon, name, type = "text") => (
        <div className="form-field" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Icon size={14} /> {label}
            </label>
            {isEditing ? (
                <input
                    type={type}
                    name={name}
                    className="form-input"
                    value={formData[name] || ''}
                    onChange={handleChange}
                    disabled={name === 'email'} // Email usually not editable
                />
            ) : (
                <div className="card-inset" style={{ fontSize: '0.9375rem', color: 'var(--color-slate-800)' }}>
                    {value || <span style={{ color: 'var(--color-slate-400)', fontStyle: 'italic' }}>Not provided</span>}
                </div>
            )}
        </div>
    )

    return (
        <DashboardLayout pageTitle="My Profile" pageSubtitle="View and manage your personal information">
            <div className="container-content" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="card"
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div style={{
                                width: '64px', height: '64px', borderRadius: '50%',
                                background: 'var(--color-green-700)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center',
                                color: 'white', fontSize: '24px', fontWeight: 700
                            }}>
                                {profile?.name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{profile?.name}</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-green-600)', fontWeight: 600 }}>
                                    {role === 'PWD_USER' ? 'Candidate' : role.charAt(0) + role.slice(1).toLowerCase()}
                                </p>
                            </div>
                        </div>
                        {!isEditing ? (
                            <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">
                                <Edit2 size={16} /> Edit Profile
                            </button>
                        ) : (
                            <button onClick={() => { setIsEditing(false); setFormData(profile); }} className="btn btn-ghost btn-sm">
                                <X size={16} /> Cancel
                            </button>
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                {renderField('Full Name', profile?.name, User, 'name')}
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                {renderField('Email Address', profile?.email, Mail, 'email', 'email')}
                            </div>

                            {role === 'PWD_USER' && (
                                <>
                                    {renderField('Phone Number', profile?.phone, Phone, 'phone', 'tel')}
                                    {renderField('Date of Birth', profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '', Calendar, 'dateOfBirth', 'date')}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        {renderField('Aadhaar Number (Last 4 digits)', profile?.aadhaar ? '•••• •••• ' + profile.aadhaar.slice(-4) : '', Hash, 'aadhaar')}
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div className="form-field" style={{ marginBottom: '16px' }}>
                                            <label className="form-label">Gender</label>
                                            {isEditing ? (
                                                <select name="gender" className="form-input form-select" value={formData.gender || ''} onChange={handleChange}>
                                                    <option value="">Select Gender</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            ) : (
                                                <div className="card-inset">{profile?.gender || 'Not specified'}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <div className="form-field" style={{ marginBottom: '16px' }}>
                                            <label className="form-label">Address</label>
                                            {isEditing ? (
                                                <textarea name="address" className="form-input form-textarea" value={formData.address || ''} onChange={handleChange} />
                                            ) : (
                                                <div className="card-inset">{profile?.address || 'Not specified'}</div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            {role === 'ADMIN' && (
                                <>
                                    {renderField('Institution', profile?.institution, Building, 'institution')}
                                    {renderField('Designation', profile?.designation, Briefcase, 'designation')}
                                </>
                            )}

                            {role === 'DOCTOR' && (
                                <>
                                    {renderField('Specialization', profile?.specialization, Award, 'specialization')}
                                    {renderField('Hospital', profile?.hospital, Building, 'hospital')}
                                    <div style={{ gridColumn: 'span 2' }}>
                                        {renderField('License Number', profile?.licenseNumber, Hash, 'licenseNumber')}
                                    </div>
                                </>
                            )}
                        </div>

                        {isEditing && (
                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                <button type="button" onClick={() => { setIsEditing(false); setFormData(profile); }} className="btn btn-secondary">
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? <><div className="spinner spinner-sm" style={{ marginRight: '8px' }} /> Saving...</> : <><Save size={18} /> Save Changes</>}
                                </button>
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </DashboardLayout>
    )
}

export default Profile
