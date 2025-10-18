import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface BranchInfoItemProps {
    icon: string;
    text: string;
}

export const BranchInfoItem: React.FC<BranchInfoItemProps> = ({ icon, text }) => {
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
        gap: 10,
        marginBottom: 8,
    },
    icon: {
        fontSize: 16,
    },
    text: {
        color: "#d1d5db",
        fontSize: 13,
        flex: 1,
    },
});
