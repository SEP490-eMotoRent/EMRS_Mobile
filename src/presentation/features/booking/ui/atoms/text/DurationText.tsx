import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DurationTextProps {
    duration: string;
}

export const DurationText: React.FC<DurationTextProps> = ({ duration }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.label}>Duration</Text>
            <Text style={styles.value}>{duration}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 16,
        paddingHorizontal: 16,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        marginBottom: 16,
    },
    label: {
        color: "#999",
        fontSize: 14,
    },
    value: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
});