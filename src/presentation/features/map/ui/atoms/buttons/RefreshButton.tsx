import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface RefreshButtonProps {
    onPress: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.icon}>🔄</Text>
        <Text style={styles.text}>Refresh</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#333",
    },
    icon: {
        fontSize: 16,
        marginRight: 6,
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});