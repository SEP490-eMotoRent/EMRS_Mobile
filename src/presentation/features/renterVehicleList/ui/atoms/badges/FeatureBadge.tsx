import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface FeatureBadgeProps {
    label: string;
}

export const FeatureBadge: React.FC<FeatureBadgeProps> = ({ label }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "rgba(168, 85, 247, 0.2)",
    },
    text: {
        color: "#c084fc",
        fontSize: 11,
        fontWeight: "500",
    },
});