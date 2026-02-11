const statusColors = {
    SUBMITTED: 'info',
    VERIFIED: 'info',
    DOCTOR_ASSIGNED: 'info',
    ASSESSED: 'warning',
    APPROVED: 'success',
    REJECTED: 'error',
    CERTIFICATE_ISSUED: 'success'
};

const StatusBadge = ({ status }) => {
    const colorType = statusColors[status] || 'info';

    const badgeStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        padding: 'var(--spacing-xs) var(--spacing-md)',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.875rem',
        fontWeight: 500,
        lineHeight: 1
    };

    const typeStyles = {
        success: {
            background: 'var(--color-success-muted)',
            color: 'var(--color-success)',
            border: '1px solid rgba(72, 187, 120, 0.2)'
        },
        warning: {
            background: 'var(--color-warning-muted)',
            color: 'var(--color-warning)',
            border: '1px solid rgba(237, 137, 54, 0.2)'
        },
        error: {
            background: 'var(--color-error-muted)',
            color: 'var(--color-error)',
            border: '1px solid rgba(245, 101, 101, 0.2)'
        },
        info: {
            background: 'var(--color-info-muted)',
            color: 'var(--color-info)',
            border: '1px solid rgba(66, 153, 225, 0.2)'
        }
    };

    const formatStatus = (status) => {
        return status.replace(/_/g, ' ');
    };

    return (
        <span style={{ ...badgeStyles, ...typeStyles[colorType] }}>
            {formatStatus(status)}
        </span>
    );
};

export default StatusBadge;
