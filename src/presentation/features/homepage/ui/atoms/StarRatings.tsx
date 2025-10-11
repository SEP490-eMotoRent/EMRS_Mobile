import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StarRatingProps {
    rating?: number;
}

export const StarRating: React.FC<StarRatingProps> = ({ rating = 5 }) => {
    return (
        <View style={styles.starContainer}>
        {[...Array(rating)].map((_, i) => (
            <Text key={i} style={styles.star}>★</Text>
        ))}
        </View>
    );
};

const styles = StyleSheet.create({
    starContainer: {
        flexDirection: 'row',
        gap: 4,
    },
    star: {
        color: '#facc15',
        fontSize: 20,
    },
});