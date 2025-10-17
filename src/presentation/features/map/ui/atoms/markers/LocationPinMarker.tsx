import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const LocationPinMarker: React.FC = () => {
    return (
        <View style={styles.container}>
        <View style={styles.iconWrapper}>
            <FontAwesome name="flag" size={16} color="#b0b0b0" />
        </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "center",
    },
    iconWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1a1a1a", // dark background
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 3,
    },
});
