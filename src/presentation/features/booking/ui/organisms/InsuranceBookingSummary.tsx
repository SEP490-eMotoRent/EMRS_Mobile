import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SummaryRow } from "../atoms/text/SummaryRow";

interface InsuranceBookingSummaryProps {
    rentalFee: string;
    insuranceFee: string;
    total: string;
}

export const InsuranceBookingSummary: React.FC<InsuranceBookingSummaryProps> = ({
    rentalFee,
    insuranceFee,
    total,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Booking Summary</Text>
            <View style={styles.content}>
                <SummaryRow label="Rental fee" value={rentalFee} />
                <SummaryRow label="Insurance" value={insuranceFee} />
                <SummaryRow label="Total" value={total} isTotal />
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