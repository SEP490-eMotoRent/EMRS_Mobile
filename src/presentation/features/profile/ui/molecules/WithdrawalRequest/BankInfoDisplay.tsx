import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BankInfoDisplayProps {
    bankName: string;
    accountNumber: string;
    accountName: string;
}

export const BankInfoDisplay: React.FC<BankInfoDisplayProps> = ({
        bankName,
        accountNumber,
        accountName,
    }) => {
        return (
            <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Ngân hàng</Text>
                <Text style={styles.value}>{bankName}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Số tài khoản</Text>
                <Text style={styles.value}>{accountNumber}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>Tên tài khoản</Text>
                <Text style={styles.value}>{accountName}</Text>
            </View>
            </View>
        );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        gap: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        color: "#999",
        fontSize: 14,
    },
    value: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
});