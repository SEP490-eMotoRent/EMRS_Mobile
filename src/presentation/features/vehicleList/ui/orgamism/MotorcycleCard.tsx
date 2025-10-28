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

    // Filter features to only show Support Charging and GPS Tracking
    const validFeatures = motorcycle.features.filter(f => 
        f === "Support Charging" || f === "GPS Tracking"
    );

    return (
        <TouchableOpacity style={styles.card} onPress={handlePress} activeOpacity={0.85}>
            {/* Distance Badge */}
            <View style={styles.topRow}>
                <Text style={styles.distance}>
                    {motorcycle.distance.toFixed(2)} Miles Away
                </Text>
            </View>

            {/* Image */}
            <View style={styles.imageContainer}>
                {hasImage ? (
                    <Image source={{ uri: motorcycle.image }} style={styles.image} />
                ) : (
                    <ImageBackground style={styles.image} source={{ uri: motorcycle.image }}>
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

                {/* Specs Row */}
                <View style={styles.specsRow}>
                    <SpecItem icon="⚡" label={motorcycle.range} iconColor="#10b981" />
                    <SpecItem icon="🔋" label={motorcycle.battery} iconColor="#3b82f6" />
                </View>

                {/* Features */}
                {validFeatures.length > 0 && (
                    <View style={styles.featuresRow}>
                        {validFeatures.map((f, i) => (
                            <FeatureBadge key={i} label={f} />
                        ))}
                    </View>
                )}
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
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 6,
    },
    distance: {
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: "500",
    },
    imageContainer: {
        margin: 16,
        marginTop: 8,
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
        marginBottom: 12,
    },
    specsRow: {
        flexDirection: "row",
        gap: 8,
        marginBottom: 12,
    },
    featuresRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },
});