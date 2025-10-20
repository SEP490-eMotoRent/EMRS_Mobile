import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface VehicleInfoProps {
    name: string;
    dates: string;
    imageUrl?: string;
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({ name, dates, imageUrl }) => {
    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {imageUrl ? (
                    <Image source={{ uri: imageUrl }} style={styles.image} />
                ) : (
                    <Text style={styles.placeholder}>🛵</Text>
                )}
            </View>
            <View style={styles.info}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.dates}>{dates}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 8,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 8,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    placeholder: {
        fontSize: 24,
    },
    info: {
        flex: 1,
        justifyContent: "center",
    },
    name: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        marginBottom: 4,
    },
    dates: {
        color: "#999",
        fontSize: 12,
    },
});