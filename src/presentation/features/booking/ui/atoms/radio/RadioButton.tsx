import React from "react";
import { StyleSheet, View } from "react-native";

interface RadioButtonProps {
    selected: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({ selected }) => {
    return (
        <View style={styles.container}>
            {selected && <View style={styles.selected} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#666",
        justifyContent: "center",
        alignItems: "center",
    },
    selected: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: "#d4c5f9",
    },
});