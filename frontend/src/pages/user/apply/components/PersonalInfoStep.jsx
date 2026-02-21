import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

const PersonalInfoStep = ({ userData }) => {
    const { register, formState: { errors } } = useFormContext();

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
            }}>
                Personal Information
            </h2>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                Please verify your personal details. Some fields are auto-filled from your profile.
            </p>

            {/* Full Name - Read Only */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Full Name
                </label>
                <input
                    type="text"
                    value={`${userData?.profile?.firstName || ''} ${userData?.profile?.lastName || ''}`}
                    readOnly
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-1)',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'not-allowed'
                    }}
                />
            </div>

            {/* Date of Birth */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Date of Birth
                </label>
                <input
                    type="date"
                    value={userData?.profile?.dateOfBirth || ''}
                    readOnly
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-1)',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'not-allowed'
                    }}
                />
            </div>

            {/* Gender */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="gender" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Gender <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <select
                    id="gender"
                    {...register('personalInfo.gender', { required: 'Gender is required' })}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: `2px solid ${errors.personalInfo?.gender ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-text-primary)',
                        cursor: 'pointer'
                    }}
                >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {errors.personalInfo?.gender && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        {errors.personalInfo.gender.message}
                    </p>
                )}
            </div>

            {/* Contact Number - Read Only */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Contact Number
                </label>
                <input
                    type="tel"
                    value={userData?.profile?.phone || ''}
                    readOnly
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-1)',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'not-allowed'
                    }}
                />
            </div>

            {/* Aadhaar Last 4 Digits - Display Only */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Aadhaar Number (Last 4 Digits)
                </label>
                <input
                    type="text"
                    value={`XXXX XXXX ${userData?.aadhaar?.lastFourDigits || 'XXXX'}`}
                    readOnly
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: '2px solid var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-1)',
                        color: 'var(--color-text-tertiary)',
                        cursor: 'not-allowed'
                    }}
                />
                {userData?.aadhaar?.verified && (
                    <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-success)',
                        marginTop: 'var(--spacing-xs)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                    }}>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M13.3 4.3L6 11.6 2.7 8.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                        Aadhaar Verified
                    </p>
                )}
            </div>

            {/* Address */}
            <div style={{ marginBottom: 'var(--spacing-lg)' }}>
                <label htmlFor="address" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Residential Address <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <textarea
                    id="address"
                    rows="4"
                    {...register('personalInfo.address', {
                        required: 'Address is required',
                        minLength: { value: 10, message: 'Address must be at least 10 characters' }
                    })}
                    placeholder="Enter your complete residential address"
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.9375rem',
                        border: `2px solid ${errors.personalInfo?.address ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        color: 'var(--color-text-primary)',
                        fontFamily: 'inherit',
                        resize: 'vertical'
                    }}
                />
                {errors.personalInfo?.address && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        {errors.personalInfo.address.message}
                    </p>
                )}
            </div>

            {/* Guardian Information (Optional) */}
            <div style={{
                marginTop: 'var(--spacing-2xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <h3 style={{
                    fontSize: '1.125rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-md)',
                    color: 'var(--color-text-primary)'
                }}>
                    Guardian Information (Optional)
                </h3>

                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                    <label htmlFor="guardianName" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--color-text-primary)'
                    }}>
                        Guardian Name
                    </label>
                    <input
                        id="guardianName"
                        type="text"
                        {...register('personalInfo.guardianName')}
                        placeholder="e.g., John Doe"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            fontSize: '0.9375rem',
                            border: '2px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-text-primary)'
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="guardianRelation" style={{
                        display: 'block',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        marginBottom: 'var(--spacing-sm)',
                        color: 'var(--color-text-primary)'
                    }}>
                        Relation to Guardian
                    </label>
                    <input
                        id="guardianRelation"
                        type="text"
                        {...register('personalInfo.guardianRelation')}
                        placeholder="e.g., Father, Mother, Spouse"
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-md)',
                            fontSize: '0.9375rem',
                            border: '2px solid var(--color-border-default)',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-surface-2)',
                            color: 'var(--color-text-primary)'
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

PersonalInfoStep.propTypes = {
    userData: PropTypes.object.isRequired
};

export default PersonalInfoStep;
