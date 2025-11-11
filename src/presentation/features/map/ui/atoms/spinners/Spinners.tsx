import React from 'react';

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizeStyles = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
};

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
    return (
        <div className={`inline-block animate-spin ${sizeStyles[size]} ${className}`}>
            ⚡
        </div>
    );
};