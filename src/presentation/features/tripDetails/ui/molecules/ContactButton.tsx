import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ContactButtonProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary';
}

export const ContactButton: React.FC<ContactButtonProps> = ({ 
    icon, 
    label, 
    value,
    onPress,
    variant = 'secondary'
}) => {
    return (
        <TouchableOpacity 
        style={[
            styles.container, 
            variant === 'primary' ? styles.primary : styles.secondary
        ]} 
        onPress={onPress}
        >
        <View style={styles.iconContainer}>{icon}</View>
        <View style={styles.textContainer}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[
            styles.value,
            variant === 'primary' && styles.primaryText
            ]}>
            {value}
            </Text>
        </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
        marginBottom: 12,
    },
    primary: {
        backgroundColor: '#1E1E1E',
    },
    secondary: {
        backgroundColor: 'transparent',
    },
    iconContainer: {
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    label: {
        color: '#9E9E9E',
        fontSize: 12,
        marginBottom: 4,
    },
    value: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    primaryText: {
        color: '#F44336',
    },
});