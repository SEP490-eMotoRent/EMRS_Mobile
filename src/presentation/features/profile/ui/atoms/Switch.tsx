import React from 'react';
import { Switch as RNSwitch } from 'react-native';

interface SwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export const Switch: React.FC<SwitchProps> = ({ value, onValueChange }) => {
    return (
        <RNSwitch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3A3A3A', true: '#7C3AED' }}
        thumbColor={value ? '#FFFFFF' : '#CCCCCC'}
        />
    );
};