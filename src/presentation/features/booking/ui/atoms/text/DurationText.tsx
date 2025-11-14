import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface DurationTextProps {
    duration: string;
}

export const DurationText: React.FC<DurationTextProps> = ({ duration }) => {
    return (
        <View style={styles.container}>
            <View style={styles.badge}>
                <Text style={styles.icon}>⏱</Text>
                <View style={styles.textContainer}>
                    <Text style={styles.label}>Thời lượng thuê</Text>
                    <Text style={styles.value}>{duration}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginBottom: 20,
    },
    badge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: "#d4c5f9",
        gap: 12,
        shadowColor: "#d4c5f9",
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    icon: {
        fontSize: 24,
        color: "#d4c5f9",
    },
    textContainer: {
        gap: 2,
    },
    label: {
        color: "#999",
        fontSize: 12,
        fontWeight: "600",
    },
    value: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
});