import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Heading2 } from '../../atoms/typography/Heading2';
import { BikeCard, Bike } from '../../molecules/cards/BikeCard'; // ✅ Import Bike type from BikeCard

interface FeaturedBikesSectionProps {
    bikes: Bike[];
    loading?: boolean;
    error?: string | null;
    onViewAll?: () => void;
    onBikePress?: (bike: Bike) => void; // ✅ NEW: Handler for bike card press
}

export const FeaturedBikesSection: React.FC<FeaturedBikesSectionProps> = ({ 
    bikes, 
    loading = false,
    error = null,
    onViewAll,
    onBikePress, // ✅ NEW: Receive bike press handler
}) => {
    // ✅ Loading state
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

    // ✅ Error state
    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                </View>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>Không thể tải dữ liệu xe</Text>
                    <Text style={styles.errorSubtext}>{error}</Text>
                </View>
            </View>
        );
    }

    // ✅ Empty state
    if (bikes.length === 0) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Heading2 style={styles.heading}>Xe nổi bật</Heading2>
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Không có xe nổi bật</Text>
                </View>
            </View>
        );
    }

    // ✅ Normal state with bikes
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
                        onPress={() => onBikePress?.(bike)} // ✅ NEW: Pass press handler
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
    loadingContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: '#999',
        fontSize: 14,
    },
    errorContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 32,
    },
    errorText: {
        color: '#FF6B6B',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    errorSubtext: {
        color: '#999',
        fontSize: 12,
        textAlign: 'center',
    },
    emptyContainer: {
        height: 200,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontSize: 14,
    },
});