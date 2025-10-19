import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface InsuranceBulletPointProps {
    text: string;
}

export const InsuranceBulletPoint: React.FC<InsuranceBulletPointProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 6,
    },
    bullet: {
        color: "#fff",
        fontSize: 14,
        marginRight: 8,
        lineHeight: 20,
    },
    text: {
        color: "#d1d5db",
        fontSize: 13,
        flex: 1,
        lineHeight: 20,
    },
});