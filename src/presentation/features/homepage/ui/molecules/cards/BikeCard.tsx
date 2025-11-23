import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { Badge } from '../../atoms/badges/Badge';
import { RatingBadge } from '../../atoms/badges/RatingBadge';
import { SecondaryButton } from '../../atoms/buttons/SecondaryButton';
import { Heading2 } from '../../atoms/typography/Heading2';
import { Ionicons } from '@expo/vector-icons';

export interface Bike {
    id: string;
    name: string;
    category: string;
    range: string;
    speed: string;
    price: number;
    originalPrice?: number;
    rating: string;
    location: string;
    distance: string;
    image: string;
}

interface BikeCardProps {
    bike: Bike;
}

export const BikeCard: React.FC<BikeCardProps> = ({ bike }) => {
    const hasDiscount = bike.originalPrice && bike.originalPrice > bike.price;
    const discountPercent = hasDiscount 
        ? Math.round(((bike.originalPrice! - bike.price) / bike.originalPrice!) * 100)
        : 0;

    return (
        <View style={styles.card}>
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: bike.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
                <RatingBadge rating={bike.rating} />
                {bike.category === 'Cao cấp' && (
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>⭐ Mới</Text>
                    </View>
                )}
            </View>

            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.titleContainer}>
                        <Heading2 style={styles.title}>{bike.name}</Heading2>
                        <View style={styles.locationRow}>
                            <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                            <Text style={styles.locationText}>{bike.location}</Text>
                        </View>
                        <Text style={styles.distanceText}>Cách: {bike.distance}</Text>
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
        </View>
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
    newBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#8B5CF6',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    newBadgeText: {
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