import Navbar from '../../components/Navbar';

const WelfareSchemes = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Government Welfare Schemes</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Browse available welfare schemes with filtering by category
                </p>
            </div>
        </>
    );
};

export default WelfareSchemes;
