import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SpecItemProps {
    icon: string;
    label: string;
    iconColor?: string;
}

export const SpecItem: React.FC<SpecItemProps> = ({ icon, label, iconColor }) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.icon, iconColor && { color: iconColor }]}>{icon}</Text>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 8,
    },
    icon: {
        fontSize: 14,
    },
    label: {
        color: "#d1d5db",
        fontSize: 11,
        fontWeight: "500",
    },
});
