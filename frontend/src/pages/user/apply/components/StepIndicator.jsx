import { useEffect } from 'react';
import PropTypes from 'prop-types';

const StepIndicator = ({ currentStep, totalSteps }) => {
    const steps = [
        { number: 1, label: 'Personal Information' },
        { number: 2, label: 'Disability Details' },
        { number: 3, label: 'Upload Documents' },
        { number: 4, label: 'Review & Submit' }
    ];

    return (
        <div style={{
            marginBottom: 'var(--spacing-2xl)',
            padding: 'var(--spacing-xl) 0'
        }}>
            {/* Progress Bar */}
            <div style={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-lg)'
            }}>
                {/* Background line */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '0',
                    right: '0',
                    height: '2px',
                    background: 'var(--color-border-default)',
                    zIndex: 0
                }} />

                {/* Progress line */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '0',
                    width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
                    height: '2px',
                    background: 'var(--color-accent-primary)',
                    zIndex: 1,
                    transition: 'width 0.3s ease'
                }} />

                {/* Step circles */}
                {steps.map((step) => (
                    <div
                        key={step.number}
                        style={{
                            position: 'relative',
                            zIndex: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            flex: 1
                        }}
                    >
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                background: step.number < currentStep
                                    ? 'var(--color-accent-primary)'
                                    : step.number === currentStep
                                        ? 'var(--color-accent-primary)'
                                        : 'var(--color-surface-2)',
                                color: step.number <= currentStep
                                    ? 'white'
                                    : 'var(--color-text-tertiary)',
                                border: step.number === currentStep
                                    ? '3px solid var(--color-accent-primary-muted)'
                                    : '2px solid var(--color-border-default)',
                                transition: 'all 0.3s ease'
                            }}
                            aria-current={step.number === currentStep ? 'step' : undefined}
                        >
                            {step.number < currentStep ? (
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                step.number
                            )}
                        </div>

                        <span style={{
                            marginTop: 'var(--spacing-sm)',
                            fontSize: '0.75rem',
                            fontWeight: step.number === currentStep ? 600 : 500,
                            color: step.number === currentStep
                                ? 'var(--color-text-primary)'
                                : 'var(--color-text-tertiary)',
                            textAlign: 'center',
                            maxWidth: '100px'
                        }}>
                            {step.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* Current Step Description */}
            <div style={{
                textAlign: 'center',
                marginTop: 'var(--spacing-lg)',
                padding: 'var(--spacing-md)',
                background: 'var(--color-surface-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-default)'
            }}>
                <p style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    margin: 0
                }}>
                    Step {currentStep} of {totalSteps}: <strong>{steps[currentStep - 1].label}</strong>
                </p>
            </div>
        </div>
    );
};

StepIndicator.propTypes = {
    currentStep: PropTypes.number.isRequired,
    totalSteps: PropTypes.number.isRequired
};

export default StepIndicator;
