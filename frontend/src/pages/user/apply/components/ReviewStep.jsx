import { useState } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

const ReviewStep = ({ userData, onSubmit, isSubmitting }) => {
    const { watch } = useFormContext();
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [confirmationChecked, setConfirmationChecked] = useState(false);

    const formData = watch();

    const disabilityTypeMap = {
        'Visual Impairment': 'Visual Impairment',
        'Hearing Impairment': 'Hearing Impairment',
        'Locomotor Disability': 'Locomotor Disability',
        'Mental Illness': 'Mental Illness',
        'Intellectual Disability': 'Intellectual Disability',
        'Learning Disability': 'Learning Disability',
        'Autism Spectrum Disorder': 'Autism Spectrum Disorder',
        'Multiple Disabilities': 'Multiple Disabilities',
        'Other': 'Other'
    };

    const handleSubmitClick = () => {
        if (termsAccepted && confirmationChecked) {
            onSubmit();
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
            }}>
                Review & Submit
            </h2>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                Please review all information carefully before submitting your application.
            </p>

            {/* Personal Information Section */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-lg)',
                    color: 'var(--color-text-primary)',
                    paddingBottom: 'var(--spacing-md)',
                    borderBottom: '2px solid var(--color-border-default)'
                }}>
                    Personal Information
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                    <InfoItem label="Full Name" value={`${userData?.profile?.firstName} ${userData?.profile?.lastName}`} />
                    <InfoItem label="Date of Birth" value={userData?.profile?.dateOfBirth} />
                    <InfoItem label="Gender" value={formData.personalInfo?.gender} />
                    <InfoItem label="Contact Number" value={userData?.profile?.phone} />
                    <InfoItem label="Aadhaar (Last 4 digits)" value={`XXXX XXXX ${userData?.aadhaar?.lastFourDigits}`} />
                </div>

                <div style={{ marginTop: 'var(--spacing-lg)' }}>
                    <InfoItem
                        label="Residential Address"
                        value={formData.personalInfo?.address}
                        fullWidth
                    />
                </div>

                {formData.personalInfo?.guardianName && (
                    <div style={{
                        marginTop: 'var(--spacing-lg)',
                        paddingTop: 'var(--spacing-lg)',
                        borderTop: '1px solid var(--color-border-default)'
                    }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }}>
                            <InfoItem label="Guardian Name" value={formData.personalInfo?.guardianName} />
                            <InfoItem label="Relation to Guardian" value={formData.personalInfo?.guardianRelation} />
                        </div>
                    </div>
                )}
            </div>

            {/* Disability Information Section */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-lg)',
                    color: 'var(--color-text-primary)',
                    paddingBottom: 'var(--spacing-md)',
                    borderBottom: '2px solid var(--color-border-default)'
                }}>
                    Disability Details
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
                    <InfoItem label="Type of Disability" value={disabilityTypeMap[formData.disabilityInfo?.type]} />
                    <InfoItem label="Since When" value={formData.disabilityInfo?.since} />
                    <InfoItem label="Previous Certificate" value={formData.disabilityInfo?.hasPreviousCertificate === 'yes' ? 'Yes' : 'No'} />
                </div>

                <InfoItem
                    label="Detailed Description"
                    value={formData.disabilityInfo?.description}
                    fullWidth
                />
            </div>

            {/* Uploaded Documents Section */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-lg)',
                    color: 'var(--color-text-primary)',
                    paddingBottom: 'var(--spacing-md)',
                    borderBottom: '2px solid var(--color-border-default)'
                }}>
                    Uploaded Documents
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                    {formData.documents?.medicalCertificate && formData.documents.medicalCertificate[0] && (
                        <DocumentItem
                            name="Medical Certificate"
                            file={formData.documents.medicalCertificate[0]}
                        />
                    )}
                    {formData.documents?.photograph && formData.documents.photograph[0] && (
                        <DocumentItem
                            name="Photograph"
                            file={formData.documents.photograph[0]}
                        />
                    )}
                    {formData.documents?.aadharCard && formData.documents.aadharCard[0] && (
                        <DocumentItem
                            name="Aadhaar Card"
                            file={formData.documents.aadharCard[0]}
                        />
                    )}
                </div>
            </div>

            {/* Confirmation Checkboxes */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-xl)',
                background: 'var(--color-warning-muted)',
                border: '1px solid rgba(241, 196, 15, 0.3)',
                borderRadius: 'var(--radius-md)'
            }}>
                <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    cursor: 'pointer',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <input
                        type="checkbox"
                        checked={confirmationChecked}
                        onChange={(e) => setConfirmationChecked(e.target.checked)}
                        style={{
                            width: '20px',
                            height: '20px',
                            marginTop: '2px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    />
                    <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.6
                    }}>
                        I hereby confirm that all the information provided above is true and accurate to the best of my knowledge. I understand that providing false information may result in rejection of my application and legal consequences.
                    </span>
                </label>

                <label style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 'var(--spacing-md)',
                    cursor: 'pointer'
                }}>
                    <input
                        type="checkbox"
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                        style={{
                            width: '20px',
                            height: '20px',
                            marginTop: '2px',
                            cursor: 'pointer',
                            flexShrink: 0
                        }}
                    />
                    <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-text-primary)',
                        lineHeight: 1.6
                    }}>
                        I accept the terms and conditions for disability certificate application and agree to cooperate with medical assessment if required.
                    </span>
                </label>
            </div>

            {/* Submit Button */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 'var(--spacing-md)'
            }}>
                <button
                    type="button"
                    onClick={handleSubmitClick}
                    disabled={!termsAccepted || !confirmationChecked || isSubmitting}
                    style={{
                        padding: 'var(--spacing-md) var(--spacing-2xl)',
                        fontSize: '1rem',
                        fontWeight: 600,
                        background: (!termsAccepted || !confirmationChecked || isSubmitting)
                            ? 'var(--color-surface-2)'
                            : 'var(--color-accent-primary)',
                        color: (!termsAccepted || !confirmationChecked || isSubmitting)
                            ? 'var(--color-text-tertiary)'
                            : 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        cursor: (!termsAccepted || !confirmationChecked || isSubmitting)
                            ? 'not-allowed'
                            : 'pointer',
                        transition: 'all 0.2s ease',
                        minWidth: '200px'
                    }}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
            </div>

            {(!termsAccepted || !confirmationChecked) && (
                <p style={{
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    marginTop: 'var(--spacing-md)'
                }}>
                    Please accept both confirmations to submit your application
                </p>
            )}
        </div>
    );
};

