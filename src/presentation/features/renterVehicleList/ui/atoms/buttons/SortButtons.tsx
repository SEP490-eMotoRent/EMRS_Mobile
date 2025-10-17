import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SortButtonProps {
    label: string;
    onPress: () => void;
}

export const SortButton: React.FC<SortButtonProps> = ({ label, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.icon}>▼</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
        gap: 8,
    },
    label: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },
    icon: {
        color: "#999",
        fontSize: 10,
    },
});