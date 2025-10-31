import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface CheckmarkProps {
    checked?: boolean;
}

export const Checkmark: React.FC<CheckmarkProps> = ({ checked = true }) => (
    <View style={styles.checkmark}>
        {checked && <Text style={styles.checkmarkText}>✓</Text>}
    </View>
);

const styles = StyleSheet.create({
    checkmark: {
        width: 20,
        height: 20,
        borderRadius: 4,
        backgroundColor: '#4ADE80',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    checkmarkText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
