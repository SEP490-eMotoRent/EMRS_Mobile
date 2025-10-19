import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { SuccessIcon } from "../atoms/icons/SuccessIcon";

interface PaymentSuccessHeaderProps {
    amount: string;
}

export const PaymentSuccessHeader: React.FC<PaymentSuccessHeaderProps> = ({ amount }) => {
    return (
        <View style={styles.container}>
            <SuccessIcon />
            <Text style={styles.title}>Payment Successful!</Text>
            <Text style={styles.subtitle}>Your payment of {amount} has been processed</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        paddingVertical: 24,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        color: "#999",
        fontSize: 14,
        textAlign: "center",
    },
});
