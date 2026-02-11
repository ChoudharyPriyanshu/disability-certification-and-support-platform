import Navbar from '../../components/Navbar';

const MyCertificate = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>My Certificate</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Certificate display with QR code and blockchain verification status
                </p>
            </div>
        </>
    );
};

export default MyCertificate;
