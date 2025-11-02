import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

export interface FeedbackInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
}

export const FeedbackInput: React.FC<FeedbackInputProps> = ({
        value,
        onChangeText,
        placeholder,
    }) => {
        return (
            <TextInput
            style={styles.feedbackInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            />
        );
};

const styles = StyleSheet.create({
    feedbackInput: {
        backgroundColor: '#111827',
        borderRadius: 8,
        padding: 12,
        color: '#FFFFFF',
        fontSize: 14,
        minHeight: 100,
        borderWidth: 1,
        borderColor: '#374151',
    },
});