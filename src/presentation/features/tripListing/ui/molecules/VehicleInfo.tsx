import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface VehicleInfoProps {
    name: string;
    dates: string;
    imageUrl?: string;
    category?: string; // ✅ NEW: Vehicle category
    duration?: string; // ✅ NEW: Rental duration
}

export const VehicleInfo: React.FC<VehicleInfoProps> = ({ 
    name, 
    dates, 
    imageUrl,
    category,
    duration 
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
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{name}</Text>
                    {/* ✅ NEW: Show category badge */}
                    {category && (
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{category}</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.dates}>{dates}</Text>
                {/* ✅ NEW: Show duration if available */}
                {duration && (
                    <View style={styles.durationRow}>
                        <Text style={styles.durationIcon}>⏱️</Text>
                        <Text style={styles.duration}>{duration}</Text>
                    </View>
                )}
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
    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 4,
    },
    name: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    categoryBadge: {
        backgroundColor: "#2a2a2a",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryText: {
        color: "#999",
        fontSize: 10,
        fontWeight: "600",
        textTransform: "uppercase",
    },
    dates: {
        color: "#999",
        fontSize: 12,
        marginBottom: 4,
    },
    durationRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },
    durationIcon: {
        fontSize: 10,
    },
    duration: {
        color: "#666",
        fontSize: 11,
        fontWeight: "600",
    },
});