import React from 'react';
import { Text as RNText, TextStyle, StyleSheet } from 'react-native';

interface TextProps {
    children: React.ReactNode;
    style?: TextStyle | TextStyle[];
    variant?: 'body' | 'label' | 'header' | 'title';
}

export const Text: React.FC<TextProps> = ({ children, style, variant = 'body' }) => {
    return <RNText style={[styles[variant], style]}>{children}</RNText>;
};

const styles = StyleSheet.create({
    body: {
        fontSize: 16,
        color: '#FFFFFF',
    },
    label: {
        fontSize: 14,
        color: '#AAAAAA',
    },
    header: {
        fontSize: 20,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
