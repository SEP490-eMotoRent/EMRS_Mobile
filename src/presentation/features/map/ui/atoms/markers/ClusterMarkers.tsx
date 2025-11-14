import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ClusterMarkerProps {
    count: number;
    isSelected?: boolean;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, isSelected = false }) => {
    // Size scales with count (min 50, max 80)
    const size = Math.min(50 + Math.log(count) * 10, 80);
    const fontSize = size > 65 ? 18 : 16;
    
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            {/* Outer ring */}
            <View style={[
                styles.outerRing,
                isSelected && styles.outerRingSelected,
                { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2 }
            ]} />
            
            {/* Main bubble */}
            <View style={[
                styles.bubble,
                isSelected && styles.bubbleSelected,
                { width: size, height: size, borderRadius: size / 2 }
            ]}>
                <Text style={[styles.count, { fontSize }]}>
                    {count}
                </Text>
            </View>
            
            {/* Spacer */}
            <View style={styles.spacer} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    
    outerRing: {
        position: "absolute",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        backgroundColor: "transparent",
    },
    
    outerRingSelected: {
        borderColor: "rgba(184, 164, 255, 0.6)",
        borderWidth: 3,
    },
    
    bubble: {
        backgroundColor: "#5E35B1", // Purple for clusters
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 3,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 8,
    },
    
    bubbleSelected: {
        backgroundColor: "#b8a4ff",
        borderWidth: 4,
        shadowColor: "#b8a4ff",
        shadowOpacity: 0.6,
        elevation: 10,
    },
    
    count: {
        color: "#fff",
        fontWeight: "800",
    },
    
    spacer: {
        height: 5,
        width: 1,
    },
});