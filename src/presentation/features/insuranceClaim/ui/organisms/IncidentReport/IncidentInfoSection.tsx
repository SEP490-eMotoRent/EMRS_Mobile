import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoRow } from '../../molecules';

export interface IncidentInfoSectionProps {
    dateTime: string;
    location: string;
    address: string;
}

export const IncidentInfoSection: React.FC<IncidentInfoSectionProps> = ({
    dateTime,
    location,
    address,
    }) => (
    <View style={styles.section}>
        <View style={styles.header}>
        <Text style={styles.icon}>📍</Text>
        <Text style={styles.title}>Incident Time & Location</Text>
        </View>
        <View style={styles.content}>
        <InfoRow label="Date & Time" value={dateTime} />
        <InfoRow label="Location" value={location} />
        <InfoRow label="Address" value={address} />
        </View>
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    icon: {
        fontSize: 18,
        marginRight: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    content: {
        gap: 4,
    },
});
