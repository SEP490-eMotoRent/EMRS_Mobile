import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressBarProps {
    progress: number; // 0 to 100
    label: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
    return (
        <View style={styles.container}>
            <View style={styles.barBackground}>
                <View style={[styles.barFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    barBackground: {
        width: "100%",
        height: 6,
        backgroundColor: "#333",
        borderRadius: 3,
        overflow: "hidden",
        marginBottom: 8,
    },
    barFill: {
        height: "100%",
        backgroundColor: "#22c55e",
        borderRadius: 3,
    },
    label: {
        color: "#999",
        fontSize: 12,
        textAlign: "right",
    },
});
