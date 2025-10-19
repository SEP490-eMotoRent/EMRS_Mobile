import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ContractHeaderProps {
    contractNumber: string;
}

export const ContractHeader: React.FC<ContractHeaderProps> = ({ contractNumber }) => {
    return (
        <View style={styles.container}>
            <View style={styles.icon}>
                <Text style={styles.iconText}>📄</Text>
            </View>
            <Text style={styles.text}>{contractNumber}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    icon: {
        marginRight: 12,
    },
    iconText: {
        fontSize: 20,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
});