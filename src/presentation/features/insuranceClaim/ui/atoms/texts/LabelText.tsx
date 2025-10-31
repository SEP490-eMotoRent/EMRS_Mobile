import React from 'react';
import { Text, StyleSheet } from 'react-native';

export interface LabelTextProps {
    children: React.ReactNode;
    color?: string;
}

export const LabelText: React.FC<LabelTextProps> = ({ children, color = '#999' }) => (
    <Text style={[styles.labelText, { color }]}>{children}</Text>
);

const styles = StyleSheet.create({
    labelText: {
        fontSize: 14,
    },
});