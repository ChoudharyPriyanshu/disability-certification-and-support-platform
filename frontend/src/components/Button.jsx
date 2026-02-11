const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    onClick,
    disabled = false,
    type = 'button',
    ...props
}) => {
    const variants = {
        primary: {
            background: 'var(--color-accent-primary)',
            color: 'white',
            border: 'none',
            hover: {
                background: 'var(--color-accent-primary-hover)'
            }
        },
        secondary: {
            background: 'var(--color-surface-2)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-default)',
            hover: {
                background: 'var(--color-surface-3)'
            }
        },
        outline: {
            background: 'transparent',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border-strong)',
            hover: {
                background: 'var(--color-surface-1)'
            }
        }
    };

    const sizes = {
        sm: {
            padding: 'var(--spacing-sm) var(--spacing-md)',
            fontSize: '0.875rem'
        },
        md: {
            padding: 'var(--spacing-sm) var(--spacing-lg)',
            fontSize: '0.9375rem'
        },
        lg: {
            padding: 'var(--spacing-md) var(--spacing-xl)',
            fontSize: '1rem'
        }
    };

    const baseStyles = {
        borderRadius: 'var(--radius-md)',
        fontWeight: 500,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all var(--transition-fast)',
        fontFamily: 'var(--font-sans)',
        ...variants[variant],
        ...sizes[size]
    };

    const handleMouseEnter = (e) => {
        if (!disabled && variants[variant].hover) {
            Object.assign(e.target.style, variants[variant].hover);
        }
    };

    const handleMouseLeave = (e) => {
        if (!disabled) {
            e.target.style.background = variants[variant].background;
        }
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            style={baseStyles}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
