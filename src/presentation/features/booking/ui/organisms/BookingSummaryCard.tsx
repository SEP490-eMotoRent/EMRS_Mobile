import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BookingInfoItem } from "../molecules/BookingInfoItem";

interface BookingSummaryCardProps {
    vehicleName: string;
    rentalPeriod: string;
    duration: string;
    branchName: string;
    insurancePlan: string;
    imageUrl?: string;
}

export const BookingSummaryCard: React.FC<BookingSummaryCardProps> = ({
    vehicleName,
    rentalPeriod,
    duration,
    branchName,
    insurancePlan,
    imageUrl,
}) => {
    return (
        <View style={styles.card}>
            <View style={styles.header}>
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
                    <Text style={styles.duration}>{duration}</Text>
                </View>
            </View>
            
            <View style={styles.details}>
                <BookingInfoItem icon="📍" text={branchName} />
                <BookingInfoItem icon="🛡️" text={insurancePlan} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        marginBottom: 16,
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
        fontSize: 12,
        marginBottom: 2,
    },
    duration: {
        color: "#999",
        fontSize: 12,
    },
    details: {
        gap: 4,
    },
});