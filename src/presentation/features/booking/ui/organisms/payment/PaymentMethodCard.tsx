import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { RadioButton } from "../../atoms/radio/RadioButton";

interface PaymentMethodCardProps {
    isSelected: boolean;
    onSelect: () => void;
    currentBalance: string;
    afterBalance: string;
    isSufficient: boolean;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
    isSelected,
    onSelect,
    currentBalance,
    afterBalance,
    isSufficient,
}) => {
    return (
        <TouchableOpacity 
            style={[styles.card, isSelected && styles.selectedCard]}
            onPress={onSelect}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <View style={styles.icon}>
                        <Text style={styles.iconText}>💳</Text>
                    </View>
                    <Text style={styles.title}>Ví eMotoRent</Text>
                </View>
                <RadioButton selected={isSelected} />
            </View>
            
            <View style={styles.balanceContainer}>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
                    <Text style={styles.balanceValue}>{currentBalance}</Text>
                </View>
                
                {isSufficient ? (
                    <View style={styles.balanceRow}>
                        <Text style={styles.balanceLabel}>Số dư sau giao dịch</Text>
                        <Text style={styles.balanceValueAfter}>{afterBalance}</Text>
                    </View>
                ) : (
                    <View style={styles.insufficientContainer}>
                        <View style={styles.warningBadge}>
                            <Text style={styles.warningIcon}>⚠️</Text>
                            <Text style={styles.warningText}>Số dư không đủ</Text>
                        </View>
                        <Text style={styles.insufficientHint}>
                            Vui lòng nạp thêm tiền hoặc chọn phương thức thanh toán khác
                        </Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        borderWidth: 2,
        borderColor: "transparent",
    },
    selectedCard: {
        borderColor: "#d4c5f9",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    leftSection: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    title: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    balanceContainer: {
        gap: 12,
    },
    balanceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    balanceLabel: {
        color: "#999",
        fontSize: 14,
    },
    balanceValue: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    balanceValueAfter: {
        color: "#4ade80",
        fontSize: 16,
        fontWeight: "600",
    },
    insufficientContainer: {
        backgroundColor: "#2a1a1a",
        borderRadius: 8,
        padding: 12,
        borderLeftWidth: 3,
        borderLeftColor: "#ef4444",
    },
    warningBadge: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    warningIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    warningText: {
        color: "#fbbf24",
        fontSize: 14,
        fontWeight: "600",
    },
    insufficientHint: {
        color: "#999",
        fontSize: 12,
        lineHeight: 16,
    },
});