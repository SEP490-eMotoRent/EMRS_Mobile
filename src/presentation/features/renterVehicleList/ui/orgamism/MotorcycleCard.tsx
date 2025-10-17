import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { ColorBadge } from "../atoms/badges/ColorBadge";
import { DeliveryBadge } from "../atoms/badges/DeliveryBadges";
import { FeatureBadge } from "../atoms/badges/FeatureBadge";
import { PriceText } from "../atoms/texts/PriceTexts";
import { MotorcycleHeader } from "../molecules/MotorcycleHeader";
import { SpecItem } from "../molecules/SpecItem";

export interface Motorcycle {
    id: number;
    name: string;
    brand: string;
    variant: string;
    image: string;
    price: number;
    distance: number;
    range: string;
    battery: string;
    seats: number;
    features: string[];
    deliveryAvailable: boolean;
    branchName: string;
    color: string;
}

interface MotorcycleCardProps {
    motorcycle: Motorcycle;
}

export const MotorcycleCard: React.FC<MotorcycleCardProps> = ({ motorcycle }) => {
    return (
        <View style={styles.card}>
            {/* Distance & Delivery */}
            <View style={styles.topRow}>
                <Text style={styles.distance}>
                    {motorcycle.distance.toFixed(2)} Miles From Address
                </Text>
                {motorcycle.deliveryAvailable && <DeliveryBadge />}
            </View>

            {/* Image */}
            <View style={styles.imageContainer}>
                <Image source={{ uri: motorcycle.image }} style={styles.image} />
                <View style={styles.colorBadgeContainer}>
                    <ColorBadge color={motorcycle.color} />
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <View style={styles.headerRow}>
                    <MotorcycleHeader
                        brand={motorcycle.brand}
                        name={motorcycle.name}
                        variant={motorcycle.variant}
                        branchName={motorcycle.branchName}
                    />
                    <PriceText price={motorcycle.price} total={motorcycle.price * 3} />
                </View>

                {/* Specs Grid */}
                <View style={styles.specsGrid}>
                    <SpecItem icon="⚡" label={motorcycle.range} />
                    <SpecItem icon="🔋" label={motorcycle.battery} />
                    <SpecItem icon="👥" label={`${motorcycle.seats} Seats`} />
                    <SpecItem icon="📍" label={`${motorcycle.distance.toFixed(1)} mi`} />
                </View>

                {/* Features */}
                <View style={styles.featuresRow}>
                    {motorcycle.features.slice(0, 3).map((feature, idx) => (
                        <FeatureBadge key={idx} label={feature} />
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 24,
        borderWidth: 1,
        borderColor: "#333",
        overflow: "hidden",
        marginBottom: 16,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    distance: {
        color: "#999",
        fontSize: 13,
    },
    imageContainer: {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#2a2a2a",
        aspectRatio: 16 / 9,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    colorBadgeContainer: {
        position: "absolute",
        top: 12,
        left: 12,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
    },
    specsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        marginBottom: 12,
    },
    featuresRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
});