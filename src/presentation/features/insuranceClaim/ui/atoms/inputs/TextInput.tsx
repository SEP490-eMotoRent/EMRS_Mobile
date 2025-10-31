import React from 'react';
import { TextInput as RNTextInput, StyleSheet, TextInputProps } from 'react-native';

export interface CustomTextInputProps extends TextInputProps {
    multiline?: boolean;
}

export const TextInput: React.FC<CustomTextInputProps> = ({ multiline, ...props }) => (
    <RNTextInput
        style={[styles.input, multiline && styles.multiline]}
        placeholderTextColor="#666"
        {...props}
    />
);

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        color: '#fff',
        borderWidth: 1,
        borderColor: '#333',
    },
    multiline: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
});