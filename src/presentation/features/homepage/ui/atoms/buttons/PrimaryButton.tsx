import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';

interface PrimaryButtonProps {
    onPress?: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({ onPress, children, style }) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#D8B4FE', // purple-300
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    text: {
        color: '#000000',
        fontWeight: '600',
        fontSize: 16,
    },
});
