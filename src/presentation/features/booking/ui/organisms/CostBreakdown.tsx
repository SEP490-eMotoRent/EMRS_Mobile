import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CostRow } from "../atoms/text/CostRow";

interface CostBreakdownProps {
    rentalFee: string;
    insuranceFee: string;
    securityDeposit: string;
    total: string;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
    rentalFee,
    insuranceFee,
    securityDeposit,
    total,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chi tiết</Text>
            <View style={styles.content}>
                <CostRow label="Phí Thuê Xe" value={rentalFee} />
                <CostRow label="Bảo Hiểm" value={insuranceFee} />
                <CostRow label="Đặt Cọc" value={securityDeposit} />
                <CostRow label="Tổng giá tiền" value={total} isTotal />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    content: {
        gap: 4,
    },
});
