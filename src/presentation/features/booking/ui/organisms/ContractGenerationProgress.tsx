import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "../atoms/progress/ProgressBar";

interface ContractGenerationProgressProps {
    onComplete: () => void;
}

export const ContractGenerationProgress: React.FC<ContractGenerationProgressProps> = ({ 
    onComplete 
}) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    onComplete();
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Generating digital contract...</Text>
                <View style={styles.statusIcon}>
                    <Text style={styles.statusIconText}>✓</Text>
                </View>
            </View>
            <Text style={styles.subtitle}>
                Please wait while we prepare your rental agreement
            </Text>
            <View style={styles.progressContainer}>
                <ProgressBar 
                    progress={progress} 
                    label={progress === 100 ? "Complete!" : ""} 
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    statusIcon: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "rgba(34, 197, 94, 0.2)",
        borderWidth: 2,
        borderColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
    },
    statusIconText: {
        color: "#22c55e",
        fontSize: 12,
        fontWeight: "700",
    },
    subtitle: {
        color: "#999",
        fontSize: 13,
        marginBottom: 16,
    },
    progressContainer: {
        marginTop: 8,
    },
});
