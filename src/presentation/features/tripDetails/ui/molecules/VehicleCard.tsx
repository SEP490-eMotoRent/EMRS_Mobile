import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface VehicleCardProps {
    name: string;
    rentalPeriod: string;
    duration: string;
    imageUrl?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
    name, 
    rentalPeriod, 
    duration,
    imageUrl 
}) => {
    return (
        <View style={styles.container}>
        <View style={styles.imageContainer}>
            {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
            ) : (
            <View style={styles.placeholder} />
            )}
        </View>
        <View style={styles.infoContainer}>
            <Text style={styles.name}>{name}</Text>
            <View style={styles.detailRow}>
            <Text style={styles.label}>Rental Period</Text>
            <Text style={styles.value}>{rentalPeriod}</Text>
            </View>
            <View style={styles.detailRow}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration}</Text>
            </View>
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E2A3A',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
    },
    imageContainer: {
        width: '100%',
        height: 120,
        backgroundColor: '#2C3E50',
        borderRadius: 8,
        marginBottom: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    placeholder: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        gap: 8,
    },
    name: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: '#9E9E9E',
        fontSize: 13,
    },
    value: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '500',
    },
});