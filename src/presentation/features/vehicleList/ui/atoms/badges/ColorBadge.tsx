import React from "react";
import { StyleSheet, View } from "react-native";

interface ColorBadgeProps {
    color: string;
}

export const ColorBadge: React.FC<ColorBadgeProps> = ({ color }) => {
    return (
        <View style={[styles.badge, { backgroundColor: color }]} />
    );
};

const styles = StyleSheet.create({
    badge: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#fff",
    },
});