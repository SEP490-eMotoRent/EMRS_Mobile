import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SummaryRow } from "../atoms/text/SummaryRow";

interface BookingSummaryProps {
    rentalDays: number;
    rentalPrice: string;
    securityDeposit: string;
    total: string;
}

export const BookingSummary: React.FC<BookingSummaryProps> = ({
    rentalDays,
    rentalPrice,
    securityDeposit,
    total,
}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Booking Summary</Text>
            <View style={styles.content}>
                <SummaryRow label={`Rental (${rentalDays} days)`} value={rentalPrice} />
                <SummaryRow label="Security deposit" value={securityDeposit} />
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
