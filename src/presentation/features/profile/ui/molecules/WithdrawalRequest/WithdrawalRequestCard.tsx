import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { StatusBadge } from "../../atoms/Badges/StatusBadge";

interface WithdrawalRequestCardProps {
    id: string;
    amount: number;
    bankName: string;
    bankAccountNumber: string;
    status: "Pending" | "Approved" | "Rejected" | "Completed" | "Canceled";
    createdAt: Date;
    onPress: () => void;
}

export const WithdrawalRequestCard: React.FC<WithdrawalRequestCardProps> = ({
    amount,
    bankName,
    bankAccountNumber,
    status,
    createdAt,
    onPress,
}) => {
    // Format number with dots as thousand separators
    const formatNumber = (num: number): string => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const formattedDate = createdAt.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });

    const maskedAccount = `****${bankAccountNumber.slice(-4)}`;

    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <View style={styles.header}>
                <Text style={styles.amount}>{formatNumber(amount)}đ</Text>
                <StatusBadge status={status} />
            </View>

            <View style={styles.details}>
                <Text style={styles.bank}>{bankName}</Text>
                <Text style={styles.account}>{maskedAccount}</Text>
            </View>

            <Text style={styles.date}>{formattedDate}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#333",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    amount: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
    details: {
        marginBottom: 8,
    },
    bank: {
        color: "#999",
        fontSize: 14,
        marginBottom: 4,
    },
    account: {
        color: "#ccc",
        fontSize: 14,
    },
    date: {
        color: "#666",
        fontSize: 12,
    },
});