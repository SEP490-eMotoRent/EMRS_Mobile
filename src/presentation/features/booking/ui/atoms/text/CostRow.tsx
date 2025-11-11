import React from "react";
import { Text, View, StyleSheet } from "react-native";

interface CostRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
    highlight?: boolean;
    highlightValue?: boolean; // ← MỚI: Highlight riêng cho value
}

export const CostRow: React.FC<CostRowProps> = ({
        label,
        value,
        isTotal = false,
        highlight = false,
        highlightValue = false,
    }) => {
        return (
            <View style={styles.row}>
            <Text
                style={[
                styles.label,
                isTotal && styles.totalLabel,
                highlight && styles.highlightLabel,
                ]}
            >
                {label}
            </Text>
            <Text
                style={[
                styles.value,
                isTotal && styles.totalValue,
                (highlight || highlightValue) && styles.highlightValue,
                ]}
            >
                {value}
            </Text>
            </View>
        );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    label: {
        color: "#ccc",
        fontSize: 15,
    },
    value: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "500",
    },
    totalLabel: {
        color: "#fff",
        fontWeight: "600",
    },
    totalValue: {
        color: "#00ff00",
        fontWeight: "600",
    },
    highlightLabel: {
        color: "#4CAF50",
    },
    highlightValue: {
        color: "#00ff00", // Đổi sang màu xanh lá chính (giống totalValue)
        fontWeight: "700",
    },
});