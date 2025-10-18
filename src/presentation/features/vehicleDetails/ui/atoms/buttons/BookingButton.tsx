import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface BookingButtonProps {
    onPress: () => void;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text}>Booking</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#d4c5f9",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
        marginHorizontal: 16,
        marginBottom: 32,
    },
    text: {
        color: "#000",
        fontSize: 17,
        fontWeight: "700",
    },
});