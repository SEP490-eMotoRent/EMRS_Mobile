import React from "react";
import { StyleSheet, View } from "react-native";

interface ProgressLineProps {
    isCompleted: boolean;
}

export const ProgressLine: React.FC<ProgressLineProps> = ({ isCompleted }) => {
    return (
        <View style={[styles.line, isCompleted && styles.completedLine]} />
    );
};

const styles = StyleSheet.create({
    line: {
        flex: 1,
        height: 2,
        backgroundColor: "#333",
        marginHorizontal: 8,
    },
    completedLine: {
        backgroundColor: "#d4c5f9",
    },
});
