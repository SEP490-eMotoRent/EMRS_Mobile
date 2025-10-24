import React from "react";
import { StyleSheet, Text, View } from "react-native";

export const DeliveryBadge: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.icon}>📦</Text>
            <Text style={styles.text}>Delivery Available</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    icon: {
        fontSize: 12,
    },
    text: {
        color: "#a855f7",
        fontSize: 11,
        fontWeight: "500",
    },
});
