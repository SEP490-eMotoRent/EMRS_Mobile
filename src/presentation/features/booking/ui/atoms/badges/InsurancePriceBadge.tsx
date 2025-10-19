import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsurancePriceBadgeProps {
    price: string;
    color: string;
}

export const InsurancePriceBadge: React.FC<InsurancePriceBadgeProps> = ({ price, color }) => {
    return (
        <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.text}>{price}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        alignSelf: 'flex-end',
    },
    text: {
        color: "#000",
        fontSize: 13,
        fontWeight: "700",
    },
});