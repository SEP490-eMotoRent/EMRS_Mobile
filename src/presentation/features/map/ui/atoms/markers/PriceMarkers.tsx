import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceMarkerProps {
    price: number;
    isSelected?: boolean;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ price, isSelected = false }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
                <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>${price}</Text>
            </View>
            <View style={[styles.arrow, isSelected && styles.arrowSelected]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    bubble: {
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
    },
    priceText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 13,
    },
    priceTextSelected: {
        color: "#1a1a1a",
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
    },
    arrowSelected: {
        borderTopColor: "#b8a4ff",
    },
});