import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface BookingButtonProps {
    onPress: () => void;
    disabled?: boolean;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ onPress, disabled = false }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[
                    styles.button,
                    disabled && styles.buttonDisabled
                ]}
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
            >
                <Text style={[
                    styles.text,
                    disabled && styles.textDisabled
                ]}>
                    Tiến hành đặt xe
                </Text>
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
    buttonDisabled: {
        backgroundColor: "#4b5563",
        opacity: 0.5,
    },
    text: {
        color: "#000",
        fontSize: 16,
        fontWeight: "700",
    },
    textDisabled: {
        color: "#9ca3af",
    },
});