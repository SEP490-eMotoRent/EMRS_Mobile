import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface IconButtonProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
}

export const IconButton: React.FC<IconButtonProps> = ({ 
    icon, 
    label, 
    onPress,
    variant = 'secondary' 
    }) => {
    const getButtonStyle = () => {
        switch (variant) {
        case 'primary':
            return styles.primaryButton;
        case 'danger':
            return styles.dangerButton;
        default:
            return styles.secondaryButton;
        }
    };

    const getTextStyle = () => {
        switch (variant) {
        case 'danger':
            return styles.dangerText;
        default:
            return styles.buttonText;
        }
    };

    return (
        <TouchableOpacity style={[styles.button, getButtonStyle()]} onPress={onPress}>
        <View style={styles.iconContainer}>{icon}</View>
        <Text style={getTextStyle()}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 120,
    },
    primaryButton: {
        backgroundColor: '#BB86FC',
    },
    secondaryButton: {
        backgroundColor: '#2C2C2C',
    },
    dangerButton: {
        backgroundColor: 'transparent',
    },
    iconContainer: {
        marginRight: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    dangerText: {
        color: '#F44336',
        fontSize: 14,
        fontWeight: '500',
    },
});