// Helper Components
const InfoItem = ({ label, value, fullWidth = false }) => (
    <div style={{ gridColumn: fullWidth ? '1 / -1' : 'auto' }}>
        <label style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 500,
            color: 'var(--color-text-tertiary)',
            marginBottom: 'var(--spacing-xs)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
        }}>
            {label}
        </label>
        <p style={{
            fontSize: '0.9375rem',
            color: 'var(--color-text-primary)',
            margin: 0,
            lineHeight: fullWidth ? 1.6 : 1.4
        }}>
            {value || 'Not provided'}
        </p>
    </div>
);

const DocumentItem = ({ name, file }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--spacing-md)',
        padding: 'var(--spacing-md)',
        background: 'var(--color-surface-2)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--radius-sm)'
    }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-success)', flexShrink: 0 }}>
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div style={{ flex: 1 }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500, margin: 0 }}>
                {name}
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', margin: 0 }}>
                {file.name} • {(file.size / 1024).toFixed(2)} KB
            </p>
        </div>
    </div>
);

ReviewStep.propTypes = {
    userData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isSubmitting: PropTypes.bool
};

InfoItem.propTypes = {
    label: PropTypes.string.isRequired,
    value: PropTypes.string,
    fullWidth: PropTypes.bool
};

DocumentItem.propTypes = {
    name: PropTypes.string.isRequired,
    file: PropTypes.object.isRequired
};

export default ReviewStep;
