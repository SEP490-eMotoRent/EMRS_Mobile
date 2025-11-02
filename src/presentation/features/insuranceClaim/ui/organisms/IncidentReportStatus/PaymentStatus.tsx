import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DetailRow } from '../../molecules/rows/DetailRow';

export interface PaymentStatusProps {
    depositAmount: string;
    insuranceCoverage: string;
    liability: string;
    expectedRefund: string;
}

export const PaymentStatus: React.FC<PaymentStatusProps> = ({
        depositAmount,
        insuranceCoverage,
        liability,
        expectedRefund,
    }) => {
        return (
            <View style={styles.card}>
            <Text style={styles.cardTitle}>📋 Payment Status</Text>
            <DetailRow label="Deposit Amount" value={depositAmount} />
            <DetailRow label="Insurance Coverage" value={insuranceCoverage} />
            <DetailRow
                label="Your Liability"
                value={liability}
                valueColor="#F97316"
            />
            <DetailRow
                label="Expected Refund"
                value={expectedRefund}
                valueColor="#10B981"
            />
            </View>
        );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F2937',
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 4,
    },
});