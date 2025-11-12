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
    countTotal?: number;
    countAvailable?: number;
    isAvailable?: boolean;
    // ✅ NEW: For correct price calculation
    rentalDays?: number;        // Number of days in rental period
    totalPrice?: number;        // Calculated total (price × rentalDays)
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

    // ✅ Determine availability status
    const isAvailable = (motorcycle.countAvailable ?? 0) > 0;
    const availabilityColor = isAvailable ? "#22c55e" : "#ef4444";
    const availabilityText = isAvailable 
        ? `${motorcycle.countAvailable} available`
        : "Not available";

    return (
        <TouchableOpacity 
            style={[
                styles.card,
                !isAvailable && styles.cardUnavailable,
            ]} 
            onPress={handlePress} 
            activeOpacity={0.85}
            disabled={!isAvailable}
        >
            {/* Availability banner */}
            {!isAvailable && (
                <View style={styles.unavailableBanner}>
                    <Text style={styles.unavailableBannerText}>NOT AVAILABLE</Text>
                </View>
            )}

            {/* Distance Badge */}
            <View style={styles.topRow}>
                <Text style={styles.distance}>
                    Cách Xa {motorcycle.distance.toFixed(2)} Km
                </Text>
                {/* Availability badge */}
                <View style={[styles.availabilityBadge, { backgroundColor: availabilityColor + '20' }]}>
                    <View style={[styles.availabilityDot, { backgroundColor: availabilityColor }]} />
                    <Text style={[styles.availabilityText, { color: availabilityColor }]}>
                        {availabilityText}
                    </Text>
                </View>
            </View>

            {/* Image */}
            <View style={styles.imageContainer}>
                {hasImage ? (
                    <Image 
                        source={{ uri: motorcycle.image }} 
                        style={[
                            styles.image,
                            !isAvailable && styles.imageUnavailable,
                        ]} 
                    />
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
                    {/* ✅ FIXED: Use calculated totalPrice instead of price * 3 */}
                    <PriceText 
                        price={motorcycle.price} 
                        total={motorcycle.totalPrice ?? motorcycle.price} 
                    />
                </View>

                {/* Specs Row */}
                <View style={styles.specsRow}>
                    {/* ✅ FIXED: Commented out N/A range until we have real data */}
                    {/* <SpecItem icon="⚡" label={motorcycle.range} iconColor="#10b981" /> */}
                    
                    <SpecItem icon="🔋" label={motorcycle.battery} iconColor="#3b82f6" />
                    
                    {/* Show total count */}
                    {motorcycle.countTotal !== undefined && (
                        <SpecItem 
                            icon="🏍️" 
                            label={`${motorcycle.countTotal} total`} 
                            iconColor="#f59e0b" 
                        />
                    )}
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
    cardUnavailable: {
        opacity: 0.6,
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    unavailableBanner: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ef4444",
        paddingVertical: 6,
        zIndex: 10,
    },
    unavailableBannerText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 1,
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
        color: "#9ca3af",
        fontSize: 12,
        fontWeight: "500",
    },
    availabilityBadge: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    availabilityDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    availabilityText: {
        fontSize: 11,
        fontWeight: "600",
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
    imageUnavailable: {
        opacity: 0.5,
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