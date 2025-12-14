import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SearchBar } from '../../../../common/components/atoms/inputs/SearchBar';
import { BookingModal } from '../../../../common/components/organisms/bookingSearchBar/BookingModal';
import { HomeStackParamList } from '../../../../shared/navigation/StackParameters/types';

import { DateHelper } from '../../../../../domain/helpers/DateHelper';
import { FeaturedBikesSection } from '../organisms/featuredBikes/FeaturedBikesSection';
import { HeroSection } from '../organisms/hero/HeroSection';
import { AdvantagesSection } from '../organisms/sections/AdvantagesSection';
import { PopularCitiesSection } from '../organisms/sections/PopularCitiesSection';
import { ReviewsSection } from '../organisms/sections/ReviewsSection';

import { useVehicleModelsPaginated } from '../../../vehicleList/hooks/useVehicleModelsPaginated';
import { VehicleModelMapper } from '../../../vehicleList/mappers/VehicleModelMapper';
import { Bike } from '../molecules/cards/BikeCard';

type HomeScreenNavigationProp = StackNavigationProp<HomeStackParamList, 'Home'>;

export const HomeScreen: React.FC = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const [modalVisible, setModalVisible] = useState(false);
    // NEW: State to store pre-filled address
    const [prefilledAddress, setPrefilledAddress] = useState<string | null>(null);

    // Use paginated hook for real vehicle data
    const {
        items,
        loading,
        error,
        loadInitial,
    } = useVehicleModelsPaginated();

    // Load initial data on mount
    useEffect(() => {
        loadInitial({
            startTime: undefined,
            endTime: undefined,
            branchId: undefined,
        });
    }, []);

    // Map search items to motorcycles for display
    const defaultDateRange = DateHelper.getDefaultDateRange();
    const featuredBikes = useMemo(() => {
        const motorcycles = VehicleModelMapper.fromSearchItems(items, [], defaultDateRange);
        
        // Filter out bikes with 0 availability - only feature what you have!
        const availableBikes = motorcycles.filter(bike => 
            bike.countAvailable !== undefined && bike.countAvailable > 0
        );
        
        // Shuffle array randomly using Fisher-Yates algorithm
        const shuffled = [...availableBikes].sort(() => Math.random() - 0.5);
        
        // Take first 5 bikes after shuffling (or less if not enough available)
        return shuffled.slice(0, 5);
    }, [items, defaultDateRange]);

    const handleViewAllBikes = () => {
        navigation.navigate('ListView', {
            location: 'Ho Chi Minh City, Vietnam',
            dateRange: DateHelper.getDefaultDateRangeEnglish(),
            address: 'Ho Chi Minh City, Vietnam',
        });
    };

    // ✅ NEW: Handle bike card press - navigate to VehicleDetails
    const handleBikePress = (bike: Bike) => {
        navigation.navigate('Browse', {
            screen: 'VehicleDetails',
            params: {
            vehicleId: bike.id,
            dateRange: defaultDateRange,
            location: 'Ho Chi Minh City, Vietnam',
            }
        });
    };

    // NEW: Handle city selection
    const handleCitySelect = (cityAddress: string) => {
        setPrefilledAddress(cityAddress);
        setModalVisible(true);
    };

    // NEW: Handle modal close - reset pre-filled address
    const handleModalClose = () => {
        setModalVisible(false);
        setPrefilledAddress(null);
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
                <FeaturedBikesSection 
                    bikes={featuredBikes} 
                    loading={loading}
                    error={error}
                    onViewAll={handleViewAllBikes}
                    onBikePress={handleBikePress} // NEW: Pass bike press handler
                />
                {/* UPDATED: Pass city select handler */}
                <PopularCitiesSection onCityPress={handleCitySelect} />
                <AdvantagesSection />
                <ReviewsSection />
            </ScrollView>

            {/* UPDATED: Pass initial address and custom close handler */}
            <BookingModal
                visible={modalVisible}
                onClose={handleModalClose}
                initialAddress={prefilledAddress}
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