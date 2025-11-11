import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface ErrorStateProps {
    message?: string;
    onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
    // Log technical details for debugging but don't show to user
    if (message) {
        console.error("Technical error details:", message);
    }

    // User-friendly Vietnamese message - no technical jargon
    const userFriendlyMessage = "Không thể tải dữ liệu xe. Vui lòng thử lại.";

    return (
        <View style={styles.container}>
        <View style={styles.iconContainer}>
            <Text style={styles.icon}>⚠️</Text>
        </View>
        
        <Text style={styles.title}>Rất tiếc! Đã có lỗi xảy ra</Text>
        
        <Text style={styles.message}>{userFriendlyMessage}</Text>
        
        <TouchableOpacity 
            style={styles.button} 
            onPress={onRetry}
            activeOpacity={0.8}
        >
            <Text style={styles.buttonText}>Thử Lại</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 32,
        paddingVertical: 60,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: "#FFB800",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 24,
    },
    icon: {
        fontSize: 48,
    },
    title: {
        fontSize: 20,
        fontWeight: "700",
        color: "#FFFFFF",
        marginBottom: 12,
        textAlign: "center",
    },
    message: {
        fontSize: 15,
        color: "#B8B8B8",
        textAlign: "center",
        lineHeight: 22,
        marginBottom: 32,
    },
    button: {
        backgroundColor: "#D8B4FE",
        paddingHorizontal: 48,
        paddingVertical: 16,
        borderRadius: 28,
        minWidth: 160,
    },
    buttonText: {
        color: "#000000",
        fontSize: 16,
        fontWeight: "600",
        textAlign: "center",
    },
});