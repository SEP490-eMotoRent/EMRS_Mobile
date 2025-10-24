import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";

import { ColorBadge } from "../atoms/badges/ColorBadge";
import { DeliveryBadge } from "../atoms/badges/DeliveryBadges";
import { FeatureBadge } from "../atoms/badges/FeatureBadge";
import { PriceText } from "../atoms/texts/PriceTexts";
import { MotorcycleHeader } from "../molecules/MotorcycleHeader";
import { SpecItem } from "../molecules/SpecItem";

type NavProp = StackNavigationProp<BrowseStackParamList>;

export interface Motorcycle {
    id: string;
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

    interface Props {
    motorcycle: Motorcycle;
    }

    export const MotorcycleCard: React.FC<Props> = ({ motorcycle }) => {
    const navigation = useNavigation<NavProp>();

    const handlePress = () => {
        navigation.navigate("VehicleDetails", { vehicleId: motorcycle.id });
    };

    const hasImage = motorcycle.image && motorcycle.image.trim() !== "";

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
        {/* Top Row */}
        <View style={styles.topRow}>
            <Text style={styles.distance}>
            {motorcycle.distance.toFixed(2)} Miles From Address
            </Text>
            {motorcycle.deliveryAvailable && <DeliveryBadge />}
        </View>

        {/* Image */}
        <View style={styles.imageContainer}>
            {hasImage ? (
            <Image source={{ uri: motorcycle.image }} style={styles.image} />
            ) : (
            <ImageBackground
                style={styles.image}
                source={{ uri: motorcycle.image }}
            >
                <View style={styles.placeholderOverlay}>
                <Text style={styles.placeholderText}>{motorcycle.name}</Text>
                </View>
            </ImageBackground>
            )}
            <View style={styles.colorBadgeContainer}>
            <ColorBadge color={motorcycle.color} />
            </View>
        </View>

        {/* Info */}
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
                {motorcycle.range && <SpecItem icon="⚡" label={motorcycle.range} />}
                {motorcycle.battery && <SpecItem icon="🔋" label={motorcycle.battery} />}
            </View>

            {/* Features */}
            <View style={styles.featuresRow}>
            {motorcycle.features.slice(0, 3).map((f, i) => (
                <FeatureBadge key={i} label={f} />
            ))}
            </View>
        </View>
        </TouchableOpacity>
    );
    };

    const styles = StyleSheet.create({
    card: {
        backgroundColor: "#1a1a1a",
        borderRadius: 20,
        overflow: "hidden",
        marginHorizontal: 8,
        marginBottom: 16,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
    },
    topRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
    },
    distance: {
        color: "#bbb",
        fontSize: 13,
        fontWeight: "500",
    },
    imageContainer: {
        margin: 16,
        height: 140,
        borderRadius: 16,
        overflow: "hidden",
        backgroundColor: "#2a2a2a",
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    placeholderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
    colorBadgeContainer: {
        position: "absolute",
        top: 10,
        left: 10,
    },
    infoSection: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 10,
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