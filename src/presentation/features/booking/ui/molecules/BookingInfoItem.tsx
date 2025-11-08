import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BookingInfoItemProps {
    icon: string;
    text: string;
}

export const BookingInfoItem: React.FC<BookingInfoItemProps> = ({ icon, text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>{icon}:</Text>
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
        color: "#9ca3af", // Màu xám sáng (như #d1d5db nhưng ít sáng hơn cho icon/label)
        fontSize: 13,
        marginRight: 6,
    },
    text: {
        color: "#f3f4f6", // Gần trắng, dễ đọc trên nền tối
        fontSize: 13,
        flexShrink: 1,
    },
});
