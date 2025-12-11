import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

interface StatusBadgeProps {
    status: "pending" | "booked" | "renting" | "returned" | "completed" | "cancelled";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusConfig = () => {
        switch (status) {
            case "pending":
                return {
                    bg: "rgba(251, 191, 36, 0.15)",
                    text: "#fbbf24",
                    border: "rgba(251, 191, 36, 0.3)",
                    iconName: "clock",
                    label: "Chờ thanh toán",
                };
            case "booked":
                return {
                    bg: "rgba(34, 197, 94, 0.15)",
                    text: "#22c55e",
                    border: "rgba(34, 197, 94, 0.3)",
                    iconName: "check",
                    label: "Đã đặt xe",
                };
            case "renting":
                return {
                    bg: "rgba(59, 130, 246, 0.15)",
                    text: "#3b82f6",
                    border: "rgba(59, 130, 246, 0.3)",
                    iconName: "motorcycle",
                    label: "Đang thuê",
                };
            case "returned":
                return {
                    bg: "rgba(168, 85, 247, 0.15)",
                    text: "#a855f7",
                    border: "rgba(168, 85, 247, 0.3)",
                    iconName: "box",
                    label: "Đã trả xe",
                };
            case "completed":
                return {
                    bg: "rgba(100, 116, 139, 0.15)",
                    text: "#94a3b8",
                    border: "rgba(100, 116, 139, 0.3)",
                    iconName: "check-circle",
                    label: "Hoàn thành",
                };
            case "cancelled":
                return {
                    bg: "rgba(239, 68, 68, 0.15)",
                    text: "#ef4444",
                    border: "rgba(239, 68, 68, 0.3)",
                    iconName: "times",
                    label: "Đã hủy",
                };
        }
    };

    const config = getStatusConfig();

    return (
        <View
            style={[
                styles.badge,
                {
                    backgroundColor: config.bg,
                    borderColor: config.border,
                },
            ]}
        >
            <Icon name={config.iconName} size={11} color={config.text} solid />
            <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 8,
        borderWidth: 1,
        gap: 6,
        alignSelf: "flex-start",
    },
    text: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});