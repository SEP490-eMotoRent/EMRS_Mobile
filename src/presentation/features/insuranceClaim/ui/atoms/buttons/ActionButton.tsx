import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export interface ActionButtonProps {
    icon: string;
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    style?: ViewStyle;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
        icon,
        label,
        onPress,
        variant = 'primary',
        disabled = false,
        style,
    }) => {
        const getBackgroundColor = () => {
            if (disabled) return '#2A2A2A';
            switch (variant) {
            case 'primary':
                return '#00ff00'; // Green for emergency actions
            case 'secondary':
                return '#d4c5f9'; // Purple/lavender
            case 'danger':
                return '#ef4444'; // Red for emergency/danger
            default:
                return '#00ff00';
            }
        };

        const getTextColor = () => {
            if (disabled) return '#666';
            switch (variant) {
            case 'danger':
                return '#fff';
            default:
                return '#000';
            }
        };

        return (
            <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor: getBackgroundColor() },
                style,
            ]}
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            >
            <Icon name={icon} size={20} color={getTextColor()} />
            <Text style={[styles.label, { color: getTextColor() }]}>{label}</Text>
            </TouchableOpacity>
        );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 12,
        gap: 10,
    },
    label: {
        fontSize: 15,
        fontWeight: '700',
    },
});