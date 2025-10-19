import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CostRow } from "../atoms/text/CostRow";

interface CostBreakdownProps {
    rentalFee: string;
    insuranceFee: string;
    securityDeposit: string;
    serviceFee: string;
    total: string;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
    rentalFee,
    insuranceFee,
    securityDeposit,
    serviceFee,
    total,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cost Breakdown</Text>
            <View style={styles.content}>
                <CostRow label="Rental fee" value={rentalFee} />
                <CostRow label="Free insurance" value={insuranceFee} />
                <CostRow label="Security deposit" value={securityDeposit} />
                <CostRow label="Service fee" value={serviceFee} />
                <CostRow label="Total amount" value={total} isTotal />
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
