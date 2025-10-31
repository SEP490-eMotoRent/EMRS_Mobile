import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Icon, IconProps } from '../../atoms';

export interface ButtonProps {
    icon?: IconProps['name'];
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
    icon,
    label,
    onPress,
    variant = 'primary',
}) => (
    <TouchableOpacity
        style={[
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
        ]}
        onPress={onPress}
    >
        {icon && <Icon name={icon} color={variant === 'primary' ? '#000' : '#fff'} />}
        <Text
        style={[
            styles.buttonText,
            variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextSecondary,
        ]}
        >
        {label}
        </Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        gap: 8,
    },
    buttonPrimary: {
        backgroundColor: '#FF6B6B',
    },
    buttonSecondary: {
        backgroundColor: '#C4B5FD',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextPrimary: {
        color: '#000',
    },
    buttonTextSecondary: {
        color: '#000',
    },
});