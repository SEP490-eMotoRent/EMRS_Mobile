import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface SummaryRowProps {
    label: string;
    value: string;
    isTotal?: boolean;
    showInfo?: boolean;
    onInfoPress?: () => void; // ✅ NEW: Callback for info icon press
}

export const SummaryRow: React.FC<SummaryRowProps> = ({ 
    label, 
    value, 
    isTotal = false,
    showInfo = false,
    onInfoPress,
}) => {
    return (
        <View style={[styles.row, isTotal && styles.totalRow]}>
            <View style={styles.labelContainer}>
                <Text style={[styles.label, isTotal && styles.totalLabel]}>
                    {label}
                </Text>
                {showInfo && onInfoPress && (
                    <TouchableOpacity 
                        onPress={onInfoPress}
                        style={styles.infoTouchable}
                        activeOpacity={0.6}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoIcon}>ⓘ</Text>
                        </View>
                    </TouchableOpacity>
                )}
            </View>
            <Text style={[
                styles.value, 
                isTotal && styles.totalValue
            ]}>
                {value}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 8, // ✅ Reduced from 12 to 8
    },
    totalRow: {
        paddingTop: 12, // ✅ Reduced from 16 to 12
    },
    labelContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        flex: 1,
    },
    label: {
        color: "#999",
        fontSize: 13, // ✅ Reduced from 14 to 13
        fontWeight: "500",
    },
    totalLabel: {
        color: "#fff",
        fontSize: 15, // ✅ Reduced from 16 to 15
        fontWeight: "700",
    },
    value: {
        color: "#fff",
        fontSize: 13, // ✅ Reduced from 14 to 13
        fontWeight: "600",
    },
    totalValue: {
        color: "#d4c5f9",
        fontSize: 18, // ✅ Reduced from 20 to 18
        fontWeight: "700",
    },
    infoContainer: {
        width: 18, // ✅ Increased for better touch target
        height: 18,
        borderRadius: 9,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(212, 197, 249, 0.1)", // ✅ Subtle background
    },
    infoTouchable: {
        padding: 2, // ✅ Extra touch padding
    },
    infoIcon: {
        fontSize: 13,
        color: "#d4c5f9", // ✅ Changed from #666 to purple for visibility
        fontWeight: "600",
    },
});