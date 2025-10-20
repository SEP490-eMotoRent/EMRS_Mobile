import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface TimeRemainingProps {
    time: string;
}

export const TimeRemaining: React.FC<TimeRemainingProps> = ({ time }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>⏱️</Text>
            <Text style={styles.text}>{time}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 4,
    },
    icon: {
        fontSize: 12,
    },
    text: {
        color: "#999",
        fontSize: 12,
    },
});