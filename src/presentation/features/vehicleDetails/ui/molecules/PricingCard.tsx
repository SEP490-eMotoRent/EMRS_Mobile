import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PricingCardProps {
    duration: string;
    price: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ duration, price }) => {
    return (
        <View style={styles.card}>
            <Text style={styles.duration}>{duration}</Text>
            <Text style={styles.price}>{price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#000",
        borderWidth: 1,
        borderColor: "#333",
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        minWidth: 130,
        alignItems: "center",
        gap: 6,
    },
    duration: {
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: "500",
    },
    price: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});