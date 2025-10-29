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
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
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