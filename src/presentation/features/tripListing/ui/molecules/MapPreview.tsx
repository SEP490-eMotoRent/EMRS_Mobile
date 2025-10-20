import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface MapPreviewProps {
    location: string;
}

export const MapPreview: React.FC<MapPreviewProps> = ({ location }) => {
    return (
        <View style={styles.container}>
            <View style={styles.mapPlaceholder}>
                <Text style={styles.mapText}>🗺️ Map</Text>
            </View>
            <View style={styles.locationBadge}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>Live Location</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "relative",
        height: 120,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        marginVertical: 12,
        overflow: "hidden",
    },
    mapPlaceholder: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    mapText: {
        color: "#666",
        fontSize: 14,
    },
    locationBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 6,
    },
    locationIcon: {
        fontSize: 12,
    },
    locationText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600",
    },
});