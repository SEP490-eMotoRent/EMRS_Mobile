import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface StatusBadgeProps {
    label: string;
    variant?: 'current' | 'default';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
    label,
    variant = 'default',
    }) => {
    return (
        <View style={[styles.badge, variant === 'current' && styles.badgeCurrent]}>
        <Text style={styles.badgeText}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: '#374151',
    },
    badgeCurrent: {
        backgroundColor: '#8B5CF6',
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});
