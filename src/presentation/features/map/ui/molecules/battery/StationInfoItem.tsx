import React from 'react';
import { Icon } from '../../atoms/icons/Icon';

interface StationInfoItemProps {
    icon: 'location' | 'clock' | 'phone' | 'email';
    children: React.ReactNode;
    isLink?: boolean;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
}

export const StationInfoItem: React.FC<StationInfoItemProps> = ({
    icon,
    children,
    isLink = false,
    href,
    onClick,
}) => {
    const content = (
        <>
            <Icon name={icon} size="sm" className="text-gray-400" />
            <span className={isLink ? 'text-blue-600 hover:underline' : ''}>{children}</span>
        </>
    );

    if (isLink && href) {
        return (
            <a
                href={href}
                className="flex items-center gap-2 text-sm text-gray-600"
                onClick={onClick}
            >
                {content}
            </a>
        );
    }

    return (
        <div className="flex items-start gap-2 text-sm text-gray-600">
            {content}
        </div>
    );
};