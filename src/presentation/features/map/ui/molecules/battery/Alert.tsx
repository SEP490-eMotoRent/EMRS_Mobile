import React from 'react';
import { Icon, IconName } from '../../atoms/icons/Icon';

type AlertVariant = 'info' | 'warning' | 'error' | 'success';

interface AlertProps {
    variant: AlertVariant;
    title?: string;
    message: string;
    className?: string;
}

const variantConfig: Record<AlertVariant, { bgColor: string; borderColor: string; textColor: string; icon: IconName }> = {
    info: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800',
        icon: 'location',
    },
    warning: {
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800',
        icon: 'warning',
    },
    error: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800',
        icon: 'error',
    },
    success: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800',
        icon: 'bolt',
    },
};

export const Alert: React.FC<AlertProps> = ({ variant, title, message, className = '' }) => {
    const config = variantConfig[variant];

    return (
        <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-3 flex items-start gap-2 ${className}`}>
            <Icon name={config.icon} className={config.textColor} />
            <div className="flex-1">
                {title && (
                    <p className={`text-sm font-medium ${config.textColor}`}>
                        {title}
                    </p>
                )}
                <p className={`text-sm ${config.textColor} ${title ? 'mt-1' : ''}`}>
                    {message}
                </p>
            </div>
        </div>
    );
};