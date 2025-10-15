import React from "react";
import {
    StyleSheet,
    View,
} from "react-native";

// Simple icon components
export const BuildingIcon = () => (
    <View style={styles.icon}>
        <View style={styles.buildingBody}>
            <View style={styles.buildingWindow} />
            <View style={styles.buildingWindow} />
            <View style={styles.buildingWindow} />
            <View style={styles.buildingWindow} />
        </View>
    </View>
);


const styles = StyleSheet.create({
    // Icon styles
    icon: {
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    // Building icon
    buildingBody: {
        width: 24,
        height: 28,
        backgroundColor: "#666",
        borderRadius: 2,
        flexDirection: "row",
        flexWrap: "wrap",
        padding: 3,
        justifyContent: "space-around",
        alignContent: "space-around",
    },
    buildingWindow: {
        width: 6,
        height: 6,
        backgroundColor: "#333",
        borderRadius: 1,
    }
});