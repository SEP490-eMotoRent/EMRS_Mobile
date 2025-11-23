import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface City {
    name: string;
    vehicleCount: string;
    image: string;
}

export const PopularCitiesSection: React.FC = () => {
    const cities: City[] = [
        {
            name: 'Quận 1',
            vehicleCount: '150+ xe',
            image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=200&h=200&fit=crop',
        },
        {
            name: 'Quận 3',
            vehicleCount: '120+ xe',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
        },
        {
            name: 'Quận 7',
            vehicleCount: '90+ xe',
            image: 'https://images.unsplash.com/photo-1601581874831-8a79c50e3d4a?w=200&h=200&fit=crop',
        },
        {
            name: 'Quận 2',
            vehicleCount: '110+ xe',
            image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?w=200&h=200&fit=crop',
        },
        {
            name: 'Bình Thạnh',
            vehicleCount: '85+ xe',
            image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200&h=200&fit=crop',
        },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa điểm phổ biến</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {cities.map((city, index) => (
                    <TouchableOpacity key={index} style={styles.cityCard} activeOpacity={0.7}>
                        <Image source={{ uri: city.image }} style={styles.cityImage} />
                        <Text style={styles.cityName}>{city.name}</Text>
                        <Text style={styles.vehicleCount}>{city.vehicleCount}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 24,
        paddingLeft: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollContent: {
        gap: 16,
        paddingRight: 16,
    },
    cityCard: {
        alignItems: 'center',
        width: 110,
    },
    cityImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 8,
        borderWidth: 3,
        borderColor: '#8B5CF6',
    },
    cityName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
    vehicleCount: {
        color: '#9CA3AF',
        fontSize: 12,
        textAlign: 'center',
    },
});