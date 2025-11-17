import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, BackHandler, Linking, Text, View } from 'react-native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { BookingDetailsTemplate } from '../templates/BookingDetailsTemplate';
import { useBookingDetails } from '../../hooks/useBookingDetails';
import sl from '../../../../../core/di/InjectionContainer';

type BookingDetailsScreenRouteProp = RouteProp<TripStackParamList, 'BookingDetails'>;
type BookingDetailsScreenNavigationProp = StackNavigationProp<TripStackParamList, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC = () => {
    const route = useRoute<BookingDetailsScreenRouteProp>();
    const navigation = useNavigation<BookingDetailsScreenNavigationProp>();
    
    const { bookingId } = route.params;
    const bookingReference = (route.params as any).bookingReference; // Optional param
    
    // Use the custom hook to fetch booking details
    const { bookingData, loading, error, refetch } = useBookingDetails(bookingId, bookingReference);
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true; // Prevent app from closing
        });
        return () => backHandler.remove();
    }, [navigation]);

    const handleGetDirections = () => {
        if (!bookingData) return;
        const url = `https://maps.google.com/?q=${encodeURIComponent(bookingData.branchAddress)}`;
        Linking.openURL(url);
    };

    const handleCallBranch = () => {
        if (!bookingData) return;
        Linking.openURL(`tel:${bookingData.branchPhone}`);
    };

    const handleViewFullContract = () => {
        Alert.alert('View Contract', 'Opening full contract...');
        // TODO: Navigate to contract viewer or open PDF
    };

    const handleDownloadContract = async () => {
        try {
            Alert.alert('Download', 'Downloading contract PDF...');
            // TODO: Implement contract download
            // const getContractUseCase = sl.getGetContractUseCase();
            // const contract = await getContractUseCase.execute(bookingId);
        } catch (error) {
            console.error('Error downloading contract:', error);
            Alert.alert('Error', 'Failed to download contract');
        }
    };

    const handleAddToCalendar = () => {
        if (!bookingData) return;
        Alert.alert('Calendar', 'Adding to calendar...');
        // TODO: Implement calendar integration
    };

    const handleContactBranch = () => {
        if (!bookingData) return;
        Linking.openURL(`tel:${bookingData.branchPhone}`);
    };

    const handleCancelBooking = () => {
        Alert.alert(
            'Cancel Booking',
            'Are you sure you want to cancel this booking? This action cannot be undone.',
            [
                { text: 'No', style: 'cancel' },
                { 
                    text: 'Yes, Cancel', 
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            console.log('🚫 Cancelling booking:', bookingId);
                            
                            const cancelBookingUseCase = sl.getCancelBookingUseCase();
                            const cancelledBooking = await cancelBookingUseCase.execute(bookingId);
                            
                            console.log('✅ Booking cancelled successfully:', cancelledBooking.id);
                            console.log('📊 New status:', cancelledBooking.bookingStatus);
                            
                            Alert.alert(
                                'Success',
                                'Your booking has been cancelled successfully.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => {
                                            // Navigate back or refresh the booking list
                                            navigation.goBack();
                                        }
                                    }
                                ]
                            );
                        } catch (error: any) {
                            console.error('❌ Error cancelling booking:', error);
                            Alert.alert(
                                'Error',
                                error.message || 'Failed to cancel booking. Please try again.'
                            );
                        }
                    }
                },
            ]
        );
    };

    // Loading state
    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1628' }}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{ color: '#FFFFFF', marginTop: 16 }}>Loading booking details...</Text>
            </View>
        );
    }

    // Error state
    if (error || !bookingData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1628', padding: 20 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                    {error || 'No booking data available'}
                </Text>
                <Text 
                    style={{ color: '#2196F3', fontSize: 14 }}
                    onPress={() => refetch()}
                >
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <BookingDetailsTemplate
            data={bookingData}
            onGetDirections={handleGetDirections}
            onCallBranch={handleCallBranch}
            onViewFullContract={handleViewFullContract}
            onDownloadContract={handleDownloadContract}
            onAddToCalendar={handleAddToCalendar}
            onContactBranch={handleContactBranch}
            onCancelBooking={handleCancelBooking}
        />
    );
};