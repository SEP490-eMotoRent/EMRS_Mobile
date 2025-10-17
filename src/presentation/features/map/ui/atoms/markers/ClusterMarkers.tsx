import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ClusterMarkerProps {
    count: number;
    minPrice: number;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, minPrice }) => {
    const text = `${count} Cars From $${minPrice}`;
    return (
        <View style={styles.wrapper}>
            <View style={styles.container}>
                <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
                    {text}
                </Text>
            </View>
            <View style={styles.arrow} />
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: "center",
        justifyContent: "flex-start",
        overflow: "visible",
        minHeight: 60, // Added minHeight to ensure space for arrow
    },
    container: {
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
        minWidth: 90,
        maxWidth: 900,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.32,
        shadowRadius: 4,
        elevation: 6,
    },
    text: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
        textAlign: "center",
    },
    arrow: {
        width: 0,
        height: 0,
        backgroundColor: "transparent",
        borderStyle: "solid",
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 10,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
        marginTop: -10, // Adjusted to position arrow below container
    },
});