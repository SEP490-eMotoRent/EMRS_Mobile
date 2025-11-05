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
            <Text style={styles.cardTitle}>Tình trạng thanh toán</Text>
            <DetailRow label="Số tiền đặt cọc" value={depositAmount} />
            <DetailRow label="Phạm vi bảo hiểm" value={insuranceCoverage} />
            <DetailRow
                label="Trách nhiệm của bạn"
                value={liability}
                valueColor="#F97316"
            />
            <DetailRow
                label="Hoàn tiền dự kiến"
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