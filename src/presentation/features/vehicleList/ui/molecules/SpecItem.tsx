import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface SpecItemProps {
    icon: string;
    label: string;
    iconColor?: string;
}

export const SpecItem: React.FC<SpecItemProps> = ({
    icon,
    label,
    iconColor = "#999"
}) => {
    return (
        <View style={styles.container}>
            <Text style={[styles.icon, { color: iconColor }]}>
                {icon}
            </Text>
            <Text style={styles.label}>
                {label}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
        gap: 6,
    },
    icon: {
        fontSize: 16,
        lineHeight: 16,
    },
    label: {
        color: "#e5e7eb",
        fontSize: 13,
        fontWeight: "500",
        lineHeight: 16,
    },
});