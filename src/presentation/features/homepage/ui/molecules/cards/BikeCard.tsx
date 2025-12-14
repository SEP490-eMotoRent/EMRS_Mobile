import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RatingBadge } from '../../atoms/badges/RatingBadge';
import { Heading2 } from '../../atoms/typography/Heading2';

// Updated to match Motorcycle from VehicleModelMapper
export interface Bike {
    id: string;
    name: string;
    brand: string;
    category?: string; // Optional - might not come from API
    variant?: string; // ✅ This is what mapper actually sets (mapped from category)
    range: string;
    speed?: string;
    price: number;
    originalPrice?: number;
    rating?: string;
    location?: string;
    distance: number;
    image: string;
    features: string[];
    countAvailable?: number;
}

interface BikeCardProps {
    bike: Bike;
    onPress?: () => void;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike, onPress }) => {
    const hasDiscount = bike.originalPrice && bike.originalPrice > bike.price;
    const discountPercent = hasDiscount 
        ? Math.round(((bike.originalPrice! - bike.price) / bike.originalPrice!) * 100)
        : 0;

    // Generate default location if not provided
    const displayLocation = bike.location || `${bike.brand} - TP.HCM`;
    
    // ✅ Use bike.variant (what mapper actually sets)
    // Regular bikes (ECONOMY/STANDARD): Hot if 1-4 bikes left
    // Premium bikes: Hot ONLY if 1-3 bikes left (higher exclusivity threshold)
    const isPremium = bike.variant === 'PREMIUM' || bike.variant === 'Cao cấp';
    const showHotBadge = isPremium
        ? (bike.countAvailable && bike.countAvailable >= 1 && bike.countAvailable <= 2)
        : (bike.countAvailable && bike.countAvailable >= 1 && bike.countAvailable <= 3);

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: bike.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                {/* Show rating badge only if rating exists */}
                {bike.rating && <RatingBadge rating={bike.rating} />}
                
                {/* Show hot badge for scarce bikes */}
                {showHotBadge && (
                    <View style={styles.hotBadge}>
                        <Text style={styles.hotBadgeText}>🔥 Hot</Text>
                    </View>
                )}
                {/* Show availability badge if count exists */}
                {bike.countAvailable !== undefined && bike.countAvailable > 0 && (
                    <View style={styles.availabilityBadge}>
                        <Text style={styles.availabilityText}>
                            {bike.countAvailable} xe
                        </Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Heading2 style={styles.title}>{bike.name}</Heading2>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.locationText}>{displayLocation}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.priceContainer}>
                        <View style={styles.priceRow}>
                            <Text style={styles.price}>
                                {bike.price.toLocaleString('vi-VN')}đ
                            </Text>
                            <Text style={styles.priceUnit}>/ngày</Text>
                        </View>
                        {hasDiscount && (
                            <View style={styles.discountRow}>
                                <Text style={styles.originalPrice}>
                                    {bike.originalPrice!.toLocaleString('vi-VN')}đ
                                </Text>
                                <View style={styles.discountBadge}>
                                    <Text style={styles.discountText}>-{discountPercent}%</Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1F1F1F',
        borderRadius: 16,
        overflow: 'hidden',
        width: 280,
        marginRight: 16,
        flexShrink: 0,
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    imageContainer: {
        position: 'relative',
        height: 160,
        backgroundColor: '#27272A',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    hotBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    hotBadgeText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    availabilityBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(34, 197, 94, 0.9)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    availabilityText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
    content: {
        padding: 16,
    },
    header: {
        marginBottom: 12,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        marginBottom: 6,
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    locationText: {
        color: '#9CA3AF',
        fontSize: 13,
        marginLeft: 4,
    },
    distanceText: {
        color: '#6B7280',
        fontSize: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    priceContainer: {
        flex: 1,
    },
    priceRow: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    price: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    priceUnit: {
        color: '#9CA3AF',
        fontSize: 13,
        marginLeft: 4,
    },
    discountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    originalPrice: {
        color: '#6B7280',
        fontSize: 13,
        textDecorationLine: 'line-through',
        marginRight: 8,
    },
    discountBadge: {
        backgroundColor: '#EF4444',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 11,
        fontWeight: '600',
    },
});