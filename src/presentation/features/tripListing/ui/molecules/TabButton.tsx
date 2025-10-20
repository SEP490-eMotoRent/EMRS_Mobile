import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
}

export const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onPress }) => {
    return (
        <TouchableOpacity 
            style={[styles.tab, isActive && styles.activeTab]} 
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 12,
        borderBottomWidth: 2,
        borderBottomColor: "transparent",
    },
    activeTab: {
        borderBottomColor: "#d4c5f9",
    },
    label: {
        color: "#666",
        fontSize: 14,
        fontWeight: "600",
    },
    activeLabel: {
        color: "#fff",
    },
});