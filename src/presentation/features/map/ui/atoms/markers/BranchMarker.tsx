import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BranchMarkerProps {
    isSelected?: boolean;
}

export const BranchMarker: React.FC<BranchMarkerProps> = ({ isSelected = false }) => {
    return (
        <View style={styles.container}>
            {/* Circle bubble - working from original */}
            <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
                <FontAwesome 
                    name="motorcycle" 
                    size={18} // Slightly bigger for better visibility
                    color={isSelected ? "#000" : "#fff"} 
                />
            </View>
            
            {/* Pointed tail */}
            <View style={[styles.pointer, isSelected && styles.pointerSelected]} />
            
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
        width: 42, // Slightly larger for better proportions
        height: 42,
        borderRadius: 21, // Perfect circle
        backgroundColor: "#000",
        alignItems: "center",
        justifyContent: "center",
        // Clean shadow that doesn't distort
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4,
    },
    
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
        // Slightly stronger shadow when selected
        elevation: 6,
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
        borderTopColor: "#000",
    },
    
    pointerSelected: {
        borderTopColor: "#b8a4ff",
    },
    
    spacer: {
        height: 5,
        width: 1,
    },
});