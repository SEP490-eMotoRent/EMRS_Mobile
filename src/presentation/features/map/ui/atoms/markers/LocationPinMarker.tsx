import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";

export const LocationPinMarker: React.FC = React.memo(() => {
    return (
        <View 
            style={styles.container}
            pointerEvents="none"
        >
            <View style={styles.bubble}>
                <FontAwesome 
                    name="flag" 
                    size={16}
                    color="#fff"
                />
            </View>
            <View style={styles.pointer} />
        </View>
    );
});

LocationPinMarker.displayName = 'LocationPinMarker';

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        justifyContent: "flex-start",
        width: 40,
        height: 50,
    },
    bubble: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: "#1a1a1a",
        borderWidth: 2,
        borderColor: "#10B981",
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    pointer: {
        width: 0,
        height: 0,
        marginTop: -2,
        borderLeftWidth: 8,
        borderRightWidth: 8,
        borderTopWidth: 12,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#10B981",
    },
});