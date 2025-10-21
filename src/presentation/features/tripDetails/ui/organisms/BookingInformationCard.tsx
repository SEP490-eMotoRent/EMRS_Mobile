import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { VerificationCheckmark } from '../atoms/VerificationCheckmark';
import { BookingInfoRow } from '../molecules/BookingInfoRow';
import { VehicleCard } from '../molecules/VehicleCard';

interface BookingInformationCardProps {
    bookingReference: string;
    contractStatus: string;
    contractVerified: boolean;
    vehicleName: string;
    rentalPeriod: string;
    duration: string;
    vehicleImageUrl?: string;
}

export const BookingInformationCard: React.FC<BookingInformationCardProps> = ({
    bookingReference,
    contractStatus,
    contractVerified,
    vehicleName,
    rentalPeriod,
    duration,
    vehicleImageUrl,
}) => {
    return (
        <View style={styles.container}>
        <SectionTitle title="Booking Information" />
        <View style={styles.content}>
            <BookingInfoRow label="Booking Reference" value={bookingReference} valueColor="#4CAF50" />
            <BookingInfoRow 
            label="Contract Status" 
            value={
                <VerificationCheckmark 
                label={contractStatus} 
                verified={contractVerified} 
                />
            } 
            />
            <VehicleCard
            name={vehicleName}
            rentalPeriod={rentalPeriod}
            duration={duration}
            imageUrl={vehicleImageUrl}
            />
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    content: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
    },
});