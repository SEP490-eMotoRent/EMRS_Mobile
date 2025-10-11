import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StarRating } from '../../atoms/StarRatings';

interface ReviewCardProps {
    title: string;
    content: string;
    author: string;
    rating?: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
    title,
    content,
    author,
    rating = 5
    }) => {
    return (
        <View style={styles.reviewCard}>
        <StarRating rating={rating} />
        <Text style={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewContent}>{content}</Text>
        <Text style={styles.reviewAuthor}>{author}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    reviewCard: {
        width: 320,
        backgroundColor: 'rgba(31, 41, 55, 0.5)',
        borderRadius: 16,
        padding: 24,
        marginRight: 16,
    },
    reviewTitle: {
        color: '#ffffff',
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 12,
    },
    reviewContent: {
        color: '#d1d5db',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 16,
    },
    reviewAuthor: {
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '500',
    },
});