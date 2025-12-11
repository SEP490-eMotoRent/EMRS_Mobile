import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Icon } from '../../atoms/icons/Icon';

interface IncidentInfoSectionProps {
    dateTime: string;
    location: string;
    address: string;
    isLoadingLocation: boolean;
    onRefreshLocation: () => void;
}

export const IncidentInfoSection: React.FC<IncidentInfoSectionProps> = ({
    dateTime,
    location,
    address,
    isLoadingLocation,
    onRefreshLocation,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Icon name="location" size={20} color="#ef4444" />
                    <Text style={styles.title}>Thời gian & Địa điểm sự cố</Text>
                </View>
                <TouchableOpacity 
                    style={[styles.refreshButton, isLoadingLocation && styles.refreshButtonDisabled]}
                    onPress={onRefreshLocation}
                    disabled={isLoadingLocation}
                    activeOpacity={0.7}
                >
                    {isLoadingLocation ? (
                        <ActivityIndicator size="small" color="#d4c5f9" />
                    ) : (
                        <>
                            <Icon name="refresh" size={14} color="#d4c5f9" />
                            <Text style={styles.refreshText}>Làm mới</Text>
                        </>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                    <Icon name="time" size={16} color="#666" />
                    <Text style={styles.label}>Ngày & Giờ</Text>
                </View>
                <Text style={styles.value}>{dateTime}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                    <Icon name="location" size={16} color="#666" />
                    <Text style={styles.label}>Vị trí</Text>
                </View>
                <Text style={styles.value} numberOfLines={2}>{location}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                    <Icon name="map" size={16} color="#666" />
                    <Text style={styles.label}>Tọa độ GPS</Text>
                </View>
                <Text style={styles.valueSmall}>{address}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    refreshButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
        minWidth: 80,
        justifyContent: 'center',
    },
    refreshButtonDisabled: {
        opacity: 0.6,
    },
    refreshText: {
        color: '#d4c5f9',
        fontSize: 13,
        fontWeight: '600',
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingVertical: 8,
        gap: 12,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        flex: 1,
    },
    label: {
        fontSize: 14,
        color: '#666',
    },
    value: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '500',
        flex: 1.5,
        textAlign: 'right',
    },
    valueSmall: {
        fontSize: 12,
        color: '#999',
        fontWeight: '500',
        flex: 1.5,
        textAlign: 'right',
        fontFamily: 'monospace',
    },
    divider: {
        height: 1,
        backgroundColor: '#2A2A2A',
        marginVertical: 4,
    },
});