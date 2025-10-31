import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export interface LocationInputSectionProps {
    onPress: () => void;
}

export const LocationInputSection: React.FC<LocationInputSectionProps> = ({ onPress }) => (
    <View style={styles.section}>
        <Text style={styles.title}>Location</Text>
        <TouchableOpacity style={styles.input} onPress={onPress}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.placeholder}>Enter location or use GPS</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0A0A0A',
        borderRadius: 8,
        padding: 12,
        gap: 8,
    },
    icon: {
        fontSize: 18,
    },
    placeholder: {
        fontSize: 14,
        color: '#666',
    },
});