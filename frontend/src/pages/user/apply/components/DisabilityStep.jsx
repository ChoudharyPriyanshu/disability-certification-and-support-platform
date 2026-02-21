import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

const DisabilityStep = () => {
    const { register, formState: { errors }, watch } = useFormContext();

    const disabilityTypes = [
        'Visual Impairment',
        'Hearing Impairment',
        'Locomotor Disability',
        'Mental Illness',
        'Intellectual Disability',
        'Learning Disability',
        'Autism Spectrum Disorder',
        'Multiple Disabilities',
        'Other'
    ];

    const description = watch('disabilityInfo.description', '');

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
            }}>
                Disability Details
            </h2>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                Please provide accurate information about your disability. This will be verified by medical professionals.
            </p>

            {/* Disability Type */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="disabilityType" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Type of Disability <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                    id="disabilityType"
                    {...register('disabilityInfo.type', {
                        required: 'Please select disability type'
                    })}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: `2px solid ${errors.disabilityInfo?.type ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    <option value="">Select Disability Type</option>
                    {disabilityTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                    ))}
                </select>
                {errors.disabilityInfo?.type && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        {errors.disabilityInfo.type.message}
                    </p>
                )}
            </div>

            {/* Disability Description */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="description" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Detailed Description <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                    id="description"
                    rows="6"
                    {...register('disabilityInfo.description', {
                        required: 'Description is required',
                        minLength: { value: 20, message: 'Description must be at least 20 characters' },
                        maxLength: { value: 1000, message: 'Description cannot exceed 1000 characters' }
                    })}
                    placeholder="Please describe your disability in detail, including how it affects your daily life and activities..."
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: `2px solid ${errors.disabilityInfo?.description ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'inherit',
                        resize: 'vertical',
                        lineHeight: 1.6
                    }}
                />
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 'var(--spacing-xs)'
                }}>
                    {errors.disabilityInfo?.description ? (
                        <p style={{
                            color: 'var(--color-error)',
                            fontSize: '0.75rem'
                        }}>
                            {errors.disabilityInfo.description.message}
                        </p>
                    ) : (
                        <span />
                    )}
                    <span style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-text-tertiary)'
                    }}>
                        {description.length}/1000 characters
                    </span>
                </div>
            </div>

            {/* Since When */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="since" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Disability Since <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <input
                    id="since"
                    type="date"
                    {...register('disabilityInfo.since', {
                        required: 'Please provide the date since when you have this disability',
                        validate: {
                            notFuture: (value) => {
                                const selectedDate = new Date(value);
                                const today = new Date();
                                today.setHours(0, 0, 0, 0);
                                return selectedDate <= today || 'Date cannot be in the future';
                            }
                        }
                    })}
                    max={new Date().toISOString().split('T')[0]}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: `2px solid ${errors.disabilityInfo?.since ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-text-primary)'
                    }}
                />
                {errors.disabilityInfo?.since && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        {errors.disabilityInfo.since.message}
                    </p>
                )}
            </div>

            {/* Existing Certificate */}
            <div style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--color-text-primary)'
                }}>
                    Do you have an existing disability certificate? <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>

                <div style={{ display: 'flex', gap: 'var(--spacing-lg)' }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        cursor: 'pointer',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        flex: 1,
                        transition: 'all 0.2s ease'
                    }}>
                        <input
                            type="radio"
                            value="yes"
                            {...register('disabilityInfo.hasPreviousCertificate', {
                                required: 'Please select an option'
                            })}
                            style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                            Yes
                        </span>
                    </label>

                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-sm)',
                        cursor: 'pointer',
                        padding: 'var(--spacing-md)',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        flex: 1,
                        transition: 'all 0.2s ease'
                    }}>
                        <input
                            type="radio"
                            value="no"
                            {...register('disabilityInfo.hasPreviousCertificate', {
                                required: 'Please select an option'
                            })}
                            style={{
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        />
                        <span style={{ fontSize: '0.9375rem', color: 'var(--color-text-primary)' }}>
                            No
                        </span>
                    </label>
                </div>

                {errors.disabilityInfo?.hasPreviousCertificate && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        {errors.disabilityInfo.hasPreviousCertificate.message}
                    </p>
                )}

                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    marginTop: 'var(--spacing-md)',
                    lineHeight: 1.6
                }}>
                    If you have an existing certificate, please upload it in the next step along with other documents.
                </p>
            </div>
        </div>
    );
};

export default DisabilityStep;
