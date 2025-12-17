import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

interface BranchMarkerProps {
    isSelected?: boolean;
}

/**
 * BranchMarker - EXACT same approach as LocationPinMarker
 * 
 * Copied from LocationPin that WORKS:
 * - Container: 36×48 ✅
 * - Bubble: 32×32 ✅
 * - Icon: 12 ✅
 * - Padding: 3 ✅
 * - Pointer: 8×12 ✅
 */
export const BranchMarker: React.FC<BranchMarkerProps> = React.memo(({ isSelected = false }) => {
    return (
        <View 
            style={styles.container}
            pointerEvents="box-none"
        >
            <View style={[styles.bubble, isSelected && styles.bubbleSelected]}>
                <FontAwesome 
                    name="motorcycle" 
                    size={12}
                    color={isSelected ? "#000" : "#fff"}
                />
            </View>
            <View style={[styles.pointer, isSelected && styles.pointerSelected]} />
        </View>
    );
});

BranchMarker.displayName = 'BranchMarker';

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: 36,
        height: 48,
    },
    bubble: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#1a1a1a",
        borderWidth: 2,
        borderColor: "#b8a4ff",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
        borderColor: "#fff",
        shadowOpacity: 0.6,
        shadowRadius: 6,
        elevation: 8,
    },
    pointer: {
        width: 0,
        height: 0,
        marginTop: -2,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#b8a4ff",
    },
    pointerSelected: {
        borderTopColor: "#fff",
    },
});