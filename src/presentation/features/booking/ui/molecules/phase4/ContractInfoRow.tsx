import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContractInfoRowProps {
    label: string;
    value: string;
    highlight?: boolean;
}

export const ContractInfoRow: React.FC<ContractInfoRowProps> = ({ 
    label, 
    value, 
    highlight = false 
}) => {
    return (
        <View style={styles.row}>
            <Text style={styles.label}>{label}</Text>
            <Text style={[styles.value, highlight && styles.highlightValue]}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8,
    },
    label: {
        color: "#999",
        fontSize: 13,
    },
    value: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    highlightValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
});