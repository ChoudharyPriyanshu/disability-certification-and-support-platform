import Navbar from '../../components/Navbar';
import { useParams } from 'react-router-dom';

const CaseAssessment = () => {
    const { id } = useParams();

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <h1>Case Assessment</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: 'var(--spacing-md)' }}>
                    Submit medical assessment for case {id}
                </p>
            </div>
        </>
    );
};

export default CaseAssessment;
