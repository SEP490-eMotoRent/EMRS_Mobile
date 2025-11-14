import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const LocationPinMarker: React.FC = () => {
    return (
        <View style={styles.container}>
            {/* Circle with flag - black background, white flag */}
            <View style={styles.bubble}>
                <FontAwesome 
                    name="flag" 
                    size={18} // Bigger for better visibility
                    color="#fff" // WHITE flag on black background
                />
            </View>

            {/* Pointed tail */}
            <View style={styles.pointer} />
            
            {/* Spacer to prevent clipping */}
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
        width: 42, // Match branch marker size
        height: 42,
        borderRadius: 21, // Perfect circle
        backgroundColor: "#1a1a1a", // Dark gray (same as original)
        alignItems: "center",
        justifyContent: "center",
        // Clean shadow
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },

    pointer: {
        marginTop: -4,
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 18,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#1a1a1a",
    },
    
    spacer: {
        height: 5,
        width: 1,
    },
});