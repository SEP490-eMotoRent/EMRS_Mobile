import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ProgressBar } from "../../atoms/progress/ProgressBar";

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
                    return 100;
                }
                return prev + 10;
            });
        }, 200);

        return () => clearInterval(interval);
    }, []);

    // Separate useEffect to handle completion callback
    useEffect(() => {
        if (progress === 100) {
            // Use setTimeout to defer the callback to the next tick
            // This prevents updating parent state during render
            const timer = setTimeout(() => {
                onComplete();
            }, 0);

            return () => clearTimeout(timer);
        }
    }, [progress, onComplete]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Vui lòng đợi...</Text>
                <View style={styles.statusIcon}>
                    <View style={styles.checkmark}>
                        <View style={styles.checkmarkStem} />
                        <View style={styles.checkmarkKick} />
                    </View>
                </View>
            </View>
            <Text style={styles.subtitle}>
                Vui lòng đợi trong khi chúng tôi chuẩn bị hợp đồng thuê xe của bạn
            </Text>
            <View style={styles.progressContainer}>
                <ProgressBar
                    progress={progress}
                    label={progress === 100 ? "Hoàn tất!" : ""}
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
        backgroundColor: "rgba(34, 197, 94, 0.15)",
        borderWidth: 2,
        borderColor: "#22c55e",
        justifyContent: "center",
        alignItems: "center",
    },
    checkmark: {
        width: 12,
        height: 12,
        position: "relative",
    },
    checkmarkStem: {
        position: "absolute",
        width: 2,
        height: 8,
        backgroundColor: "#22c55e",
        left: 7,
        top: 2,
        transform: [{ rotate: "45deg" }],
    },
    checkmarkKick: {
        position: "absolute",
        width: 2,
        height: 4,
        backgroundColor: "#22c55e",
        left: 3,
        top: 6,
        transform: [{ rotate: "-45deg" }],
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