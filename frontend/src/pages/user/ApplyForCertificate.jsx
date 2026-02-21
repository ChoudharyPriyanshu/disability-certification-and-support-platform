import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Button from '../../components/Button';
import StepIndicator from './apply/components/StepIndicator';
import PersonalInfoStep from './apply/components/PersonalInfoStep';
import DisabilityStep from './apply/components/DisabilityStep';
import DocumentUploadStep from './apply/components/DocumentUploadStep';
import ReviewStep from './apply/components/ReviewStep';
import api from '../../utils/api';

const ApplyForCertificate = () => {
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [applicationNumber, setApplicationNumber] = useState('');

    const methods = useForm({
        mode: 'onChange',
        defaultValues: {
            personalInfo: {
                gender: '',
                address: '',
                guardianName: '',
                guardianRelation: ''
            },
            disabilityInfo: {
                type: '',
                description: '',
                since: '',
                hasPreviousCertificate: ''
            },
            documents: {
                medicalCertificate: null,
                photograph: null,
                aadharCard: null
            }
        }
    });

    const { handleSubmit, trigger } = methods;
    const totalSteps = 4;

    // Route Protection: Check authentication
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { state: { from: '/apply' } });
        }
    }, [user, authLoading, navigate]);

    // Route Protection: Check Aadhaar verification
    useEffect(() => {
        if (user && !user.aadhaar?.verified) {
            navigate('/verify-aadhaar', {
                state: {
                    message: 'Please verify your Aadhaar to apply for disability certificate',
                    from: '/apply'
                }
            });
        }
    }, [user, navigate]);

    // Check for existing pending application
    useEffect(() => {
        const checkExistingApplication = async () => {
            try {
                const response = await api.get('/applications');
                const applications = response.data.data.applications;

                const pendingApplication = applications.find(app =>
                    ['SUBMITTED', 'VERIFIED', 'DOCTOR_ASSIGNED', 'ASSESSED'].includes(app.status)
                );

                if (pendingApplication) {
                    navigate('/dashboard', {
                        state: {
                            message: `You already have a pending application (${pendingApplication.applicationNumber}). Please wait for it to be processed.`
                        }
                    });
                }
            } catch (error) {
                console.error('Error checking existing applications:', error);
            }
        };

        if (user && user.aadhaar?.verified) {
            checkExistingApplication();
        }
    }, [user, navigate]);

    // Handle step navigation
    const handleNext = async () => {
        let fieldsToValidate = [];

        switch (currentStep) {
            case 1:
                fieldsToValidate = ['personalInfo.gender', 'personalInfo.address'];
                break;
            case 2:
                fieldsToValidate = [
                    'disabilityInfo.type',
                    'disabilityInfo.description',
                    'disabilityInfo.since',
                    'disabilityInfo.hasPreviousCertificate'
                ];
                break;
            case 3:
                fieldsToValidate = [
                    'documents.medicalCertificate',
                    'documents.photograph'
                ];
                break;
            default:
                break;
        }

        const isValid = await trigger(fieldsToValidate);

        if (isValid) {
            // Save to sessionStorage for draft persistence
            sessionStorage.setItem('applicationDraft', JSON.stringify(methods.getValues()));
            setCurrentStep(currentStep + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        setCurrentStep(currentStep - 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle form submission
    const onSubmit = async () => {
        setIsSubmitting(true);
        setSubmitError('');

        try {
            const formData = methods.getValues();

            // Prepare application data
            const applicationData = {
                personalInfo: {
                    aadharNumber: user.aadhaar.lastFourDigits, // Last 4 digits only
                    guardianName: formData.personalInfo.guardianName || undefined,
                    guardianRelation: formData.personalInfo.guardianRelation || undefined
                },
                disabilityInfo: {
                    type: formData.disabilityInfo.type,
                    description: formData.disabilityInfo.description,
                    since: formData.disabilityInfo.since
                }
            };

            // Submit application (creates record)
            const appResponse = await api.post('/applications', applicationData);
            const applicationId = appResponse.data.data.application._id;
            const appNumber = appResponse.data.data.application.applicationNumber;

            // Upload documents
            const docFormData = new FormData();
            if (formData.documents.medicalCertificate && formData.documents.medicalCertificate[0]) {
                docFormData.append('medicalCertificate', formData.documents.medicalCertificate[0]);
            }
            if (formData.documents.photograph && formData.documents.photograph[0]) {
                docFormData.append('photograph', formData.documents.photograph[0]);
            }
            if (formData.documents.aadharCard && formData.documents.aadharCard[0]) {
                docFormData.append('aadharCard', formData.documents.aadharCard[0]);
            }

            await api.patch(`/applications/${applicationId}/documents`, docFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Clear draft from sessionStorage
            sessionStorage.removeItem('applicationDraft');

            // Show success
            setApplicationNumber(appNumber);
            setSubmitSuccess(true);

            // Redirect to dashboard after 5 seconds
            setTimeout(() => {
                navigate('/dashboard', {
                    state: {
                        message: `Application ${appNumber} submitted successfully!`
                    }
                });
            }, 5000);

        } catch (error) {
            console.error('Application submission error:', error);
            setSubmitError(
                error.response?.data?.error ||
                'Failed to submit application. Please try again.'
            );
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (authLoading) {
        return (
            <>
                <Navbar />
                <div className="container" style={{
                    minHeight: '60vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <p>Loading...</p>
                </div>
            </>
        );
    }

    // Not authenticated or Aadhaar not verified (handled by useEffect redirects)
    if (!user || !user.aadhaar?.verified) {
        return null;
    }

    // Success state
    if (submitSuccess) {
        return (
            <>
                <Navbar />
                <div className="container" style={{
                    padding: 'var(--spacing-2xl) 0',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <div style={{
                        textAlign: 'center',
                        padding: 'var(--spacing-2xl)',
                        background: 'var(--color-success-muted)',
                        border: '2px solid var(--color-success)',
                        borderRadius: 'var(--radius-lg)'
                    }}>
                        <svg
                            width="64"
                            height="64"
                            viewBox="0 0 24 24"
                            fill="none"
                            style={{
                                color: 'var(--color-success)',
                                margin: '0 auto var(--spacing-lg)'
                            }}
                        >
                            <path
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <h1 style={{
                            fontSize: '1.75rem',
                            fontWeight: 600,
                            color: 'var(--color-success)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            Application Submitted Successfully!
                        </h1>

                        <p style={{
                            fontSize: '1.125rem',
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--spacing-xs)'
                        }}>
                            Your Application Number:
                        </p>

                        <p style={{
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            color: 'var(--color-success)',
                            marginBottom: 'var(--spacing-xl)',
                            fontFamily: 'var(--font-mono)'
                        }}>
                            {applicationNumber}
                        </p>

                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)',
                            lineHeight: 1.6,
                            marginBottom: 'var(--spacing-lg)'
                        }}>
                            Your application has been submitted and is under review.
                            You can track the status from your dashboard.
                        </p>

                        <p style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-text-tertiary)'
                        }}>
                            Redirecting to dashboard in 5 seconds...
                        </p>
                    </div>
                </div>
            </>
        );
    }

    // Main form
    return (
        <>
            <Navbar />
            <div className="container" style={{ padding: 'var(--spacing-2xl) 0' }}>
                <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                    {/* Header */}
                    <div style={{ marginBottom: 'var(--spacing-2xl)', textAlign: 'center' }}>
                        <h1 style={{
                            fontSize: '2rem',
                            fontWeight: 700,
                            marginBottom: 'var(--spacing-xs)',
                            color: 'var(--color-text-primary)'
                        }}>
                            Apply for Disability Certificate
                        </h1>
                        <p style={{
                            fontSize: '0.875rem',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Complete the form below to apply for your official disability certificate
                        </p>
                    </div>

                    {/* Error Display */}
                    {submitError && (
                        <div style={{
                            padding: 'var(--spacing-lg)',
                            marginBottom: 'var(--spacing-2xl)',
                            background: 'var(--color-error-muted)',
                            border: '2px solid var(--color-error)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-error)'
                        }}>
                            <strong>Error:</strong> {submitError}
                        </div>
                    )}

                    {/* Step Indicator */}
                    <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

                    {/* Form */}
                    <FormProvider {...methods}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* Step Content */}
                            <div style={{
                                padding: 'var(--spacing-2xl)',
                                background: 'var(--color-surface-1)',
                                border: '1px solid var(--color-border-default)',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: 'var(--spacing-xl)'
                            }}>
                                {currentStep === 1 && <PersonalInfoStep userData={user} />}
                                {currentStep === 2 && <DisabilityStep />}
                                {currentStep === 3 && <DocumentUploadStep />}
                                {currentStep === 4 && (
                                    <ReviewStep
                                        userData={user}
                                        onSubmit={handleSubmit(onSubmit)}
                                        isSubmitting={isSubmitting}
                                    />
                                )}
                            </div>

                            {/* Navigation Buttons */}
                            {currentStep < 4 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 'var(--spacing-md)'
                                }}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="lg"
                                        onClick={handleBack}
                                        disabled={currentStep === 1}
                                        style={{ minWidth: '150px' }}
                                    >
                                        Back
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="lg"
                                        onClick={handleNext}
                                        style={{ minWidth: '150px' }}
                                    >
                                        Next
                                    </Button>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="lg"
                                        onClick={handleBack}
                                        style={{ minWidth: '150px' }}
                                    >
                                        Back
                                    </Button>
                                </div>
                            )}
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    );
};

export default ApplyForCertificate;
