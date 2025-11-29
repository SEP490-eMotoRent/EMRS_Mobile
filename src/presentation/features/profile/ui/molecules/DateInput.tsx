import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../atoms/Text';
import { Icon } from '../atoms/Icons/Icons';

interface DateInputProps {
    label: string;
    value: string;
    onPress?: () => void;
    editable?: boolean;
}

export const DateInput: React.FC<DateInputProps> = ({ 
    label, 
    value, 
    onPress,
    editable = true 
}) => {
    const handlePress = () => {
        if (editable && onPress) {
            onPress();
        }
    };

    return (
        <View style={styles.container}>
            <Text variant="label" style={styles.label}>{label}</Text>
            <TouchableOpacity 
                style={[
                    styles.input,
                    !editable && styles.disabledInput
                ]} 
                onPress={handlePress}
                disabled={!editable}
                activeOpacity={editable ? 0.7 : 1}
            >
                <Text style={!editable && styles.disabledText}>
                    {value || 'Chọn ngày'}
                </Text>
                <Icon name="calendar" size={20} color={!editable ? '#666666' : '#FFFFFF'} />
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
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    disabledInput: {
        opacity: 0.6,
        backgroundColor: '#0F0F0F',
    },
    disabledText: {
        color: '#888888',
    },
});