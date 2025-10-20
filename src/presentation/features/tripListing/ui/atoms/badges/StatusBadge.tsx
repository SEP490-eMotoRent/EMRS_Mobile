import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface StatusBadgeProps {
    status: "confirmed" | "returned" | "renting" | "completed" | "cancelled";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
            case "renting":
                return { bg: "rgba(34, 197, 94, 0.15)", text: "#22c55e", dot: true, label: "RENTING" };
            case "confirmed":
                return { bg: "rgba(59, 130, 246, 0.15)", text: "#3b82f6", dot: true, label: "CONFIRMED" };
            case "returned":
                return { bg: "rgba(168, 85, 247, 0.15)", text: "#a855f7", dot: false, label: "RETURNED" };
            case "completed":
                return { bg: "rgba(100, 116, 139, 0.15)", text: "#64748b", dot: false, label: "COMPLETED" };
            case "cancelled":
                return { bg: "rgba(239, 68, 68, 0.15)", text: "#ef4444", dot: false, label: "CANCELLED" };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
            {statusStyle.dot && <View style={[styles.dot, { backgroundColor: statusStyle.text }]} />}
            <Text style={[styles.text, { color: statusStyle.text }]}>{statusStyle.label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 6,
        alignSelf: "flex-start",
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    text: {
        fontSize: 11,
        fontWeight: "700",
        textTransform: "uppercase",
    },
});