import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface City {
    name: string;
    image: string;
}

export const PopularCitiesSection: React.FC = () => {
    const cities: City[] = [
        {
            name: 'Quận 1',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSL22ebAWW1x9jc1ohywLBAi5UCkZq3wSlKKw&s',
        },
        {
            name: 'Quận 3',
            image: 'https://owa.bestprice.vn/images/media/c2f9d615-43f7-4a0a-a58c-5510783b762f-61dfd65dc41c0.png',
        },
        {
            name: 'Tân Bình',
            image: 'https://cdn.xanhsm.com/2025/05/93e733a3-tan-binh-o-dau-4.jpg',
        },
        {
            name: 'Bình Thạnh',
            image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=200&h=200&fit=crop',
        },
        {
            name: 'Quận 7',
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&h=200&fit=crop',
        },
        {
            name: 'Quận 2',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRczEwzo3kIdtFr716BpdpglZn4_Tczrdqfhw&s',
        },
    ];

    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Địa điểm phổ biến</Text>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {cities.map((city, index) => (
                    <TouchableOpacity key={index} style={styles.cityCard} activeOpacity={0.7}>
                        <Image source={{ uri: city.image }} style={styles.cityImage} />
                        <Text style={styles.cityName}>{city.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    section: {
        paddingVertical: 24,
        paddingLeft: 16,
    },
    sectionTitle: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    scrollContent: {
        gap: 16,
        paddingRight: 16,
    },
    cityCard: {
        alignItems: 'center',
        width: 110,
    },
    cityImage: {
        width: 90,
        height: 90,
        borderRadius: 45,
        marginBottom: 8,
        borderWidth: 3,
        borderColor: '#8B5CF6',
    },
    cityName: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
    },
});