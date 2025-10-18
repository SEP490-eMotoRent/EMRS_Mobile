import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const AvailableBadge: React.FC = () => {
    return (
        <View style={styles.container}>
            <View style={styles.dot} />
            <Text style={styles.text}>Available now</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
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