import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { InsuranceClaimResponse } from '../../../../../data/models/insurance/insuranceClaim/InsuranceClaimResponse';
import { ClaimStatusBadge } from '../atoms/Badges/ClaimStatusBadge';
import { Icon } from '../../../insuranceClaim/ui/atoms/icons/Icon';

interface InsuranceClaimCardProps {
    claim: InsuranceClaimResponse;
    onPress: () => void;
}

export const InsuranceClaimCard: React.FC<InsuranceClaimCardProps> = ({ 
    claim, 
    onPress 
}) => {
    const formatDate = (date: Date | null) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    };

    const formatCurrency = (amount: number | null) => {
        if (amount === null) return 'Chưa xác định';
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Icon name="shield" color="#00ff00" />
                    <View style={styles.headerInfo}>
                        <Text style={styles.modelName}>{claim.modelName}</Text>
                        <Text style={styles.licensePlate}>{claim.licensePlate}</Text>
                    </View>
                </View>
                <ClaimStatusBadge status={claim.status} />
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Icon name="calendar" color="#666" size={16} />
                    <Text style={styles.detailLabel}>Ngày Sự Cố:</Text>
                    <Text style={styles.detailValue}>{formatDate(claim.incidentDate)}</Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="location" color="#666" size={16} />
                    <Text style={styles.detailLabel}>Địa Điểm:</Text>
                    <Text style={styles.detailValue} numberOfLines={1}>
                        {claim.incidentLocation}
                    </Text>
                </View>

                <View style={styles.detailRow}>
                    <Icon name="document" color="#666" size={16} />
                    <Text style={styles.detailLabel}>Gói Bảo Hiểm:</Text>
                    <Text style={styles.detailValue}>{claim.packageName}</Text>
                </View>

                {claim.status.toLowerCase() === 'completed' && claim.totalCost !== null && (
                    <View style={styles.costRow}>
                        <Text style={styles.costLabel}>Tổng Chi Phí:</Text>
                        <Text style={styles.costValue}>{formatCurrency(claim.totalCost)}</Text>
                    </View>
                )}
            </View>

            <View style={styles.footer}>
                <Text style={styles.viewDetails}>Xem Chi Tiết</Text>
                <Icon name="arrow" color="#00ff00" size={16} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        flex: 1,
    },
    headerInfo: {
        flex: 1,
    },
    modelName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    licensePlate: {
        color: '#999',
        fontSize: 14,
        marginTop: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#333',
        marginBottom: 12,
    },
    details: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailLabel: {
        color: '#999',
        fontSize: 14,
    },
    detailValue: {
        color: '#fff',
        fontSize: 14,
        flex: 1,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#333',
    },
    costLabel: {
        color: '#999',
        fontSize: 14,
        fontWeight: '600',
    },
    costValue: {
        color: '#00ff00',
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 4,
        marginTop: 12,
    },
    viewDetails: {
        color: '#00ff00',
        fontSize: 14,
        fontWeight: '500',
    },
});