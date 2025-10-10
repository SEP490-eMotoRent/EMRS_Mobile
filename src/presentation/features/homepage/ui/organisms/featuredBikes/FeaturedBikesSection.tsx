import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Heading2 } from '../../atoms/typography/Heading2';
import { Bike, BikeCard } from '../../molecules/cards/BikeCard';

interface FeaturedBikesSectionProps {
    bikes: Bike[];
}

export const FeaturedBikesSection: React.FC<FeaturedBikesSectionProps> = ({ bikes }) => (
    <View style={styles.container}>
        <View style={styles.header}>
        <Heading2 style={styles.heading}>Featured Bikes</Heading2>
        <TouchableOpacity>
            <Text style={styles.viewAll}>View all ›</Text>
        </TouchableOpacity>
        </View>

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.bikeList}
        >
        {bikes.map((bike, index) => (
            <BikeCard key={index} bike={bike} />
        ))}
        </ScrollView>
    </View>
);

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 20,
    },
    viewAll: {
        color: '#A78BFA', // purple-300
        fontSize: 16,
    },
    bikeList: {
        paddingBottom: 16,
    },
});
