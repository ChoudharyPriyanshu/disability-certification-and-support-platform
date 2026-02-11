import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';

const ApplicationReview = () => {
    const { id } = useParams();

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Application Review</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Review application {id}, assign doctor, approve/reject
                </p>
            </div>
        </>
    );
};

export default ApplicationReview;
