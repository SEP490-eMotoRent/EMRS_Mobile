import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface ButtonProps {
    onPress: () => void;
    label: string;
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    label,
    variant = 'primary',
    }) => {
    return (
        <TouchableOpacity
        style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}
        onPress={onPress}
        >
        <Text
            style={[
            styles.buttonText,
            variant === 'secondary' && styles.buttonTextSecondary,
            ]}
        >
            {label}
        </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
        padding: 14,
        alignItems: 'center',
        marginTop: 4,
    },
    buttonSecondary: {
        backgroundColor: '#C4B5FD',
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    buttonTextSecondary: {
        color: '#1F2937',
    },
});