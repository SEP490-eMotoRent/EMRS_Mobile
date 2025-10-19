import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface NextStepItemProps {
    number: number;
    title: string;
    description: string;
}

export const NextStepItem: React.FC<NextStepItemProps> = ({ number, title, description }) => {
    return (
        <View style={styles.container}>
            <View style={styles.numberCircle}>
                <Text style={styles.number}>{number}</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.description}>{description}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 16,
    },
    numberCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    number: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    content: {
        flex: 1,
    },
    title: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginBottom: 4,
    },
    description: {
        color: "#999",
        fontSize: 12,
        lineHeight: 18,
    },
});