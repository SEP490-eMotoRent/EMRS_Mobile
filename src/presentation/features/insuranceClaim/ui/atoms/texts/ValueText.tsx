import React from 'react';
import { Text, StyleSheet } from 'react-native';

export interface ValueTextProps {
    children: React.ReactNode;
}

export const ValueText: React.FC<ValueTextProps> = ({ children }) => (
    <Text style={styles.valueText}>{children}</Text>
);

const styles = StyleSheet.create({
    valueText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
});