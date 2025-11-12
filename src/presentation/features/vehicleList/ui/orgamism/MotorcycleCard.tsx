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
    rentalDays?: number;
    totalPrice?: number;
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
        ? `${motorcycle.countAvailable} có sẵn`
        : "Không có sẵn";

    // ✅ Clean up the name - remove redundant brand prefix
    const cleanName = motorcycle.name
        .replace(/^VinFast\s+VinFast\s+/i, '') // Remove double VinFast
        .replace(/^VinFast\s+/i, '')           // Remove single VinFast
        .replace(/\s+2023$/, '')               // Remove year (optional)
        .trim();

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
                    <Text style={styles.unavailableBannerText}>KHÔNG CÓ SẴN</Text>
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
                            <Text style={styles.placeholderText}>{cleanName}</Text>
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
                    {/* ✅ NEW: Cleaner header with brand and category inline */}
                    <View style={styles.titleContainer}>
                        <Text style={styles.modelName} numberOfLines={1}>
                            {cleanName}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={styles.brandText}>{motorcycle.brand}</Text>
                            <Text style={styles.separator}>•</Text>
                            <Text style={styles.categoryText}>{motorcycle.variant}</Text>
                        </View>
                    </View>
                    
                    {/* Price */}
                    <PriceText 
                        price={motorcycle.price} 
                        total={motorcycle.totalPrice ?? motorcycle.price} 
                    />
                </View>

                {/* ✅ NEW: Specs Row - Availability FIRST, then battery */}
                <View style={styles.specsRow}>
                    {/* Available count - PRIORITY #1 */}
                    {motorcycle.countAvailable !== undefined && (
                        <SpecItem 
                            icon="🏍️" 
                            label={`${motorcycle.countAvailable} có sẵn`}
                            iconColor={availabilityColor}
                        />
                    )}
                    
                    {/* Battery */}
                    <SpecItem icon="🔋" label={motorcycle.battery} iconColor="#3b82f6" />
                    
                    {/* Total count - Less important, shown last */}
                    {motorcycle.countTotal !== undefined && (
                        <SpecItem 
                            icon="📦" 
                            label={`${motorcycle.countTotal} tổng`} 
                            iconColor="#6b7280" 
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
    // ✅ NEW: Cleaner title layout
    titleContainer: {
        flex: 1,
        marginRight: 12,
    },
    modelName: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    brandText: {
        color: "#d4c5f9",
        fontSize: 13,
        fontWeight: "600",
    },
    separator: {
        color: "#666",
        fontSize: 13,
    },
    categoryText: {
        color: "#9ca3af",
        fontSize: 13,
        fontWeight: "500",
        textTransform: "uppercase",
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