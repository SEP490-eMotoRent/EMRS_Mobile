import { useState, useEffect } from 'react';
import { Booking } from '../../../../domain/entities/booking/Booking';
import { GetCurrentRenterBookingsUseCase } from '../../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase';

export const useGetCurrentRenterBookings = (useCase: GetCurrentRenterBookingsUseCase) => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError(null);
            // console.log("🔄 Fetching current renter bookings...");
            const result = await useCase.execute();
            // console.log("✅ Bookings fetched:", result.length);
            setBookings(result);
        } catch (err: any) {
            // console.error("❌ Error fetching bookings:", err);
            setError(err.message || 'Failed to fetch bookings');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    return { bookings, loading, error, refetch: fetchBookings };
};