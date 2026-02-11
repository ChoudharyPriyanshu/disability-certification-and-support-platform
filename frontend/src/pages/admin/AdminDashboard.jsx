import Navbar from '../../components/Navbar';

const AdminDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Admin Dashboard</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Application queue, doctor assignment, and certificate issuance
                </p>
            </div>
        </>
    );
};

export default AdminDashboard;
