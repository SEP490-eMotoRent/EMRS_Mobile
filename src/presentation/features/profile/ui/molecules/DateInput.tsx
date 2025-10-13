import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icons/Icons';

interface DateInputProps {
    label: string;
    value: string;
    onPress: () => void;
}

export const DateInput: React.FC<DateInputProps> = ({ label, value, onPress }) => {
    return (
        <View style={styles.container}>
        <Text variant="label" style={styles.label}>{label}</Text>
        <TouchableOpacity style={styles.input} onPress={onPress}>
            <Text>{value}</Text>
            <Icon name="calendar" size={20} />
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 16,
    },
    label: {
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#1A1A1A',
        borderRadius: 8,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});