import Navbar from '../../components/Navbar';

const ApplyForCertificate = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Apply for Disability Certificate</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Multi-step application form will be implemented here.
                </p>
            </div>
        </>
    );
};

export default ApplyForCertificate;
