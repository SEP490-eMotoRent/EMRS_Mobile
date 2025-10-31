import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface SubmitButtonProps {
    onPress: () => void;
    label?: string;
    disabled?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onPress,
    label = 'Submit Report',
    disabled = false
    }) => (
    <TouchableOpacity
        style={[styles.button, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled}
    >
        <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4ADE80',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    disabled: {
        backgroundColor: '#333',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
});
