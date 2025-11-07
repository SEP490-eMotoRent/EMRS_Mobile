import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ContractReadMoreSectionProps {
    onPress: () => void;
}

export const ContractReadMoreSection: React.FC<ContractReadMoreSectionProps> = ({ onPress }) => {
    return (
        <View style={styles.container}>
        <Text style={styles.title}>Hợp đồng thuê xe</Text>
        <Text style={styles.description}>
            Xem trước các điều khoản và chi tiết trong hợp đồng thuê xe của bạn.
        </Text>
        <TouchableOpacity onPress={onPress} style={styles.button}>
            <Text style={styles.buttonText}>Xem hợp đồng</Text>
        </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 20,
        marginBottom: 20,
    },
    title: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 8,
    },
    description: {
        color: "#aaa",
        fontSize: 14,
        marginBottom: 16,
    },
    button: {
        backgroundColor: "#4169E1",
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "600",
    },
});
