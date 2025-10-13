import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface BadgeProps {
    children: React.ReactNode;
    style?: object;
}

export const Badge: React.FC<BadgeProps> = ({ children, style }) => (
    <View style={[styles.badge, style]}>
        <Text style={styles.text}>{children}</Text>
    </View>
);

const styles = StyleSheet.create({
    badge: {
        backgroundColor: '#1F2937', // gray-800
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'center'
    },
    text: {
        color: '#D1D5DB', // gray-300
        fontSize: 12,
        fontWeight: '600',
    },
});

