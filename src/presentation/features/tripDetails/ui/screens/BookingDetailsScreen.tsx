import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { ActivityIndicator, Alert, BackHandler, Linking, Text, View } from 'react-native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { BookingDetailsTemplate } from '../templates/BookingDetailsTemplate';
import { useBookingDetails } from '../../hooks/useBookingDetails';
import { container } from '../../../../../core/di/ServiceContainer'; // ← THIS IS THE NEW ONE

type BookingDetailsScreenRouteProp = RouteProp<TripStackParamList, 'BookingDetails'>;
type BookingDetailsScreenNavigationProp = StackNavigationProp<TripStackParamList, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC = () => {
    const route = useRoute<BookingDetailsScreenRouteProp>();
    const navigation = useNavigation<BookingDetailsScreenNavigationProp>();
    
    const { bookingId } = route.params;
    const bookingReference = (route.params as any).bookingReference;
    const { bookingData, loading, error, refetch } = useBookingDetails(bookingId, bookingReference);
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true;
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
    };

    const handleDownloadContract = async () => {
        Alert.alert('Download', 'Downloading contract PDF...');
    };

    const handleAddToCalendar = () => {
        if (!bookingData) return;
        Alert.alert('Calendar', 'Adding to calendar...');
    };

    const handleContactBranch = () => {
        if (!bookingData) return;
        Linking.openURL(`tel:${bookingData.branchPhone}`);
    };

    // FIXED: Cancel booking using the NEW container
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
                            console.log('Cancelling booking:', bookingId);

                            // This is the correct way now
                            await container.booking.cancel.execute(bookingId);

                            console.log('Booking cancelled successfully');

                            Alert.alert(
                                'Success',
                                'Your booking has been cancelled successfully.',
                                [
                                    {
                                        text: 'OK',
                                        onPress: () => navigation.goBack()
                                    }
                                ]
                            );
                        } catch (error: any) {
                            console.error('Error cancelling booking:', error);
                            Alert.alert(
                                'Error',
                                error.message || 'Failed to cancel booking. Please try again.'
                            );
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1628' }}>
                <ActivityIndicator size="large" color="#2196F3" />
                <Text style={{ color: '#FFFFFF', marginTop: 16 }}>Loading booking details...</Text>
            </View>
        );
    }

    if (error || !bookingData) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1628', padding: 20 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 16, marginBottom: 20, textAlign: 'center' }}>
                    {error || 'No booking data available'}
                </Text>
                <Text style={{ color: '#2196F3', fontSize: 14 }} onPress={refetch}>
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