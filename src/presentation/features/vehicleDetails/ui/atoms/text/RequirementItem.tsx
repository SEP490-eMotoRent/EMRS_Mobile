import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface RequirementItemProps {
    text: string;
}

export const RequirementItem: React.FC<RequirementItemProps> = ({ text }) => {
    return (
        <View style={styles.container}>
            <View style={styles.bullet} />
            <Text style={styles.text}>{text}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12,
        marginBottom: 8,
    },
    bullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: "#fff",
        marginTop: 6,
    },
    text: {
        color: "#d1d5db",
        fontSize: 14,
        flex: 1,
    },
});