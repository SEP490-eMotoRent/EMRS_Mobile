import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { SearchBar } from '../../../../common/components/atoms/inputs/SearchBar';
import { BookingModal } from '../../../../common/components/organisms/bookingSearchBar/BookingModal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HomeStackParamList } from '../../../../shared/navigation/StackParameters/types';

import { HeroSection } from '../organisms/hero/HeroSection';
import { CategoryCardsSection } from '../organisms/sections/CategoryCardsSection';
import { PromotionalBannersSection } from '../organisms/sections/PromotionalBannersSection';
import { FeaturedBikesSection } from '../organisms/featuredBikes/FeaturedBikesSection';
import { PopularCitiesSection } from '../organisms/sections/PopularCitiesSection';
import { AdvantagesSection } from '../organisms/sections/AdvantagesSection';
import { ReviewsSection } from '../organisms/sections/ReviewsSection';
import { DateHelper } from '../../../../../domain/helpers/DateHelper';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);

    const bikes = [
        { 
            id: '1',
            name: 'VinFast Klara', 
            category: 'Cao cấp', 
            range: '80 km', 
            speed: '50 km/h', 
            price: 150000,
            originalPrice: 180000,
            rating: '4.9',
            location: 'Quận 1, TP.HCM',
            distance: '2.5 km',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400'
        },
        { 
            id: '2',
            name: 'Yadea S3', 
            category: 'Phổ thông', 
            range: '60 km', 
            speed: '45 km/h', 
            price: 120000,
            originalPrice: 150000,
            rating: '4.7',
            location: 'Quận 3, TP.HCM',
            distance: '3.2 km',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400'
        },
        { 
            id: '3',
            name: 'Pega Cap', 
            category: 'Tiết kiệm', 
            range: '50 km', 
            speed: '40 km/h', 
            price: 100000,
            originalPrice: 120000,
            rating: '4.5',
            location: 'Quận 7, TP.HCM',
            distance: '5.1 km',
            image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=400'
        },
    ];

    const handleViewAllBikes = () => {
        navigation.navigate('ListView', {
            location: 'Ho Chi Minh City, Vietnam',
            dateRange: DateHelper.getDefaultDateRangeEnglish(),
            address: 'Ho Chi Minh City, Vietnam',
        });
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Sticky Search Bar */}
            <View style={styles.stickySearchContainer}>
                <SearchBar onPress={() => setModalVisible(true)} />
            </View>

            {/* Scrollable Content */}
            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <HeroSection />
                {/* <CategoryCardsSection />
                <PromotionalBannersSection /> */}
                <FeaturedBikesSection bikes={bikes} onViewAll={handleViewAllBikes} />
                <PopularCitiesSection />
                <AdvantagesSection />
                <ReviewsSection />
            </ScrollView>

            <BookingModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    stickySearchContainer: {
        backgroundColor: '#000000',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        zIndex: 1000,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
});