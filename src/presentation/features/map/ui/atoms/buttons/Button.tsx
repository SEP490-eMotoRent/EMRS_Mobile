import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    isLoading?: boolean;
    icon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:bg-gray-50',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
};

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}) => {
    return (
        <button
            className={`
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
                inline-flex items-center justify-center gap-2
                rounded-lg font-medium transition-colors
                disabled:cursor-not-allowed disabled:opacity-50
            `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <span className="animate-spin">⚡</span>}
            {!isLoading && icon && <span>{icon}</span>}
            {children}
        </button>
    );
};