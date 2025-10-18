import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ShowMoreButtonProps {
    onPress: () => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({ onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.text}>Show more</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#d4c5f9",
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignSelf: "center",
    },
    text: {
        color: "#000",
        fontSize: 15,
        fontWeight: "600",
    },
});