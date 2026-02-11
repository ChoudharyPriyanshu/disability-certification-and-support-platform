import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';

const ApplicationStatus = () => {
    const { id } = useParams();

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Application Status</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Timeline view and application details for ID: {id}
                </p>
            </div>
        </>
    );
};

export default ApplicationStatus;
