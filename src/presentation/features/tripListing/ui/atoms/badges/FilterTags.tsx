import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface FilterTagProps {
    label: string;
    count?: number;
    isActive: boolean;
    onPress: () => void;
}

export const FilterTag: React.FC<FilterTagProps> = ({ label, count, isActive, onPress }) => {
    const displayText = count !== undefined ? `${label} ${count}` : label;
    
    return (
        <TouchableOpacity 
            style={[styles.tag, isActive && styles.activeTag]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text 
                style={[styles.label, isActive && styles.activeLabel]}
                numberOfLines={1}
            >
                {displayText}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tag: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        backgroundColor: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#333",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    activeTag: {
        backgroundColor: "#d4c5f9",
        borderColor: "#d4c5f9",
    },
    label: {
        color: "#999",
        fontSize: 12,
        fontWeight: "600",
    },
    activeLabel: {
        color: "#000",
    },
});