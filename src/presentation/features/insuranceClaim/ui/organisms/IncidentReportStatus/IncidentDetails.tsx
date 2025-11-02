import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Label } from '../../atoms';
import { DetailRow } from '../../molecules';

export interface IncidentDetailsProps {
    incidentId: string;
    dateTime: string;
    vehicle: string;
    description: string;
}

export const IncidentDetails: React.FC<IncidentDetailsProps> = ({
        incidentId,
        dateTime,
        vehicle,
        description,
    }) => {
        return (
            <View style={styles.card}>
            <Text style={styles.cardTitle}>Incident Details</Text>
            <DetailRow label="Incident ID" value={incidentId} />
            <DetailRow label="Date/Time" value={dateTime} />
            <DetailRow label="Vehicle" value={vehicle} />
            <View style={styles.detailRow}>
                <Label secondary>Description</Label>
            </View>
            <Text style={styles.description}>{description}</Text>
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
    detailRow: {
        gap: 4,
        marginTop: 8,
    },
    description: {
        fontSize: 14,
        color: '#D1D5DB',
        lineHeight: 20,
        marginTop: 4,
    },
});