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
import { ColorWheel } from "../molecules/ColorWheel";

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

    // ✅ Determine availability status
    const isAvailable = (motorcycle.countAvailable ?? 0) > 0;
    const availabilityColor = isAvailable ? "#22c55e" : "#ef4444";
    const availabilityText = isAvailable 
        ? `${motorcycle.countAvailable} có sẵn`
        : "Không có sẵn";

    // ✅ Clean up the name
    const cleanName = motorcycle.name
        .replace(/^VinFast\s+VinFast\s+/i, '')
        .replace(/^VinFast\s+/i, '')
        .replace(/\s+2023$/, '')
        .trim();

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={handlePress} 
            activeOpacity={0.85}
        >
            {/* Top Bar - Just availability */}
            <View style={styles.topBar}>
                {/* ✅ REMOVED: Distance badge - only for map view */}
                {/* <Text style={styles.distance}>
                    Cách Xa {motorcycle.distance.toFixed(2)} Km
                </Text> */}
                
                <View style={styles.spacer} />
                
                <View style={[styles.availabilityBadge, { backgroundColor: availabilityColor + '20' }]}>
                    <View style={[styles.availabilityDot, { backgroundColor: availabilityColor }]} />
                    <Text style={[styles.availabilityText, { color: availabilityColor }]}>
                        {availabilityText}
                    </Text>
                </View>
            </View>

            {/* ✅ BIGGER Image - Full width, more height */}
            <View style={styles.imageContainer}>
                {hasImage ? (
                    <Image 
                        source={{ uri: motorcycle.image }} 
                        style={styles.image} 
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <Text style={styles.placeholderText}>{cleanName}</Text>
                    </View>
                )}
                {/* Color wheel on image */}
                <View style={styles.colorBadgeContainer}>
                    <ColorWheel color={motorcycle.color} />
                </View>
            </View>

            {/* ✅ Clean Info Section - Just essentials */}
            <View style={styles.infoSection}>
                {/* Name and Category */}
                <View style={styles.nameRow}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.modelName} numberOfLines={1}>
                            {cleanName}
                        </Text>
                        <Text style={styles.categoryText}>
                            {motorcycle.brand} • {motorcycle.variant}
                        </Text>
                    </View>
                    
                    {/* ✅ Price - BIG and clear */}
                    <View style={styles.priceContainer}>
                        <Text style={styles.price}>
                            {motorcycle.price.toLocaleString('vi-VN')}₫
                        </Text>
                        <Text style={styles.perDay}>/ngày</Text>
                    </View>
                </View>
            </View>

            {/* ✅ COMMENTED: Battery, Features - Moved to details page */}
            {/* <View style={styles.specsRow}>
                <SpecItem icon="🔋" label={motorcycle.battery} iconColor="#3b82f6" />
            </View>
            
            <View style={styles.featuresRow}>
                {validFeatures.map((f, i) => (
                    <FeatureBadge key={i} label={f} />
                ))}
            </View> */}
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
    topBar: {
        flexDirection: "row",
        justifyContent: "flex-end", // ✅ Right-align availability badge
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    spacer: {
        flex: 1,
    },
    // ✅ COMMENTED: Distance style - only used in map view
    // distance: {
    //     color: "#9ca3af",
    //     fontSize: 12,
    //     fontWeight: "500",
    // },
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
    // ✅ NEW: Bigger image container with rounded corners
    imageContainer: {
        height: 220, // ✅ Taller to avoid cropping
        backgroundColor: "#2a2a2a",
        position: "relative",
        borderRadius: 16, // ✅ Rounded corners like card
        overflow: "hidden", // ✅ Clip to rounded shape
        marginHorizontal: 12, // ✅ Add side padding
        marginTop: 8,
    },
    image: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        backgroundColor: "#2a2a2a",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderText: {
        color: "#666",
        fontSize: 18,
        fontWeight: "600",
    },
    colorBadgeContainer: {
        position: "absolute",
        top: 12,
        left: 12,
    },
    // ✅ NEW: Cleaner info section
    infoSection: {
        padding: 16,
        paddingTop: 14,
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    nameContainer: {
        flex: 1,
        marginRight: 12,
    },
    modelName: {
        color: "#fff",
        fontSize: 20, // ✅ Slightly bigger
        fontWeight: "700",
        marginBottom: 4,
        letterSpacing: -0.3,
    },
    categoryText: {
        color: "#9ca3af",
        fontSize: 13,
        fontWeight: "500",
    },
    priceContainer: {
        flexDirection: "row", // ✅ Put price and /ngày on same line
        alignItems: "baseline", // ✅ Align baselines
        gap: 3,
    },
    price: {
        color: "#fff",
        fontSize: 22, // ✅ Reduced from 26 to be closer to /ngày
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    perDay: {
        color: "#6b7280",
        fontSize: 16, // ✅ Increased from 13 - narrower gap
        fontWeight: "500",
    },
});