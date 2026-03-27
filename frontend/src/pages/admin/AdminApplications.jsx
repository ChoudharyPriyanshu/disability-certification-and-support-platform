import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { applicationService } from '../../services/apiServices'
import DashboardLayout from '../../layouts/DashboardLayout'
import { Search, ChevronRight, AlertCircle } from 'lucide-react'

const STATUS_OPTIONS = [
    { value: '', label: 'All' },
    { value: 'SUBMITTED', label: 'Submitted' },
    { value: 'UNDER_REVIEW', label: 'Under Review' },
    { value: 'DOCTOR_ASSIGNED', label: 'Doctor Assigned' },
    { value: 'ASSESSMENT_SCHEDULED', label: 'Assessment Scheduled' },
    { value: 'ASSESSMENT_COMPLETED', label: 'Evaluation Done' },
    { value: 'APPROVED', label: 'Approved' },
    { value: 'REJECTED', label: 'Rejected' },
]

const BADGE_MAP = {
    SUBMITTED: 'badge-submitted', UNDER_REVIEW: 'badge-review',
    DOCTOR_ASSIGNED: 'badge-assigned', ASSESSMENT_SCHEDULED: 'badge-scheduled',
    ASSESSMENT_COMPLETED: 'badge-completed', APPROVED: 'badge-approved', REJECTED: 'badge-rejected',
}

const AdminApplications = () => {
    const location = useLocation()
    const searchParams = new URLSearchParams(location.search)
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState(searchParams.get('status') || '')
    const [total, setTotal] = useState(0)

    useEffect(() => {
        setLoading(true)
        const params = {}
        if (status) params.status = status
        applicationService.getAll(params)
            .then((res) => { setApplications(res.data.data || []); setTotal(res.data.total || 0) })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [status])

    return (
        <DashboardLayout pageTitle="Applications" pageSubtitle={`${total} total applications`}>
            {/* Status filters */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
                {STATUS_OPTIONS.map(({ value, label }) => (
                    <button
                        key={value}
                        onClick={() => setStatus(value)}
                        style={{
                            padding: '5px 12px', borderRadius: '100px', cursor: 'pointer', fontFamily: 'var(--font-sans)',
                            border: `1.5px solid ${status === value ? 'var(--color-green-600)' : 'var(--border-color)'}`,
                            background: status === value ? 'var(--color-green-50)' : 'var(--surface-secondary)',
                            color: status === value ? 'var(--color-green-700)' : 'var(--color-slate-600)',
                            fontSize: '12px', fontWeight: 600,
                        }}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="card" style={{ padding: 0 }}>
                {loading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                        <div className="spinner" />
                    </div>
                ) : applications.length === 0 ? (
                    <div className="empty-state">
                        <Search size={32} className="empty-state-icon" />
                        <h3>No applications found</h3>
                    </div>
                ) : (
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Applicant</th>
                                <th>Disability Type</th>
                                <th>Assigned Doctor</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id}>
                                    <td>
                                        <div style={{ fontWeight: 600, color: 'var(--color-slate-800)', fontSize: '13.5px' }}>
                                            {app.applicant?.name || app.applicantName}
                                        </div>
                                        <div style={{ fontSize: '12px', color: 'var(--color-slate-400)' }}>{app.applicant?.email}</div>
                                    </td>
                                    <td>{app.disabilityType}</td>
                                    <td style={{ color: app.assignedDoctor ? 'var(--color-slate-700)' : 'var(--color-slate-300)', fontSize: '13px' }}>
                                        {app.assignedDoctor ? `Dr. ${app.assignedDoctor.name}` : '—'}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span className={`badge ${BADGE_MAP[app.status]}`}>
                                                {app.status?.replace(/_/g, ' ')}
                                            </span>
                                            {app.documents?.some(d => d.status === 'REJECTED') && (
                                                <div title="One or more documents rejected by doctor" style={{ color: 'var(--color-rose-500)', display: 'flex' }}>
                                                    <AlertCircle size={14} />
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--color-slate-400)', fontSize: '12px' }}>
                                        {new Date(app.createdAt).toLocaleDateString('en-IN')}
                                    </td>
                                    <td>
                                        <Link to={`/admin/applications/${app._id}`} className="btn btn-secondary btn-sm">
                                            Review <ChevronRight size={13} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </DashboardLayout>
    )
}

export default AdminApplications
