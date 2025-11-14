import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ProgressDotProps {
    isActive: boolean;
    isCompleted: boolean;
    stepNumber?: number;
}

export const ProgressDot: React.FC<ProgressDotProps> = ({ 
    isActive, 
    isCompleted,
    stepNumber 
}) => {
    return (
        <View style={[
            styles.container,
            isActive && styles.activeContainer,
            isCompleted && styles.completedContainer,
        ]}>
            <View style={[
                styles.dot,
                isActive && styles.activeDot,
                isCompleted && styles.completedDot,
            ]}>
                {isCompleted ? (
                    <Text style={styles.checkmark}>✓</Text>
                ) : (
                    stepNumber && <Text style={[
                        styles.number,
                        isActive && styles.numberActive
                    ]}>{stepNumber}</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "transparent",
    },
    activeContainer: {
        backgroundColor: "rgba(212, 197, 249, 0.15)",
    },
    completedContainer: {
        backgroundColor: "transparent",
    },
    dot: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#2a2a2a",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "#333",
    },
    activeDot: {
        backgroundColor: "#d4c5f9",
        borderColor: "#d4c5f9",
        shadowColor: "#d4c5f9",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 8,
    },
    completedDot: {
        backgroundColor: "#d4c5f9",
        borderColor: "#d4c5f9",
    },
    number: {
        color: "#666",
        fontSize: 14,
        fontWeight: "700",
    },
    numberActive: {
        color: "#000",
    },
    checkmark: {
        color: "#000",
        fontSize: 16,
        fontWeight: "900",
    },
});