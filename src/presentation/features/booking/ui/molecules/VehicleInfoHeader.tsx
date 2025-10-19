import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface VehicleInfoHeaderProps {
    vehicleName: string;
    rentalPeriod: string;
    imageUrl?: string;
}

export const VehicleInfoHeader: React.FC<VehicleInfoHeaderProps> = ({ 
    vehicleName, 
    rentalPeriod,
    imageUrl 
}) => {
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
                <Text style={styles.name}>{vehicleName}</Text>
                <Text style={styles.period}>{rentalPeriod}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    imageContainer: {
        width: 60,
        height: 60,
        borderRadius: 12,
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 16,
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 12,
    },
    placeholder: {
        fontSize: 32,
    },
    info: {
        flex: 1,
    },
    name: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },
    period: {
        color: "#999",
        fontSize: 13,
    },
});
