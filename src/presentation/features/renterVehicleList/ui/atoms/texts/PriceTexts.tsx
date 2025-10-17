import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceTextProps {
    price: number;
    total: number;
}

export const PriceText: React.FC<PriceTextProps> = ({ price, total }) => {
    return (
        <View style={styles.container}>
            <View style={styles.priceRow}>
                <Text style={styles.price}>${price}</Text>
                <Text style={styles.period}>/day</Text>
            </View>
            <Text style={styles.total}>Total ${total}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "flex-end",
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    price: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    period: {
        color: "#999",
        fontSize: 13,
        marginLeft: 2,
    },
    total: {
        color: "#999",
        fontSize: 13,
        marginTop: 2,
    },
});