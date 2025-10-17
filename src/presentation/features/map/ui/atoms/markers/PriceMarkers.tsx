import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface PriceMarkerProps {
    price: number;
    isSelected?: boolean;
}

export const PriceMarker: React.FC<PriceMarkerProps> = ({ price, isSelected = false }) => {
    return (
        <View style={styles.wrapper}>
            <View style={[styles.container, isSelected && styles.selected]}>
                <Text style={[styles.priceText, isSelected && styles.priceTextSelected]}>${price}</Text>
            </View>
            <View style={[styles.arrow, isSelected && styles.arrowSelected]} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
    },
    container: {
        backgroundColor: "#000",
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 18,
        minWidth: 50,
        maxWidth: 120,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.28,
        shadowRadius: 3,
        elevation: 5,
    },
    selected: {
        backgroundColor: "#b8a4ff",
    },
    priceText: {
        color: "#fff",
        fontWeight: "800",
        fontSize: 14,
    },
    priceTextSelected: {
        color: "#1a1a1a",
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
        marginTop: 0,
    },
    arrowSelected: {
        borderTopColor: "#b8a4ff",
    },
});