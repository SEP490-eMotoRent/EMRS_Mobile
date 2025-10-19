import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusIconProps {
    type: "success" | "info";
}

export const StatusIcon: React.FC<StatusIconProps> = ({ type }) => {
    const icon = type === "success" ? "✓" : "ⓘ";
    const color = type === "success" ? "#22c55e" : "#999";
    
    return (
        <View style={[styles.container, { borderColor: color }]}>
            <Text style={[styles.icon, { color }]}>{icon}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 10,
    },
    icon: {
        fontSize: 12,
        fontWeight: "700",
    },
});