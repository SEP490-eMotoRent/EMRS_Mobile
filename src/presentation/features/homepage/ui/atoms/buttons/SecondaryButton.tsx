import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface SecondaryButtonProps {
    title: string;
    onPress?: () => void;
    style?: ViewStyle;
    disabled?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
    title, 
    onPress, 
    style,
    disabled = false 
}) => (
    <TouchableOpacity 
        style={[styles.button, style, disabled && styles.disabled]} 
        onPress={onPress} 
        activeOpacity={0.8}
        disabled={disabled}
    >
        <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#D8B4FE', // purple-300
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 14,
    },
    disabled: {
        backgroundColor: '#9CA3AF', // gray-400
        opacity: 0.6,
    },
    disabledText: {
        color: '#6B7280', // gray-500
    },
});