import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface SortDropdownProps {
    value: string;
    onPress: () => void;
}

export const SortDropdown: React.FC<SortDropdownProps> = ({ value, onPress }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
            <Text style={styles.text}>{value}</Text>
            <Text style={styles.icon}>▼</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 5,
        gap: 8,
    },
    text: {
        color: "#fff",
        fontSize: 7,
        fontWeight: "500",
    },
    icon: {
        color: "#999",
        fontSize: 10,
    },
});
