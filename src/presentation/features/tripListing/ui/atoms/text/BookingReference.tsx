import React from "react";
import { StyleSheet, Text } from "react-native";

interface BookingReferenceProps {
    reference: string;
}

export const BookingReference: React.FC<BookingReferenceProps> = ({ reference }) => {
    return <Text style={styles.text}>Booking reference: {reference}</Text>;
};

const styles = StyleSheet.create({
    text: {
        color: "#666",
        fontSize: 11,
        marginTop: 8,
    },
});