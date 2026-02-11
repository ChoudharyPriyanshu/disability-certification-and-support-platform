import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { certificatesAPI } from '../utils/api';

const VerifyCertificate = () => {
    const [certificateNumber, setCertificateNumber] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResult(null);

        try {
            const response = await certificatesAPI.verify({ certificateNumber });
            setResult(response.data.data);
        } catch (error) {
            setResult({ verified: false, error: 'Verification failed' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-3xl) 0' }}>
                <div style={{ maxWidth: '700px', margin: '0 auto' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Verify Certificate
                    </h1>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-2xl)',
                        lineHeight: 1.7
                    }}>
                        Enter the certificate number to verify its authenticity on the blockchain
                    </p>

                    <div className="card">
                        <form onSubmit={handleVerify}>
                            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                                <label style={{
                                    display: 'block',
                                    marginBottom: 'var(--spacing-sm)',
                                    fontSize: '0.875rem',
                                    fontWeight: 500,
                                    color: 'var(--color-text-secondary)'
                                }}>
                                    Certificate Number
                                </label>
                                <input
                                    type="text"
                                    value={certificateNumber}
                                    onChange={(e) => setCertificateNumber(e.target.value)}
                                    placeholder="UDID-2024-0000000001"
                                    required
                                    style={{
                                        width: '100%',
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-surface-2)',
                                        border: '1px solid var(--color-border-default)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-text-primary)',
                                        fontSize: '0.9375rem',
                                        fontFamily: 'var(--font-mono)'
                                    }}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-md)',
                                    background: 'var(--color-accent-primary)',
                                    border: 'none',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'white',
                                    fontSize: '0.9375rem',
                                    fontWeight: 500,
                                    cursor: 'pointer'
                                }}
                            >
                                {loading ? 'Verifying...' : 'Verify on Blockchain'}
                            </button>
                        </form>

                        {result && (
                            <div style={{ marginTop: 'var(--spacing-xl)' }}>
                                <div className="divider" />
                                {result.verified ? (
                                    <div>
                                        <div style={{
                                            padding: 'var(--spacing-md)',
                                            background: 'var(--color-success-muted)',
                                            border: '1px solid rgba(72, 187, 120, 0.2)',
                                            borderRadius: 'var(--radius-md)',
                                            marginBottom: 'var(--spacing-lg)'
                                        }}>
                                            <p style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                                                ✓ Certificate Verified on Blockchain
                                            </p>
                                        </div>
                                        {result.certificate && (
                                            <div>
                                                <h3 style={{ marginBottom: 'var(--spacing-md)', fontSize: '1.25rem' }}>
                                                    Certificate Details
                                                </h3>
                                                <div style={{ display: 'grid', gap: 'var(--spacing-md)' }}>
                                                    <div>
                                                        <p style={{
                                                            fontSize: '0.875rem',
                                                            color: 'var(--color-text-tertiary)',
                                                            marginBottom: 'var(--spacing-xs)'
                                                        }}>
                                                            Holder Name
                                                        </p>
                                                        <p style={{ fontWeight: 500 }}>{result.certificate.holderName}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{
                                                            fontSize: '0.875rem',
                                                            color: 'var(--color-text-tertiary)',
                                                            marginBottom: 'var(--spacing-xs)'
                                                        }}>
                                                            Disability Type
                                                        </p>
                                                        <p>{result.certificate.disabilityType}</p>
                                                    </div>
                                                    <div>
                                                        <p style={{
                                                            fontSize: '0.875rem',
                                                            color: 'var(--color-text-tertiary)',
                                                            marginBottom: 'var(--spacing-xs)'
                                                        }}>
                                                            Blockchain Timestamp
                                                        </p>
                                                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem' }}>
                                                            {new Date(result.certificate.blockchain.timestamp).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div style={{
                                        padding: 'var(--spacing-md)',
                                        background: 'var(--color-error-muted)',
                                        border: '1px solid rgba(245, 101, 101, 0.2)',
                                        borderRadius: 'var(--radius-md)',
                                        color: 'var(--color-error)'
                                    }}>
                                        ✗ Certificate not found or invalid
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default VerifyCertificate;
