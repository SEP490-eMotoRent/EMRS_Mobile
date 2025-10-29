import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SpecItemProps {
    icon: string;
    label: string;
    iconColor?: string;
}

export const SpecItem: React.FC<SpecItemProps> = ({ icon, label, iconColor = "#fff" }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    icon: {
        fontSize: 16,
    },
    label: {
        color: "#d1d5db",
        fontSize: 12,
        fontWeight: "500",
        flex: 1,
    },
});