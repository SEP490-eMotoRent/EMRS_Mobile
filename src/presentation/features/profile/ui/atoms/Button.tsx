import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';

interface ButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: ViewStyle | ViewStyle[];
    variant?: 'primary' | 'secondary' | 'ghost';
    disabled?: boolean; // ADD THIS
}

export const Button: React.FC<ButtonProps> = ({
    onPress,
    children,
    style,
    variant = 'primary',
    disabled = false
}) => {
    return (
        <TouchableOpacity
            style={[
                styles.button,
                styles[variant],
                style,
                disabled && styles.disabled // ADD disabled style
            ]}
            onPress={disabled ? undefined : onPress} // BLOCK onPress
            activeOpacity={0.7}
            disabled={disabled} // NATIVE disabled support
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
    disabled: {
        opacity: 0.5, // VISUAL feedback
    },
});