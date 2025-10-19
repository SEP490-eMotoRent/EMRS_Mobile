import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface CostRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
}

export const CostRow: React.FC<CostRowProps> = ({ label, value, isTotal = false }) => {
    return (
        <View style={[styles.row, isTotal && styles.totalRow]}>
            <Text style={[styles.label, isTotal && styles.totalLabel]}>{label}</Text>
            <Text style={[styles.value, isTotal && styles.totalValue]}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "#333",
        marginTop: 8,
        paddingTop: 16,
    },
    label: {
        color: "#999",
        fontSize: 14,
    },
    totalLabel: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    value: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },
    totalValue: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});
