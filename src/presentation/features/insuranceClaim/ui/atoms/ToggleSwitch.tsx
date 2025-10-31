
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';

export interface ToggleSwitchProps {
    value: boolean;
    onValueChange: (value: boolean) => void;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ value, onValueChange }) => (
    <TouchableOpacity
        style={[styles.toggle, value && styles.toggleActive]}
        onPress={() => onValueChange(!value)}
    >
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    toggle: {
        width: 51,
        height: 31,
        borderRadius: 16,
        backgroundColor: '#374151',
        padding: 2,
        justifyContent: 'center',
    },
    toggleActive: {
        backgroundColor: '#4ADE80',
    },
    toggleThumb: {
        width: 27,
        height: 27,
        borderRadius: 14,
        backgroundColor: '#fff',
    },
    toggleThumbActive: {
        alignSelf: 'flex-end',
    },
});