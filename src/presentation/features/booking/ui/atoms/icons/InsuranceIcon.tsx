import React from "react";
import { StyleSheet, Text } from "react-native";

interface InsuranceIconProps {
    icon: string;
    color: string;
}

export const InsuranceIcon: React.FC<InsuranceIconProps> = ({ icon, color }) => {
    return (
        <Text style={[styles.icon, { color }]}>{icon}</Text>
    );
};

const styles = StyleSheet.create({
    icon: {
        fontSize: 24,
        marginRight: 12,
    },
});