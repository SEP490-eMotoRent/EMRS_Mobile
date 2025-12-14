import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

interface RefreshButtonProps {
    onPress: () => void;
}

export const RefreshButton: React.FC<RefreshButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            {/* ✅ Updated: FontAwesome refresh icon */}
            <FontAwesome name="refresh" size={16} color="#fff" style={styles.icon} />
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
        marginRight: 8,
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});