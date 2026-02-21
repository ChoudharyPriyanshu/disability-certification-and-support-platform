import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';

const Home = () => {

    
    const features = [
        {
            title: "Secure & Trustworthy",
            description:
                "Certificate hashes stored on blockchain for immutable verification"
        },
        {
            title: "Accessible Design",
            description:
                "WCAG AA compliant with keyboard navigation and screen reader support"
        },
        {
            title: "Comprehensive Support",
            description:
                "Access welfare schemes and assistive equipment marketplace"
        }
    ];

    return (
        <>
            <Navbar />
            <main>
                {/* Hero Section */}
                <section
                    style={{
                        padding: 'var(--spacing-3xl) 0',
                        background:
                            'linear-gradient(to bottom, var(--color-base-dark), var(--color-surface-1))'
                    }}
                >
                    <div
                        className="container"
                        style={{
                            maxWidth: '900px',
                            textAlign: 'center'
                        }}
                    >
                        <h1
                            style={{
                                fontSize: '3rem',
                                marginBottom: 'var(--spacing-lg)',
                                lineHeight: 1.1
                            }}
                        >
                            Blockchain-Enabled <br />Disability Certificate Platform
                        </h1>

                        <p
                            style={{
                                fontSize: '1.125rem',
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--spacing-2xl)',
                                lineHeight: 1.7
                            }}
                        >
                            A secure, accessible, and trustworthy system for disability certification
                            with blockchain-verified credentials
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                gap: 'var(--spacing-md)',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}
                        >
                            <Link to="/register">
                                <Button size="lg" variant="primary">
                                    Apply for Certificate
                                </Button>
                            </Link>

                            <Link to="/verify">
                                <Button size="lg" variant="outline">
                                    Verify Certificate
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section
                    style={{
                        padding: 'var(--spacing-3xl) 0'
                    }}
                >
                    <div className="container">
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns:
                                    'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: 'var(--spacing-xl)'
                            }}
                        >
                            {features.map((feature, index) => (
                                <div className="card" key={index}>
                                    <h3
                                        style={{
                                            marginBottom: 'var(--spacing-md)'
                                        }}
                                    >
                                        {feature.title}
                                    </h3>

                                    <p
                                        style={{
                                            color: 'var(--color-text-secondary)',
                                            lineHeight: 1.7
                                        }}
                                    >
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
};

export default Home;