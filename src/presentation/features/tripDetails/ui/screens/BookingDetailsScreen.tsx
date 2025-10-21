import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, BackHandler, Linking, Text, View } from 'react-native';
import { TripStackParamList } from '../../../../shared/navigation/StackParameters/types';
import { BookingDetailsData, BookingDetailsTemplate } from '../templates/BookingDetailsTemplate';

type BookingDetailsScreenRouteProp = RouteProp<TripStackParamList, 'BookingDetails'>;
type BookingDetailsScreenNavigationProp = StackNavigationProp<TripStackParamList, 'BookingDetails'>;

export const BookingDetailsScreen: React.FC = () => {
    const route = useRoute<BookingDetailsScreenRouteProp>();
    const navigation = useNavigation<BookingDetailsScreenNavigationProp>();
    
    const { tripId, bookingReference } = route.params;
    const [bookingData, setBookingData] = useState<BookingDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            navigation.goBack();
            return true; // Prevent app from closing
        });
        return () => backHandler.remove();
    }, [navigation]);
    
    useEffect(() => {
        // Fetch booking details based on tripId
        fetchBookingDetails(tripId);
    }, [tripId]);

    const fetchBookingDetails = async (id: string) => {
        try {
        setLoading(true);
        console.log('Fetching booking details for trip:', id);
        
        // TODO: Replace with actual API call
        // Simulating API response
        const data: BookingDetailsData = {
            status: 'confirmed',
            startsIn: '3 days 2 hours 45 minutes',
            
            bookingReference: bookingReference || '#EMR240920002',
            contractStatus: 'Contract Signed',
            contractVerified: true,
            vehicleName: 'VinFast Klara',
            rentalPeriod: 'Sep 24 5:00 PM - Sep 26 1:00 PM',
            duration: '2 days 8 hours',
            vehicleImageUrl: undefined, // Add actual image URL
            
            branchName: 'District 2, eMotoRent Branch',
            branchAddress: '193 Nguyen Van Linh Street, District 2, Ho Chi Minh City',
            operatingHours: 'Open 24/7',
            branchPhone: '+84 123 456 789',
            
            rentalFee: '1,200,000đ',
            insuranceFee: '150,000đ',
            insuranceBadge: 'Premium',
            serviceFee: '50,000đ',
            securityDeposit: '2,000,000đ',
            totalPaid: '3,600,000đ',
            paymentMethod: 'eMotoRent Wallet',
            
            digitalSignatureCompleted: true,
            signedOn: 'Sep 20, 2025 - 15:22',
            otpVerified: true,
            keyTerms: [
            'Refund up to 24 hours before pickup',
            'Late arrivals (>30 min) may result in cancellation',
            'Renter is liable for damages not covered by insurance',
            'Vehicle must be returned with minimum 10% battery',
            ],
            
            cancellationPolicy: 'Free until 24h before pickup, 50% fee after that',
            lateArrivalPolicy: 'May result in booking cancellation with 50% fee',
            emergencyHotline: '1900 1234',
        };

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setBookingData(data);
        console.log('Booking details loaded successfully');
        } catch (error) {
        console.error('Error fetching booking details:', error);
        Alert.alert('Error', 'Failed to load booking details');
        } finally {
        setLoading(false);
        }
    };

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

    const handleDownloadContract = () => {
        Alert.alert('Download', 'Downloading contract PDF...');
    };

    const handleAddToCalendar = () => {
        Alert.alert('Calendar', 'Adding to calendar...');
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
            onPress: () => {
                console.log('Booking cancelled for trip:', tripId);
                // TODO: Call API to cancel booking
                navigation.goBack();
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

    // No data state
    if (!bookingData) {
        return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0A1628' }}>
            <Text style={{ color: '#FFFFFF', fontSize: 16 }}>No booking data available</Text>
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