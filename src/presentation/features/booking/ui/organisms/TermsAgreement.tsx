import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { TermsCheckbox } from "../atoms/checkboxes/TermsCheckbox";

interface TermsAgreementProps {
    checked: boolean;
    onToggle: () => void;
}

export const TermsAgreement: React.FC<TermsAgreementProps> = ({ checked, onToggle }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
            <TermsCheckbox checked={checked} onToggle={onToggle} />
            <Text style={styles.text}>I have read and agree to all terms</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
    },
    text: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
        marginLeft: 12,
    },
});
