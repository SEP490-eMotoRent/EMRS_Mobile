import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface WalletBalanceProps {
    currentBalance: string;
    afterBalance: string;
    isSufficient: boolean;
    onAddFunds?: () => void;
}

export const WalletBalance: React.FC<WalletBalanceProps> = ({
    currentBalance,
    afterBalance,
    isSufficient,
    onAddFunds,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.label}>Current balance</Text>
                <View style={styles.rightSection}>
                    <Text style={styles.balance}>{currentBalance}</Text>
                    {onAddFunds && (
                        <TouchableOpacity onPress={onAddFunds}>
                            <Text style={styles.addFunds}>Add funds</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
            
            <View style={styles.row}>
                <Text style={styles.label}>After this booking</Text>
                <Text style={styles.balance}>{afterBalance}</Text>
            </View>
            
            {isSufficient && (
                <View style={styles.statusRow}>
                    <Text style={styles.statusIcon}>✓</Text>
                    <Text style={styles.statusText}>Sufficient balance for this booking</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 12,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    rightSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },
    label: {
        color: "#999",
        fontSize: 13,
    },
    balance: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    addFunds: {
        color: "#d4c5f9",
        fontSize: 13,
        fontWeight: "600",
    },
    statusRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    statusIcon: {
        color: "#22c55e",
        fontSize: 14,
        marginRight: 6,
    },
    statusText: {
        color: "#22c55e",
        fontSize: 13,
        fontWeight: "500",
    },
});