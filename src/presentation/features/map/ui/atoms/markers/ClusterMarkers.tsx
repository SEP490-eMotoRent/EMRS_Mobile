import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ClusterMarkerProps {
    count: number;
    minPrice: number;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({
    count,
    minPrice
}) => {
    return (
        <View style={styles.container}>
        <Text style={styles.text}>
            {count} Bikes From ${minPrice}
        </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#000",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 25,
        borderWidth: 2,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
});