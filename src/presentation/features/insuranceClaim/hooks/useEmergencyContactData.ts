import { useState, useEffect } from 'react';
import { GetBookingByIdUseCase } from '../../../../domain/usecases/booking/GetBookingByIdUseCase';

export interface EmergencyContactData {
    vehicleInfo: {
        model: string;
        licensePlate: string;
    };
    branchInfo: {
        name: string;
        phone: string;
        address?: string;
    };
    bookingContext: {
        id: string;
        status: string;
        startDate?: Date;
        endDate?: Date;
    };
    renterInfo: {
        name: string;
        phone: string;
        email: string;
    };
    // GPS location from renter's phone - will be implemented separately
    renterLocation?: {
        latitude: number;
        longitude: number;
        address?: string;
        timestamp: Date;
    };
}

export const useEmergencyContactData = (
    bookingId: string,
    useCase: GetBookingByIdUseCase
) => {
    const [data, setData] = useState<EmergencyContactData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (bookingId) {
        fetchData();
        }
    }, [bookingId]);

    const fetchData = async () => {
        try {
        setLoading(true);
        setError(null);
        
        console.log('🚨 Fetching emergency contact data for booking:', bookingId);
        
        const booking = await useCase.execute(bookingId);
        
        if (!booking) {
            throw new Error('Booking not found');
        }

        console.log('✅ Booking fetched:', booking.id);

        const emergencyData: EmergencyContactData = {
            vehicleInfo: {
            model: booking.vehicleModel?.modelName || 'Unknown Vehicle',
            licensePlate: booking.vehicle?.licensePlate || 'N/A',
            },
            branchInfo: {
            name: booking.handoverBranch?.branchName || 'Main Branch',
            phone: booking.handoverBranch?.phone || '1900-XXXX',
            address: booking.handoverBranch?.address || 'Branch address not available',
            },
            bookingContext: {
            id: booking.id,
            status: booking.bookingStatus || 'Unknown',
            startDate: booking.startDatetime,
            endDate: booking.endDatetime,
            },
            renterInfo: {
            name: booking.renter?.fullName() || 'Unknown',
            phone: booking.renter?.phone || 'N/A',
            email: booking.renter?.email || 'N/A',
            },
            // GPS location will be fetched separately via useRenterLocation hook
            renterLocation: undefined,
        };

        setData(emergencyData);
        console.log('✅ Emergency contact data set:', emergencyData);
        } catch (err: any) {
        console.error('❌ Error fetching emergency contact data:', err);
        setError(err.message || 'Failed to load emergency contact data');
        } finally {
        setLoading(false);
        }
    };

    return { 
        data, 
        loading, 
        error, 
        refetch: fetchData 
    };
};