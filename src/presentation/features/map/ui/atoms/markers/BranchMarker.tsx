import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BranchMarkerProps {
    isSelected?: boolean;
}

export const BranchMarker: React.FC<BranchMarkerProps> = ({ isSelected = false }) => {
    return (
        <View style={styles.container}>
            <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
                <FontAwesome 
                    name="motorcycle" 
                    size={16} 
                    color={isSelected ? "#1a1a1a" : "#fff"} 
                />
            </View>
            {/* Pointed tail like LocationPinMarker */}
            <View style={[styles.pointer, isSelected && styles.pointerSelected]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    bubble: {
        backgroundColor: "#000",
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 3,
    },
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
    },
    pointer: {
        marginTop: -4, // Overlap for seamless connection
        width: 0,
        height: 0,
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 18, // Nice long pointer
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
    },
    pointerSelected: {
        borderTopColor: "#b8a4ff",
    },
});