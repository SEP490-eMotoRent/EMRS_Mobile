import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const LocationPinMarker: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Circle with flag */}
            <View style={styles.bubble}>
                <FontAwesome name="flag" size={16} color="#b0b0b0" />
            </View>

            {/* Pointed tail/stem */}
            <View style={styles.pointer} />
            
            {/* INVISIBLE SPACER to prevent clipping */}
            <View style={styles.spacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
    },

    bubble: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1a1a1a",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },

    pointer: {
        marginTop: -4,
        width: 0,
        height: 0,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 16,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#1a1a1a",
    },
    
    spacer: {
        height: 5, // Extra space so Maps doesn't clip the pointer
        width: 1,
    },
});