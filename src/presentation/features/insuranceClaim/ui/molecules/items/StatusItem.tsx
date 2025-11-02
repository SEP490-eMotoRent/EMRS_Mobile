import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusIconProps, StatusBadgeProps, StatusIcon, StatusBadge } from '../../atoms';


export interface StatusItemProps {
    title: string;
    subtitle?: string;
    timestamp?: string;
    icon: StatusIconProps;
    badge?: StatusBadgeProps;
    isCurrent?: boolean;
}

export const StatusItem: React.FC<StatusItemProps> = ({
    title,
    subtitle,
    timestamp,
    icon,
    badge,
    }) => {
    return (
        <View style={styles.statusItem}>
        <StatusIcon type={icon.type} variant={icon.variant} />
        <View style={styles.statusContent}>
            <View style={styles.statusHeader}>
            <Text style={styles.statusTitle}>{title}</Text>
            {badge && <StatusBadge {...badge} />}
            </View>
            {subtitle && <Text style={styles.statusSubtitle}>{subtitle}</Text>}
            {timestamp && <Text style={styles.timestamp}>{timestamp}</Text>}
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    statusItem: {
        flexDirection: 'row',
        gap: 12,
        paddingVertical: 8,
    },
    statusContent: {
        flex: 1,
        gap: 4,
    },
    statusHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    statusTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: '#FFFFFF',
    },
    statusSubtitle: {
        fontSize: 13,
        color: '#9CA3AF',
    },
    timestamp: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
});