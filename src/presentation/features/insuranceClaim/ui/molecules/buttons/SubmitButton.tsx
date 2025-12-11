import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from '../../atoms/icons/Icon';

export interface SubmitButtonProps {
    onPress: () => void;
    label?: string;
    disabled?: boolean;
    loading?: boolean;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({
    onPress,
    label = 'Gửi báo cáo',
    disabled = false,
    loading = false,
}) => {
    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            style={[styles.button, isDisabled && styles.disabled]}
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <>
                    <Icon name="send" size={20} color="#fff" />
                    <Text style={styles.text}>{label}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#22c55e',
        borderRadius: 12,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        shadowColor: '#22c55e',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    disabled: {
        backgroundColor: '#2A2A2A',
        shadowOpacity: 0,
    },
    text: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});