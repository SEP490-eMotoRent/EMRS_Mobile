import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SearchBar } from '../../../../common/components/atoms/inputs/SearchBar';
import { HeroSection } from '../organisms/hero/HeroSection';
import { FeaturedBikesSection } from '../organisms/featuredBikes/FeaturedBikesSection';
import { WhyChooseSection } from '../organisms/whyChoose/WhyChooseSection';
import { ReviewsSection } from '../organisms/sections/ReviewsSection';
import { ComparisonSection } from '../organisms/sections/ComparisonSection';
import { LocationsSection } from '../organisms/sections/LocationSection';
import { TapBookGoSection } from '../organisms/sections/TapBookGoSection';
import { Bike } from '../molecules/cards/BikeCard';

export const HomeScreen: React.FC = () => {
    const bikes: Bike[] = [
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
    ];

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.searchContainer}>
                    <SearchBar />
                </View>
                <HeroSection />
                <FeaturedBikesSection bikes={bikes} />
                <WhyChooseSection />
                <TapBookGoSection />
                <ReviewsSection />
                <ComparisonSection />
                <LocationsSection />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 16,
    },
    searchContainer: {
        paddingTop: 12,
        paddingHorizontal: 16,
    },
});