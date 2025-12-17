import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

/**
 * LocationPinMarker - Optimized marker with proper icon sizing
 * 
 * FIXES:
 * 1. Bubble: 32×32 (compact but visible) ✅
 * 2. Icon: 12 (properly sized) ✅
 * 3. Padding: 3px (prevents cropping) ✅
 * 4. Pointer: BIGGER for clarity (8px wider, 12px taller)
 */
export const LocationPinMarker: React.FC = React.memo(() => {
    return (
        <View 
            style={styles.container}
            pointerEvents="none"
        >
            <View style={styles.bubble}>
                <FontAwesome 
                    name="flag" 
                    size={12}
                    color="#fff"
                />
            </View>
            <View style={styles.pointer} />
        </View>
    );
});

LocationPinMarker.displayName = 'LocationPinMarker';

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
        borderColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
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
        borderTopColor: "#10B981",
    },
});