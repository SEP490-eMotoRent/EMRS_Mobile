import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressDotProps {
    isActive: boolean;
    isCompleted: boolean;
}

export const ProgressDot: React.FC<ProgressDotProps> = ({ isActive, isCompleted }) => {
    return (
        <View style={[
            styles.dot,
            isActive && styles.activeDot,
            isCompleted && styles.completedDot,
        ]} />
    );
};

const styles = StyleSheet.create({
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#333",
    },
    activeDot: {
        backgroundColor: "#d4c5f9",
        width: 16,
        height: 16,
        borderRadius: 8,
    },
    completedDot: {
        backgroundColor: "#d4c5f9",
    },
});