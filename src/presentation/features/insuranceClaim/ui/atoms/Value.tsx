import React from 'react';
import { StyleSheet, Text } from 'react-native';

export interface ValueProps {
    children: string;
    color?: string;
}

export const Value: React.FC<ValueProps> = ({ children, color }) => {
    return <Text style={[styles.value, color && { color }]}>{children}</Text>;
};

const styles = StyleSheet.create({
    value: {
        fontSize: 15,
        fontWeight: '500',
        color: '#FFFFFF',
    },
});
