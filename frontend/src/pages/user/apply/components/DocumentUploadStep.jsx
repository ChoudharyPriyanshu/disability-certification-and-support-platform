import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const DocumentUploadStep = () => {
    const { register, setValue, watch, formState: { errors } } = useFormContext();

    const [previews, setPreviews] = useState({
        medicalCertificate: null,
        photograph: null
    });

    const medicalCertFile = watch('documents.medicalCertificate');
    const photographFile = watch('documents.photograph');

    const validateFileSize = (file, maxSize) => {
        if (!file || !file[0]) return true;
        return file[0].size <= maxSize || `File size must be less than ${maxSize / (1024 * 1024)}MB`;
    };

    const validateFileType = (file, types) => {
        if (!file || !file[0]) return true;
        const fileType = file[0].type;
        return types.includes(fileType) || `Invalid file type. Allowed: ${types.join(', ')}`;
    };

    const handleFileChange = (e, fieldName, acceptedTypes) => {
        const file = e.target.files[0];
        if (file) {
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreviews(prev => ({ ...prev, [fieldName]: reader.result }));
                };
                reader.readAsDataURL(file);
            } else {
                setPreviews(prev => ({ ...prev, [fieldName]: file.name }));
            }
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                marginBottom: 'var(--spacing-xs)',
                color: 'var(--color-text-primary)'
            }}>
                Upload Documents
            </h2>
            <p style={{
                fontSize: '0.875rem',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-2xl)'
            }}>
                Please upload the required documents. Ensure files are clear and legible.
            </p>

            {/* Medical Certificate */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-1)',
                border: `2px solid ${errors.documents?.medicalCertificate ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                borderRadius: 'var(--radius-md)'
            }}>
                <label htmlFor="medicalCert" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Medical Certificate <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: 'var(--spacing-md)',
                    lineHeight: 1.6
                }}>
                    Upload medical certificate from a registered medical practitioner. Accepted formats: PDF. Max size: 5MB.
                </p>

                <input
                    id="medicalCert"
                    type="file"
                    accept=".pdf"
                    {...register('documents.medicalCertificate', {
                        required: 'Medical certificate is required',
                        validate: {
                            size: (files) => validateFileSize(files, 5 * 1024 * 1024),
                            type: (files) => validateFileType(files, ['application/pdf'])
                        }
                    })}
                    onChange={(e) => handleFileChange(e, 'medicalCertificate', ['application/pdf'])}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.875rem',
                        border: '2px dashed var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        cursor: 'pointer'
                    }}
                />

                {medicalCertFile && medicalCertFile[0] && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        padding: 'var(--spacing-md)',
                        background: 'var(--color-surface-2)',
                        borderRadius: 'var(--radius-sm)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-md)'
                    }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style={{ color: 'var(--color-error)' }}>
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3" />
                        </svg>
                        <div style={{ flex: 1 }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 500 }}>
                                {medicalCertFile[0].name}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                                {(medicalCertFile[0].size / 1024).toFixed(2)} KB
                            </p>
                        </div>
                    </div>
                )}

                {errors.documents?.medicalCertificate && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        {errors.documents.medicalCertificate.message}
                    </p>
                )}
            </div>

            {/* Photograph */}
            <div style={{
                marginBottom: 'var(--spacing-2xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-1)',
                border: `2px solid ${errors.documents?.photograph ? 'var(--color-error)' : 'var(--color-border-default)'}`,
                borderRadius: 'var(--radius-md)'
            }}>
                <label htmlFor="photograph" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Recent Photograph <span style={{ color: 'var(--color-error)' }}>*</span>
                </label>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: 'var(--spacing-md)',
                    lineHeight: 1.6
                }}>
                    Upload a recent passport-size photograph. Accepted formats: JPG, PNG. Max size: 1MB.
                </p>

                <input
                    id="photograph"
                    type="file"
                    accept="image/jpeg,image/png,image/jpg"
                    {...register('documents.photograph', {
                        required: 'Photograph is required',
                        validate: {
                            size: (files) => validateFileSize(files, 1 * 1024 * 1024),
                            type: (files) => validateFileType(files, ['image/jpeg', 'image/jpg', 'image/png'])
                        }
                    })}
                    onChange={(e) => handleFileChange(e, 'photograph', ['image/jpeg', 'image/jpg', 'image/png'])}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.875rem',
                        border: '2px dashed var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        cursor: 'pointer'
                    }}
                />

                {previews.photograph && (
                    <div style={{
                        marginTop: 'var(--spacing-md)',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={previews.photograph}
                            alt="Photograph preview"
                            style={{
                                maxWidth: '200px',
                                maxHeight: '200px',
                                borderRadius: 'var(--radius-md)',
                                border: '2px solid var(--color-border-default)'
                            }}
                        />
                    </div>
                )}

                {errors.documents?.photograph && (
                    <p style={{
                        color: 'var(--color-error)',
                        fontSize: '0.75rem',
                        marginTop: 'var(--spacing-sm)'
                    }}>
                        {errors.documents.photograph.message}
                    </p>
                )}
            </div>

            {/* Aadhaar Card (Optional) */}
            <div style={{
                padding: 'var(--spacing-lg)',
                background: 'var(--color-surface-1)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--radius-md)'
            }}>
                <label htmlFor="aadhaarDoc" style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-text-primary)'
                }}>
                    Aadhaar Card (Optional)
                </label>
                <p style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-tertiary)',
                    marginBottom: 'var(--spacing-md)',
                    lineHeight: 1.6
                }}>
                    Upload Aadhaar card if required. Accepted formats: PDF, JPG, PNG. Max size: 2MB.
                </p>

                <input
                    id="aadhaarDoc"
                    type="file"
                    accept=".pdf,image/jpeg,image/png,image/jpg"
                    {...register('documents.aadharCard', {
                        validate: {
                            size: (files) => !files || !files[0] || validateFileSize(files, 2 * 1024 * 1024),
                            type: (files) => !files || !files[0] || validateFileType(files, ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'])
                        }
                    })}
                    style={{
                        width: '100%',
                        padding: 'var(--spacing-md)',
                        fontSize: '0.875rem',
                        border: '2px dashed var(--color-border-default)',
                        borderRadius: 'var(--radius-md)',
                        background: 'var(--color-surface-2)',
                        cursor: 'pointer'
                    }}
                />
            </div>

            {/* Important Notes */}
            <div style={{
                marginTop: 'var(--spacing-2xl)',
                padding: 'var(--spacing-lg)',
                background: 'var(--color-info-muted)',
                border: '1px solid rgba(52, 152, 219, 0.2)',
                borderRadius: 'var(--radius-md)'
            }}>
                <h4 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    marginBottom: 'var(--spacing-sm)',
                    color: 'var(--color-info)'
                }}>
                    Important Guidelines
                </h4>
                <ul style={{
                    fontSize: '0.75rem',
                    color: 'var(--color-text-secondary)',
                    lineHeight: 1.8,
                    paddingLeft: 'var(--spacing-lg)',
                    margin: 0
                }}>
                    <li>Ensure all documents are clearly visible and legible</li>
                    <li>Medical certificate must be from a registered practitioner</li>
                    <li>Photograph should be recent (within last 6 months)</li>
                    <li>Do not upload password-protected files</li>
                    <li>File names should not contain special characters</li>
                </ul>
            </div>
        </div>
    );
};

export default DocumentUploadStep;
