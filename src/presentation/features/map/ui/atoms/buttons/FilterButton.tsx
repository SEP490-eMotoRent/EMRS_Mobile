import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterButtonProps {
    label: string;
    onPress: () => void;
    isActive?: boolean;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
    label,
    onPress,
    isActive = false,
}) => {
    return (
        <TouchableOpacity
        style={[styles.button, isActive && styles.activeButton]}
        onPress={onPress}
        >
        <Text style={[styles.text, isActive && styles.activeText]}>
            {label} ▾
        </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 25,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: "#333",
    },
    activeButton: {
        backgroundColor: "#b8a4ff",
        borderColor: "#b8a4ff",
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    activeText: {
        color: "#000",
    },
});