import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    variant?: 'primary' | 'secondary' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    children,
    style,
    variant = 'primary'
    }) => {
    return (
        <TouchableOpacity
        style={[styles.button, styles[variant], style]}
        onPress={onPress}
        activeOpacity={0.7}
        >
        {children}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: '#E8D5FF',
    },
    secondary: {
        backgroundColor: '#2A2A2A',
    },
    ghost: {
        backgroundColor: 'transparent',
    },
});