import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface OTPInputProps {
    value: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({ value }) => {
    return (
        <View style={styles.box}>
            <Text style={styles.text}>{value}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    box: {
        width: 50,
        height: 60,
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    text: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
    },
});