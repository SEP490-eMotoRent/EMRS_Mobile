import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface StatusBadgeProps {
    status: "Pending" | "Approved" | "Rejected" | "Completed" | "Canceled";
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
    const getStatusStyle = () => {
        switch (status) {
        case "Pending":
            return { bg: "#fef3c7", text: "#d97706", label: "Đang chờ" };
        case "Approved":
            return { bg: "#d1fae5", text: "#059669", label: "Đã duyệt" };
        case "Rejected":
            return { bg: "#fee2e2", text: "#dc2626", label: "Từ chối" };
        case "Completed":
            return { bg: "#dbeafe", text: "#2563eb", label: "Hoàn thành" };
        case "Canceled":
            return { bg: "#e5e7eb", text: "#6b7280", label: "Đã hủy" };
        default:
            return { bg: "#f3f4f6", text: "#6b7280", label: status };
        }
    };

    const statusStyle = getStatusStyle();

    return (
        <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
        <Text style={[styles.text, { color: statusStyle.text }]}>
            {statusStyle.label}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        alignSelf: "flex-start",
    },
    text: {
        fontSize: 12,
        fontWeight: "600",
    },
});