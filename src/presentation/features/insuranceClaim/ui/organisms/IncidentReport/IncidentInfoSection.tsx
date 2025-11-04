import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';

interface InfoRowProps {
    label: string;
    value: string;
}

const InfoRow: React.FC<InfoRowProps> = ({ label, value }) => (
    <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
    </View>
);

export interface IncidentInfoSectionProps {
    dateTime: string;
    location: string;
    address: string;
    isLoadingLocation?: boolean;
    onRefreshLocation?: () => void;
}

export const IncidentInfoSection: React.FC<IncidentInfoSectionProps> = ({
    dateTime,
    location,
    address,
    isLoadingLocation = false,
    onRefreshLocation,
}) => (
    <View style={styles.section}>
        <View style={styles.header}>
            <Text style={styles.icon}>📍</Text>
            <Text style={styles.title}>Incident Time & Location</Text>
            {onRefreshLocation && (
                <TouchableOpacity 
                    onPress={onRefreshLocation} 
                    style={styles.refreshButton}
                    disabled={isLoadingLocation}
                >
                    {isLoadingLocation ? (
                        <ActivityIndicator size="small" color="#7C3AED" />
                    ) : (
                        <Text style={styles.refreshIcon}>🔄</Text>
                    )}
                </TouchableOpacity>
            )}
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
        flex: 1,
    },
    refreshButton: {
        padding: 4,
    },
    refreshIcon: {
        fontSize: 16,
    },
    content: {
        gap: 8,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 4,
    },
    label: {
        fontSize: 14,
        color: '#999',
    },
    value: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
});