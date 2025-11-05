import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Checkmark } from '../atoms';

export interface LocationStatusProps {
    isActive: boolean;
}

export const LocationStatus: React.FC<LocationStatusProps> = ({ isActive }) => (
    <View style={styles.locationStatus}>
        <Checkmark checked={isActive} />
        <Text style={[styles.locationStatusText, isActive && styles.locationStatusTextActive]}>
            Chia Sẻ Vị Trí {isActive ? 'active' : 'inactive'}
        </Text>
    </View>
);

const styles = StyleSheet.create({
    locationStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationStatusText: {
        fontSize: 14,
        color: '#999',
    },
    locationStatusTextActive: {
        color: '#4ADE80',
    },
});