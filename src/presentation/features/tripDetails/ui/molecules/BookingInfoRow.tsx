import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BookingInfoRowProps {
    label: string;
    value: string | React.ReactNode;
    valueColor?: string;
}

export const BookingInfoRow: React.FC<BookingInfoRowProps> = ({ 
    label, 
    value,
    valueColor = '#fff' 
    }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        {typeof value === 'string' ? (
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        ) : (
            value
        )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        color: '#9E9E9E',
        fontSize: 14,
    },
    value: {
        fontSize: 14,
        fontWeight: '500',
    },
});