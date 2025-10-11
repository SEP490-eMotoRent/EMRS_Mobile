import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CheckIcon: React.FC = () => (
    <View style={styles.iconCircle}>
        <Text style={styles.iconText}>✓</Text>
    </View>
);

const styles = StyleSheet.create({
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#10b981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});