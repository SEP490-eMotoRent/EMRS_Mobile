import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Heading2 } from '../../atoms/typography/Heading2';
import { BikeCard, Bike } from '../../molecules/cards/BikeCard';

interface FeaturedBikesSectionProps {
    bikes: Bike[];
    loading?: boolean;
    error?: string | null;
    onViewAll?: () => void;
    onBikePress?: (bike: Bike) => void;
    onRetry?: () => void;
}

export const FeaturedBikesSection: React.FC<FeaturedBikesSectionProps> = ({ 
    bikes, 
    loading = false,
    error = null,
    onViewAll,
    onBikePress,
    onRetry,
}) => {
    // Loading state - Vietnamese
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#A78BFA" />
                    <Text style={styles.loadingText}>Đang tải xe...</Text>
                </View>
            </View>
        );
    }

    // Error state - Vietnamese with retry button
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                </View>
                <View style={styles.errorContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color="#FF6B6B" />
                    <Text style={styles.errorText}>Không thể tải dữ liệu xe</Text>
                    <Text style={styles.errorSubtext}>
                        Lỗi mạng hoặc máy chủ tạm thời không khả dụng
                    </Text>
                    {onRetry && (
                        <TouchableOpacity 
                            style={styles.retryButton}
                            onPress={onRetry}
                            activeOpacity={0.7}
                        >
                            <Ionicons name="refresh" size={20} color="#FFFFFF" />
                            <Text style={styles.retryButtonText}>Thử lại</Text>
                        </TouchableOpacity>
                    )}
                    <Text style={styles.helpText}>
                        Hoặc kéo xuống để làm mới
                    </Text>
                </View>
            </View>
        );
    }

    // Empty state - Vietnamese
    if (bikes.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                </View>
                <View style={styles.emptyContainer}>
                    <Ionicons name="bicycle-outline" size={48} color="#6B7280" />
                    <Text style={styles.emptyText}>Hiện không có xe nổi bật</Text>
                    <Text style={styles.emptySubtext}>
                        Vui lòng thử lại sau
                    </Text>
                </View>
            </View>
        );
    }

    // Normal state with bikes
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                <TouchableOpacity onPress={onViewAll}>
                    <Text style={styles.viewAll}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.bikeList}
            >
                {bikes.map((bike) => (
                    <BikeCard 
                        key={bike.id} 
                        bike={bike}
                        onPress={() => onBikePress?.(bike)}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 32,
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    heading: {
        fontSize: 20,
    },
    viewAll: {
        color: '#A78BFA',
        fontSize: 16,
    },
    bikeList: {
        paddingBottom: 16,
    },
    // Loading styles
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#9CA3AF',
        fontSize: 14,
        marginTop: 8,
    },
    // Error styles - improved with icon and retry button
    errorContainer: {
        height: 240,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
        gap: 12,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 12,
    },
    errorSubtext: {
        color: '#9CA3AF',
        fontSize: 13,
        textAlign: 'center',
        lineHeight: 18,
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#A78BFA',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 16,
        gap: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
    helpText: {
        color: '#6B7280',
        fontSize: 12,
        marginTop: 8,
        fontStyle: 'italic',
    },
    // Empty styles
    emptyContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    emptyText: {
        color: '#9CA3AF',
        fontSize: 15,
        fontWeight: '500',
        marginTop: 12,
    },
    emptySubtext: {
        color: '#6B7280',
        fontSize: 13,
    },
});