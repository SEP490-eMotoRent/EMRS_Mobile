import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AvailableBadge: React.FC = () => {
    return (
        <View style={styles.badge}>
            <View style={styles.dot} />
            <Text style={styles.text}>Available now</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        gap: 6,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#22c55e",
    },
    text: {
        color: "#22c55e",
        fontSize: 12,
        fontWeight: "600",
    },
});