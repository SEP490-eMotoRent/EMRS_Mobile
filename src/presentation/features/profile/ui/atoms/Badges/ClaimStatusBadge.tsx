import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ClaimStatusBadgeProps {
    status: string;
}

export const ClaimStatusBadge: React.FC<ClaimStatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status.toLowerCase()) {
            case 'reported':
                return { bg: '#fef3c7', text: '#92400e' }; // Yellow
            case 'completed':
                return { bg: '#d1fae5', text: '#065f46' }; // Green
            case 'processing':
                return { bg: '#dbeafe', text: '#1e40af' }; // Blue
            case 'rejected':
                return { bg: '#fee2e2', text: '#991b1b' }; // Red
            default:
                return { bg: '#e5e7eb', text: '#374151' }; // Gray
        }
    };

    const getStatusLabel = () => {
        switch (status.toLowerCase()) {
            case 'reported':
                return 'Đã Báo Cáo';
            case 'completed':
                return 'Hoàn Thành';
            case 'processing':
                return 'Đang Xử Lý';
            case 'rejected':
                return 'Từ Chối';
            default:
                return status;
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.text, { color: statusStyle.text }]}>
                {getStatusLabel()}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    text: {
        fontSize: 12,
        fontWeight: '600',
    },
});