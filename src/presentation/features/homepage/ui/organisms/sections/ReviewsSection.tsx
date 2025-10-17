import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ReviewCard } from '../../molecules/cards/ReviewCard';

export const ReviewsSection: React.FC = () => {
    const reviews = [
        {
        title: "Perfect for City Commuting",
        content: "Rented an electric bike from eMotoRent for my daily commute and it was fantastic! The booking process was smooth, and the bike was delivered right to my doorstep. Highly recommend for anyone looking for eco-friendly transportation!",
        author: "Sarah L.",
        rating: 5,
        },
        {
        title: "Amazing Experience",
        content: "The flexibility of eMotoRent is unmatched. I needed a bike for just a weekend trip, and their week-to-week plan was perfect. No long-term commitment, no hassle. The bike was well-maintained and fun to ride!",
        author: "Michael T.",
        rating: 5,
        },
        {
        title: "Best Rental Service",
        content: "I've tried several bike rental services, but eMotoRent stands out. The customer service is excellent, bikes are always in great condition, and the pricing is transparent. Will definitely use again!",
        author: "Jennifer R.",
        rating: 5,
        },
    ];

    return (
        <View style={styles.section}>
        <Text style={styles.sectionTitle}>Reviews</Text>
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
        >
            {reviews.map((review, index) => (
            <ReviewCard key={index} {...review} />
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
    scrollContent: {
        paddingRight: 16,
    },
});