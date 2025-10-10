import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

interface SecondaryButtonProps {
    onPress?: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ onPress, children, style }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#D8B4FE', // purple-300
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 14,
    },
});
