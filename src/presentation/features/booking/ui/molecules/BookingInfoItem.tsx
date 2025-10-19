import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BookingInfoItemProps {
    icon: string;
    text: string;
}

export const BookingInfoItem: React.FC<BookingInfoItemProps> = ({ icon, text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    icon: {
        fontSize: 14,
        marginRight: 8,
    },
    text: {
        color: "#d1d5db",
        fontSize: 13,
    },
});