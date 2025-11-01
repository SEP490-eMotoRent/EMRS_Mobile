import React from 'react';
import { StyleSheet, Text } from 'react-native';

export interface LabelProps {
    children: string;
    secondary?: boolean;
}

export const Label: React.FC<LabelProps> = ({ children, secondary }) => {
    return (
        <Text style={[styles.label, secondary && styles.labelSecondary]}>
        {children}
        </Text>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 14,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    labelSecondary: {
        fontSize: 13,
        color: '#9CA3AF',
        fontWeight: '400',
    },
});