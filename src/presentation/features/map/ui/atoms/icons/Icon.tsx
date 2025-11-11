import React from 'react';

export type IconName =
    | 'bolt'
    | 'location'
    | 'clock'
    | 'phone'
    | 'email'
    | 'refresh'
    | 'map'
    | 'list'
    | 'warning'
    | 'error'
    | 'directions';

const iconMap: Record<IconName, string> = {
    bolt: '⚡',
    location: '📍',
    clock: '🕐',
    phone: '📞',
    email: '✉️',
    refresh: '🔄',
    map: '🗺️',
    list: '📋',
    warning: '⚠️',
    error: '❌',
    directions: '🧭',
};

interface IconProps {
    name: IconName;
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
};

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 'md' }) => {
    return (
        <span className={`${sizeStyles[size]} ${className}`}>
            {iconMap[name]}
        </span>
    );
};