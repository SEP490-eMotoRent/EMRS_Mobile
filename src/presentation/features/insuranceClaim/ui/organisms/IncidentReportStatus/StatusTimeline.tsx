import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusItem, StatusItemProps } from '../../molecules/items/StatusItem';

export interface StatusTimelineProps {
    statuses: StatusItemProps[];
}

export const StatusTimeline: React.FC<StatusTimelineProps> = ({ statuses }) => {
    return (
        <View style={styles.card}>
        <Text style={styles.cardTitle}>Current Status</Text>
        {statuses.map((status, index) => (
            <StatusItem key={index} {...status} />
        ))}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
});
