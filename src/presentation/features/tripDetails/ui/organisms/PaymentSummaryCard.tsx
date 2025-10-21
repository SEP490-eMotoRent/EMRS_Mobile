import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionTitle } from '../atoms/SectionTitle';
import { BookingInfoRow } from '../molecules/BookingInfoRow';
import { PaymentSummaryRow } from '../molecules/PaymentSummaryRow';

interface PaymentSummaryCardProps {
    rentalFee: string;
    insuranceFee: string;
    insuranceBadge?: string;
    serviceFee: string;
    securityDeposit: string;
    totalPaid: string;
    paymentMethod: string;
}

export const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({
    rentalFee,
    insuranceFee,
    insuranceBadge,
    serviceFee,
    securityDeposit,
    totalPaid,
    paymentMethod,
}) => {
    return (
        <View style={styles.container}>
        <SectionTitle title="Payment Summary" />
        <View style={styles.card}>
            <PaymentSummaryRow label="Rental fee (2 days 8 hours)" amount={rentalFee} />
            <PaymentSummaryRow 
            label="Insurance" 
            amount={insuranceFee} 
            badge={insuranceBadge}
            />
            <PaymentSummaryRow label="Service fee" amount={serviceFee} />
            <PaymentSummaryRow 
            label="Security deposit" 
            amount={securityDeposit}
            icon={<SecurityDepositIcon />}
            />
            <PaymentSummaryRow 
            label="Total paid" 
            amount={totalPaid} 
            isTotal 
            />
            <View style={styles.divider} />
            <BookingInfoRow label="Payment Method" value={paymentMethod} />
        </View>
        </View>
    );
};

// Simple icon component
const SecurityDepositIcon = () => (
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#BB86FC' }} />
);

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: 12,
        padding: 16,
    },
    divider: {
        height: 1,
        backgroundColor: '#2C2C2C',
        marginVertical: 12,
    },
});