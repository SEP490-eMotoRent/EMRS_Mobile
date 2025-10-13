import React from 'react';
import { View, TextInput as RNTextInput, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';

interface TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
}

export const TextInput: React.FC<TextInputProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    keyboardType = 'default',
    }) => {
    return (
        <View style={styles.container}>
        <Text variant="label" style={styles.label}>{label}</Text>
        <RNTextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#666666"
            keyboardType={keyboardType}
        />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 16,
        color: '#FFFFFF',
        fontSize: 16,
    },
});
