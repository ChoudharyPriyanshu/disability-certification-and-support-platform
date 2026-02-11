import Navbar from '../../components/Navbar';

const DoctorDashboard = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Doctor Dashboard</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Assigned cases and assessment submissions
                </p>
            </div>
        </>
    );
};

export default DoctorDashboard;
