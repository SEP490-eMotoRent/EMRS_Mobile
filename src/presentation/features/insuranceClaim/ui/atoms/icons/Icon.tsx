import React from 'react';
import { Text } from 'react-native';

export interface IconProps {
    name: 'phone' | 'location' | 'document' | 'check';
    color?: string;
    size?: number;
}

export const Icon: React.FC<IconProps> = ({ name, color = '#fff', size = 24 }) => {
  // In a real app, use react-native-vector-icons or similar
    const icons = {
        phone: '📞',
        location: '📍',
        document: '📄',
        check: '✓',
    };
    
    return <Text style={{ fontSize: size }}>{icons[name]}</Text>;
};