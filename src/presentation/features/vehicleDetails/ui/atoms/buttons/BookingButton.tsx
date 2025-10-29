import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookingButtonProps {
    onPress: () => void;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ onPress }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.button}
                onPress={onPress}
                activeOpacity={0.8}
            >
                <Text style={styles.text}>Proceed to Booking</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    button: {
        backgroundColor: "#a78bfa",
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: "center",
    },
    text: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
});