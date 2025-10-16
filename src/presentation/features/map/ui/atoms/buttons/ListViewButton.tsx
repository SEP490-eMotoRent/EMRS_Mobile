import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ListViewButtonProps {
    onPress: () => void;
}

export const ListViewButton: React.FC<ListViewButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>☰ List View</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#e8d5ff",
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        color: "#000",
        fontWeight: "600",
        fontSize: 16,
    },
});