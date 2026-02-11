import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { applicationsAPI } from '../../utils/api';
import StatusBadge from '../../components/StatusBadge';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await applicationsAPI.getAll();
                setApplications(response.data.data.applications);
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>My Dashboard</h1>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 'var(--spacing-lg)',
                    marginBottom: 'var(--spacing-2xl)'
                }}>
                    <div className="card">
                        <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>Applications</h4>
                        <p style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-accent-primary)' }}>
                            {applications.length}
                        </p>
                    </div>
                </div>

                <div className="card">
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: 'var(--spacing-lg)'
                    }}>
                        <h3>My Applications</h3>
                        <Link to="/apply">
                            <button style={{
                                padding: 'var(--spacing-sm) var(--spacing-lg)',
                                background: 'var(--color-accent-primary)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 500,
                                cursor: 'pointer'
                            }}>
                                New Application
                            </button>
                        </Link>
                    </div>

                    {loading ? (
                        <p>Loading...</p>
                    ) : applications.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                            {applications.map(app => (
                                <Link key={app._id} to={`/application/${app._id}`} style={{ textDecoration: 'none' }}>
                                    <div style={{
                                        padding: 'var(--spacing-lg)',
                                        background: 'var(--color-surface-2)',
                                        border: '1px solid var(--color-border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <p style={{ fontWeight: 600, marginBottom: 'var(--spacing-xs)' }}>
                                                {app.applicationNumber}
                                            </p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <StatusBadge status={app.status} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            No applications found. Start by applying for a certificate.
                        </p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Dashboard;
