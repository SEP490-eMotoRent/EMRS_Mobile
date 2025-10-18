import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { RequirementItem } from "../atoms/text/RequirementItem";
import { SectionTitle } from "../atoms/text/SectionTitle";

interface ConditionSectionProps {
    requirements: string[];
}

export const ConditionSection: React.FC<ConditionSectionProps> = ({ requirements }) => {
    return (
        <View style={styles.container}>
            <SectionTitle title="Condition" />
            <Text style={styles.subtitle}>Requirement</Text>
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
    subtitle: {
        color: "#999",
        fontSize: 15,
        marginBottom: 12,
    },
    requirementsList: {
        gap: 4,
    },
});