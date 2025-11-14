import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
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
    dateRange: string;
    location?: string;
}

export const MotorcycleCard: React.FC<Props> = ({ motorcycle, dateRange, location }) => {
    const navigation = useNavigation<NavProp>();

    const handlePress = () => {
        navigation.navigate("VehicleDetails", { 
            vehicleId: motorcycle.id,
            dateRange: dateRange,
            location: location,
        });
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
        justifyContent: "flex-end",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
    },
    spacer: {
        flex: 1,
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
        height: 220,
        backgroundColor: "#2a2a2a",
        position: "relative",
        borderRadius: 16,
        overflow: "hidden",
        marginHorizontal: 12,
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
        fontSize: 20,
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
        flexDirection: "row",
        alignItems: "baseline",
        gap: 3,
    },
    price: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "800",
        letterSpacing: -0.5,
    },
    perDay: {
        color: "#6b7280",
        fontSize: 16,
        fontWeight: "500",
    },
});