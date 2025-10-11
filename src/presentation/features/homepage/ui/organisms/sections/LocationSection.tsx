import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LocationCard } from '../../molecules/cards/LocationCard';

export const LocationsSection: React.FC = () => {
    const locations = [
        {
        state: "California",
        city: "San Francisco",
        image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400&h=300&fit=crop"
        },
        {
        state: "New York",
        city: "New York City",
        image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=300&fit=crop"
        },
        {
        state: "California",
        city: "Los Angeles",
        image: "https://images.unsplash.com/photo-1542259009477-d625272157b7?w=400&h=300&fit=crop"
        },
        {
        state: "Texas",
        city: "Austin",
        image: "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=400&h=300&fit=crop"
        },
        {
        state: "Florida",
        city: "Miami",
        image: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?w=400&h=300&fit=crop"
        }
    ];

    return (
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Locations</Text>
        <Text style={styles.locationsSubtitle}>
            Explore iconic destinations with zero emissions. Pick up your electric bike from one of our convenient hubs and start your adventure.
        </Text>
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {locations.map((location, index) => (
            <LocationCard key={index} {...location} />
            ))}
        </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    locationsSubtitle: {
        color: '#9ca3af',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    scrollContent: {
        paddingRight: 16,
    },
});