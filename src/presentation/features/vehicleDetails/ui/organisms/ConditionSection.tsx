import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RequirementItem } from "../atoms/text/RequirementItem";

interface ConditionSectionProps {
    requirements: string[];
}

export const ConditionSection: React.FC<ConditionSectionProps> = ({ requirements }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Điều Kiện Thuê Xe</Text>
            <Text style={styles.subtitle}>Yêu Cầu</Text>
            <View style={styles.requirementsList}>
                {requirements.map((req, index) => (
                    <RequirementItem key={index} text={req} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#1a1a1a",
        padding: 20,
        borderRadius: 24,
        marginBottom: 16,
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        color: "#999",
        fontSize: 15,
        marginBottom: 12,
    },
    requirementsList: {
        gap: 4,
    },
});