import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PricingCardProps {
    duration: string;
    price: string;
}

export const PricingCard: React.FC<PricingCardProps> = ({ duration, price }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.duration}>{duration}</Text>
            <Text style={styles.price}>{price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
        minWidth: 160,
    },
    duration: {
        color: "#999",
        fontSize: 13,
        marginBottom: 6,
    },
    price: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
});