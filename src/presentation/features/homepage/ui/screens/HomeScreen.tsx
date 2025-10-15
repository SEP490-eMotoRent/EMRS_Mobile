import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SearchBar } from '../../../../common/components/atoms/inputs/SearchBar';
import { BookingModal } from '../../../../common/components/organisms/bookingSearchBar/BookingModal';
import { Bike } from '../molecules/cards/BikeCard';
import { FeaturedBikesSection } from '../organisms/featuredBikes/FeaturedBikesSection';
import { HeroSection } from '../organisms/hero/HeroSection';
import { ComparisonSection } from '../organisms/sections/ComparisonSection';
import { LocationsSection } from '../organisms/sections/LocationSection';
import { ReviewsSection } from '../organisms/sections/ReviewsSection';
import { TapBookGoSection } from '../organisms/sections/TapBookGoSection';
import { WhyChooseSection } from '../organisms/whyChoose/WhyChooseSection';

export const HomeScreen: React.FC = () => {
    const bikes: Bike[] = [
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
        { name: 'Zero SR/F', category: 'Sport', range: '200 km', speed: '124 mph', price: '$89', rating: '4.9' },
    ];

    const [modalVisible, setModalVisible] = useState(false);

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.searchContainer}>
                    <SearchBar onPress={() => setModalVisible(true)} />
                </View>

                <HeroSection />
                <FeaturedBikesSection bikes={bikes} />
                <WhyChooseSection />
                <TapBookGoSection />
                <ReviewsSection />
                <ComparisonSection />
                <LocationsSection />
            </ScrollView>

            <BookingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
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
