import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface ClusterMarkerProps {
    count: number;
    minPrice: number;
}

export const ClusterMarker: React.FC<ClusterMarkerProps> = ({ count, minPrice }) => {
    return (
        <View style={styles.container}>
            <View style={styles.bubble}>
                <Text style={styles.text} numberOfLines={1}>
                    {count} from ${minPrice}
                </Text>
            </View>
            <View style={styles.arrow} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
    },
    bubble: {
        backgroundColor: "#000",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        elevation: 3,
    },
    text: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
        textAlign: "center",
    },
    arrow: {
        width: 0,
        height: 0,
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderTopWidth: 6,
        borderLeftColor: "transparent",
        borderRightColor: "transparent",
        borderTopColor: "#000",
    },
});