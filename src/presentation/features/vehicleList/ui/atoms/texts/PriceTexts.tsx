import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceTextProps {
    price: number;      // Daily rate
    total: number;      // Total price
}

export const PriceText: React.FC<PriceTextProps> = ({ price, total }) => {
    return (
        <View style={styles.container}>
            {/* Daily Rate */}
            <Text style={styles.dailyPrice}>
                {price.toLocaleString('vi-VN')}₫/ngày
            </Text>
            
            {/* Total Price - BIG and CLEAR */}
            <Text style={styles.totalPrice}>
                {total.toLocaleString('vi-VN')}₫
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end",
        gap: 2,
    },
    dailyPrice: {
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: "500",
    },
    totalPrice: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
});