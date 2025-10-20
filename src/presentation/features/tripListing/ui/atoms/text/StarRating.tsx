import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StarRatingProps {
    rating: number; // 0-5
}

export const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Text key={star} style={styles.star}>
                    {star <= rating ? "⭐" : "☆"}
                </Text>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: 4,
    },
    star: {
        fontSize: 16,
        color: "#fbbf24",
    },
});