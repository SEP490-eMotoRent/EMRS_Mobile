import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export interface DateTimeInputProps {
    value: string;
    onPress: () => void;
    icon: string;
    type: 'date' | 'time';
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({ value, onPress, icon, type }) => (
    <TouchableOpacity style={styles.container} onPress={onPress}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.editIcon}>📅</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 12,
        borderWidth: 1,
        borderColor: '#333',
        gap: 8,
    },
    icon: {
        fontSize: 18,
    },
    value: {
        flex: 1,
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
    },
    editIcon: {
        fontSize: 16,
    },
});