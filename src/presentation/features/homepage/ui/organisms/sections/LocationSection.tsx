import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LocationCard } from '../../molecules/cards/LocationCard';

export const LocationsSection: React.FC = () => {
    const locations = [
        {
            state: "Quận 1",
            city: "Bến Thành",
            image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=300&fit=crop"
        },
        {
            state: "Quận 1",
            city: "Nhà thờ Đức Bà",
            image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop"
        },
        {
            state: "Quận 1",
            city: "Phố đi bộ Nguyễn Huệ",
            image: "https://images.unsplash.com/photo-1601581874831-8a79c50e3d4a?w=400&h=300&fit=crop"
        },
        {
            state: "Quận 7",
            city: "Crescent Mall",
            image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop"
        },
        {
            state: "Quận 2",
            city: "Landmark 81",
            image: "https://images.unsplash.com/photo-1565967511849-76a60a516170?w=400&h=300&fit=crop"
        }
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa điểm nổi bật tại TP.HCM</Text>
            <Text style={styles.locationsSubtitle}>
                Khám phá những điểm đến nổi tiếng tại Sài Gòn với xe máy điện. Nhận xe tại các trung tâm tiện lợi và bắt đầu hành trình xanh của bạn.
            </Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {locations.map((location, index) => (
                    <LocationCard key={index} {...location} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 32,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        color: '#ffffff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    locationsSubtitle: {
        color: '#9ca3af',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    scrollContent: {
        paddingRight: 16,
    },
});