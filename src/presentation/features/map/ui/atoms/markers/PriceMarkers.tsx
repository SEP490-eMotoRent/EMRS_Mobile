import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceMarkerProps {
    price: number;
    isSelected?: boolean;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ 
    price,
    isSelected = false
}) => {
    return (
        <View style={[styles.container, isSelected && styles.selected]}>
        <Text style={styles.priceText}>${price}</Text>
        <View style={styles.arrow} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 50,
    },
    selected: {
        backgroundColor: "#b8a4ff",
        borderColor: "#b8a4ff",
    },
    priceText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },
    arrow: {
        position: "absolute",
        bottom: -8,
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 8,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
    },
});