import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ReviewCardProps {
    content: string;
    author: string;
    rating: number;
}

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
            <Text 
                key={star} 
                style={[
                    styles.star,
                    star <= rating ? styles.starFilled : styles.starEmpty
                ]}
            >
                {star <= rating ? "★" : "☆"}
            </Text>
        ))}
    </View>
);

export const ReviewCard: React.FC<ReviewCardProps> = ({
    content,
    author,
    rating,
}) => {
    return (
        <View style={styles.card}>
            <StarRating rating={rating} />
            
            <Text style={styles.content} numberOfLines={4}>
                {content}
            </Text>
            
            <Text style={styles.author}>{author}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 20,
        marginRight: 16,
        width: 280,
    },
    starsContainer: {
        flexDirection: 'row',
        gap: 4,
        marginBottom: 16,
    },
    star: {
        fontSize: 20,
    },
    starFilled: {
        color: '#fbbf24',
    },
    starEmpty: {
        color: '#444',
    },
    content: {
        color: '#ffffff',
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 16,
    },
    author: {
        color: '#999999',
        fontSize: 14,
    },
});