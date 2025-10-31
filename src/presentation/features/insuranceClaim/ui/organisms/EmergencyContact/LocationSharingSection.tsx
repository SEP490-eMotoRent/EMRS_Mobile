import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon, ToggleSwitch } from '../../atoms';
import { LocationStatus } from '../../molecules';

export interface LocationSharingSectionProps {
    isActive: boolean;
    onToggle: (value: boolean) => void;
    onSharePress: () => void;
}

export const LocationSharingSection: React.FC<LocationSharingSectionProps> = ({
    isActive,
    onToggle,
    onSharePress,
}) => (
    <View style={styles.section}>
        <TouchableOpacity style={styles.locationHeader} onPress={onSharePress}>
        <View style={styles.locationHeaderLeft}>
            <Icon name="location" size={20} />
            <Text style={styles.locationHeaderText}>Share GPS Location</Text>
        </View>
        <ToggleSwitch value={isActive} onValueChange={onToggle} />
        </TouchableOpacity>
        <LocationStatus isActive={isActive} />
    </View>
);

const styles = StyleSheet.create({
    section: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    locationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    locationHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    locationHeaderText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '500',
    },
});