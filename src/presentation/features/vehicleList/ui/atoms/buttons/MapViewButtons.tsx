import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface MapViewButtonProps {
    onPress: () => void;
}

export const MapViewButton: React.FC<MapViewButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.9}>
            <Text style={styles.icon}>🗺️</Text>
            <Text style={styles.text}>Map View</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 24,
        gap: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        fontSize: 16,
    },
    text: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
});