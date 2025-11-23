import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

interface PromoBanner {
    id: string;
    title: string;
    description: string;
    discount: string;
    backgroundColor: string;
    image?: string;
}

export const PromotionalBannersSection: React.FC = () => {
    const banners: PromoBanner[] = [
        {
            id: '1',
            title: 'Giảm 10%',
            description: 'Tối đa 50k cho khách hàng đặt xe lần đầu',
            discount: '10%',
            backgroundColor: '#8B5CF6',
        },
        {
            id: '2',
            title: 'Giảm 15%',
            description: 'Cho đơn hàng từ 500k trở lên',
            discount: '15%',
            backgroundColor: '#EC4899',
        },
        {
            id: '3',
            title: 'Miễn phí giao xe',
            description: 'Trong bán kính 5km',
            discount: 'FREE',
            backgroundColor: '#10B981',
        },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>Ưu đãi hiện có</Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {banners.map((banner) => (
                    <TouchableOpacity
                        key={banner.id}
                        style={[styles.banner, { backgroundColor: banner.backgroundColor }]}
                        activeOpacity={0.8}
                    >
                        <View style={styles.bannerContent}>
                            <View style={styles.discountBadge}>
                                <Text style={styles.discountText}>{banner.discount}</Text>
                            </View>
                            <Text style={styles.bannerTitle}>{banner.title}</Text>
                            <Text style={styles.bannerDescription}>{banner.description}</Text>
                        </View>
                        <View style={styles.illustrationContainer}>
                            <Text style={styles.illustration}>🎁</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    scrollContent: {
        paddingHorizontal: 16,
        gap: 12,
    },
    banner: {
        width: 320,
        borderRadius: 16,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        minHeight: 140,
    },
    bannerContent: {
        flex: 1,
    },
    discountBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    discountText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
    bannerTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    bannerDescription: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        lineHeight: 20,
    },
    illustrationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12,
    },
    illustration: {
        fontSize: 48,
    },
});