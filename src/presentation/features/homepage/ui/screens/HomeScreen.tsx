import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { BottomNavigationBar, NavRoute } from '../../../../common/components/organisms/BottomNavigationBar';
import { Bike } from '../molecules/cards/BikeCard';
import { SearchBar } from '../../../../common/components/atoms/inputs/SearchBar';
import { HeroSection } from '../organisms/hero/HeroSection';
import { PrimaryButton } from '../atoms/buttons/PrimaryButton';
import { FeaturedBikesSection } from '../organisms/featuredBikes/FeaturedBikesSection';
import { WhyChooseSection } from '../organisms/whyChoose/WhyChooseSection';
import { ReviewsSection } from '../organisms/sections/ReviewsSection';
import { ComparisonSection } from '../organisms/sections/ComparisonSection';
import { LocationsSection } from '../organisms/sections/LocationSection';
import { TapBookGoSection } from '../organisms/sections/TapBookGoSection';

export const HomeScreen: React.FC = () => {
    const [activeRoute, setActiveRoute] = useState<NavRoute>('home');

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

                {/* <View style={styles.buttonContainer}>
                <PrimaryButton>Search Available Bikes</PrimaryButton>
                </View> */}

                <FeaturedBikesSection bikes={bikes} />
                <WhyChooseSection />
                <TapBookGoSection />
                <ReviewsSection />
                <ComparisonSection />
                <LocationsSection />
            </ScrollView>

            <BottomNavigationBar activeRoute={activeRoute} onNavigate={setActiveRoute} />
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
    buttonContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
});