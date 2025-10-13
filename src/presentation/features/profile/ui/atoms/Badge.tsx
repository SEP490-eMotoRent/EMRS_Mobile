import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BadgeType } from '../temp';

interface BadgeProps {
    children: string;
    type?: BadgeType;
}

export const Badge: React.FC<BadgeProps> = ({ children, type = 'error' }) => {
    return (
        <View style={[styles.badge, type === 'error' && styles.badgeError]}>
        <Text style={styles.badgeText}>⚠ {children}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    badgeError: {
        backgroundColor: '#7f1d1d',
    },
    badgeText: {
        color: '#fca5a5',
        fontSize: 12,
        fontWeight: '600',
    },
});