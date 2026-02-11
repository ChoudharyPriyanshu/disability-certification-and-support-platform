import Navbar from '../../components/Navbar';

const AssistiveEquipment = () => {
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Assistive Equipment</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Browse assistive equipment marketplace with category filters
                </p>
            </div>
        </>
    );
};

export default AssistiveEquipment;
