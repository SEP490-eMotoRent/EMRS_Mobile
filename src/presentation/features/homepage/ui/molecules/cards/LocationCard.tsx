import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

interface LocationCardProps {
    image: string;
    state: string;
    city: string;
}

export const LocationCard: React.FC<LocationCardProps> = ({ 
    image,
    state,
    city
    }) => {
    return (
        <View style={styles.locationCard}>
        <Image source={{ uri: image }} style={styles.locationImage} />
        <View style={styles.locationInfo}>
            <Text style={styles.locationState}>{state}</Text>
            <Text style={styles.locationCity}>{city}</Text>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    locationCard: {
        width: 256,
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        borderRadius: 16,
        overflow: 'hidden',
        marginRight: 16,
    },
    locationImage: {
        width: '100%',
        height: 192,
    },
    locationInfo: {
        padding: 16,
    },
    locationState: {
        color: '#9ca3af',
        fontSize: 14,
        marginBottom: 4,
    },
    locationCity: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
    },
});
