import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CrossIcon: React.FC = () => (
    <View style={styles.iconCircle}>
        <Text style={styles.iconText}>✕</Text>
    </View>
);

const styles = StyleSheet.create({
    iconCircle: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#6b7280',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});