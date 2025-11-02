import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';

export interface StatusIconProps {
    type: 'check' | 'clock' | 'dot';
    variant: 'success' | 'neutral' | 'pending';
}

export const StatusIcon: React.FC<StatusIconProps> = ({ type, variant }) => {
    const getIconStyle = (): ViewStyle => {
        const baseStyle: ViewStyle = {
        width: 24,
        height: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        };

        switch (variant) {
        case 'success':
            return { ...baseStyle, backgroundColor: '#10B981' };
        case 'pending':
            return { ...baseStyle, backgroundColor: '#C4B5FD' };
        case 'neutral':
            return { ...baseStyle, backgroundColor: '#6B7280' };
        }
    };

    return <View style={getIconStyle()} />;
};