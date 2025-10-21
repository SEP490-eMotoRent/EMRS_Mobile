import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BookingStatusBadgeProps {
    status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
        case 'confirmed':
            return { color: '#4CAF50', label: 'CONFIRMED' };
        case 'pending':
            return { color: '#FF9800', label: 'PENDING' };
        case 'cancelled':
            return { color: '#F44336', label: 'CANCELLED' };
        case 'completed':
            return { color: '#2196F3', label: 'COMPLETED' };
        default:
            return { color: '#9E9E9E', label: 'UNKNOWN' };
        }
    };

    const config = getStatusConfig();

    return (
        <View style={styles.container}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        <Text style={[styles.text, { color: config.color }]}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 6,
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});