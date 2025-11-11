import React from 'react';
import { Button } from '../../atoms/buttons/Button';

export interface RadiusOption {
    label: string;
    value: number;
}

// Predefined radius options from 100m to 10km
export const RADIUS_OPTIONS: RadiusOption[] = [
    { label: '100m', value: 100 },
    { label: '500m', value: 500 },
    { label: '1km', value: 1000 },
    { label: '2km', value: 2000 },
    { label: '5km', value: 5000 },
    { label: '10km', value: 10000 },
];

interface RadiusSelectorProps {
    selectedRadius: number;
    onRadiusChange: (radius: number) => void;
    disabled?: boolean;
    className?: string;
}

export const RadiusSelector: React.FC<RadiusSelectorProps> = ({
    selectedRadius,
    onRadiusChange,
    disabled = false,
    className = '',
}) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                Search Radius:
            </span>
            <div className="flex gap-2 overflow-x-auto">
                {RADIUS_OPTIONS.map(option => (
                    <Button
                        key={option.value}
                        size="sm"
                        variant={selectedRadius === option.value ? 'primary' : 'secondary'}
                        onClick={() => onRadiusChange(option.value)}
                        disabled={disabled}
                    >
                        {option.label}
                    </Button>
                ))}
            </div>
        </div>
    );
};