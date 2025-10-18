import React from "react";
import { StyleSheet, Text } from "react-native";

interface SectionTitleProps {
    title: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => {
    return <Text style={styles.title}>{title}</Text>;
};

const styles = StyleSheet.create({
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 16,
    },
});
