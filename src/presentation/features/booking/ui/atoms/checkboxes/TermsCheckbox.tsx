import React from "react";
import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
interface TermsCheckboxProps {
    checked: boolean;
    onToggle: () => void;
}

export const TermsCheckbox: React.FC<TermsCheckboxProps> = ({ checked, onToggle }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={onToggle} activeOpacity={0.7}>
            <View style={[styles.box, checked && styles.checkedBox]}>
                {checked && <Text style={styles.checkmark}>✓</Text>}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 4,
    },
    box: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 2,
        borderColor: "#666",
        justifyContent: "center",
        alignItems: "center",
    },
    checkedBox: {
        backgroundColor: "#d4c5f9",
        borderColor: "#d4c5f9",
    },
    checkmark: {
        color: "#000",
        fontSize: 14,
        fontWeight: "700",
    },
});