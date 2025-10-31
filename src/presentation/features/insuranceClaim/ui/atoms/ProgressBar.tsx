import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface ProgressBarProps {
    progress: number; // 0-100
    label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label = 'Form Progress' }) => (
    <View style={styles.container}>
        <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.percentage}>{progress}%</Text>
        </View>
        <View style={styles.track}>
        <View style={[styles.fill, { width: `${progress}%` }]} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    percentage: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    track: {
        height: 4,
        backgroundColor: '#333',
        borderRadius: 2,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: '#4ADE80',
        borderRadius: 2,
    },
});