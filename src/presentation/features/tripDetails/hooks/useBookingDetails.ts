import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Booking } from '../../../../domain/entities/booking/Booking';
import { BookingDetailsData } from '../ui/templates/BookingDetailsTemplate';
import { container } from '../../../../core/di/ServiceContainer';
import { mapBookingToDetailsData } from '../mappers/bookingMapper';

export const useBookingDetails = (bookingId: string, bookingReference?: string) => {
    const [bookingData, setBookingData] = useState<BookingDetailsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetch = async () => {
        try {
        setLoading(true);
        setError(null);

        const booking: Booking = await container.booking.get.byId.execute(bookingId);

        const data = mapBookingToDetailsData(booking, bookingReference);
        setBookingData(data);
        } catch (err: any) {
        setError(err.message || 'Failed to load booking');
        Alert.alert('Error', err.message || 'Failed to load booking');
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        if (bookingId) fetch();
    }, [bookingId]);

    return { bookingData, loading, error, refetch: fetch };
};