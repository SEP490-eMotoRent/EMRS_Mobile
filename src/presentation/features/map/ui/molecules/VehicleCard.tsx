import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";

export interface ElectricVehicle {
    id: string;
    name: string;
    brand: string;
    type: string;
    range: string;
    battery: string;
    seats: number;
    color: string;
    colorHex: string;
    price: number;
    features: string[];
    rentalDays?: number;
    imageUrl?: string;
}

type VehicleCardNavigationProp = StackNavigationProp<BrowseStackParamList>;

interface VehicleCardProps {
    vehicle: ElectricVehicle;
    onBookPress: (vehicleId: string) => void;
    dateRange?: string;
    location?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ 
    vehicle, 
    onBookPress,
    dateRange = "Chọn Ngày",
    location 
}) => {
    const navigation = useNavigation<VehicleCardNavigationProp>();

    const handleCardPress = () => {
        navigation.navigate('VehicleDetails', { 
            vehicleId: vehicle.id,
            dateRange,
            location
        });
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={handleCardPress}
            activeOpacity={0.92}
        >
            {/* ✅ Enhanced gradient background */}
            <LinearGradient
                colors={['#1a1a1a', '#0d0d0d', '#050505']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientBackground}
            >
                {/* ✅ Subtle glow effect overlay */}
                <View style={styles.glowOverlay} />

                {/* Brand Badge - Top Right */}
                <View style={styles.brandBadge}>
                    <LinearGradient
                        colors={['#9d7ff5', '#7c4dff']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.brandBadgeGradient}
                    >
                        <Text style={styles.brandText}>{vehicle.brand}</Text>
                    </LinearGradient>
                </View>

                {/* Image Section */}
                <View style={styles.imageContainer}>
                    {vehicle.imageUrl ? (
                        <Image
                            source={{ uri: vehicle.imageUrl }}
                            style={styles.vehicleImage}
                            resizeMode="contain"
                        />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <Text style={styles.placeholderIcon}>🏍️</Text>
                        </View>
                    )}
                    
                    {/* Color Dot with glow */}
                    <View style={styles.colorDotContainer}>
                        <View style={[
                            styles.colorDotGlow, 
                            { backgroundColor: vehicle.colorHex, opacity: 0.3 }
                        ]} />
                        <View style={[styles.colorDot, { backgroundColor: vehicle.colorHex }]}>
                            {vehicle.color === "Trắng" && <View style={styles.colorDotBorder} />}
                        </View>
                    </View>
                </View>

                {/* Info Section - Modernized */}
                <View style={styles.infoSection}>
                    {/* Name & Type Row */}
                    <View style={styles.nameRow}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.vehicleName} numberOfLines={1}>
                                {vehicle.name}
                            </Text>
                            <Text style={styles.vehicleType}>{vehicle.type}</Text>
                        </View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Price & Button Row */}
                    <View style={styles.actionRow}>
                        {/* Price Section */}
                        <View style={styles.priceContainer}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceAmount}>
                                    {vehicle.price.toLocaleString('vi-VN')}₫
                                </Text>
                                <Text style={styles.priceUnit}>/ngày</Text>
                            </View>
                            <Text style={styles.priceLabel}>Giá thuê</Text>
                        </View>

                        {/* Book Button */}
                        <TouchableOpacity 
                            style={styles.bookButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                onBookPress(vehicle.id);
                            }}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={['#a78bfa', '#8b5cf6', '#7c4dff']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.bookButtonGradient}
                            >
                                <Text style={styles.bookButtonText}>Đặt xe</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 8,
        width: 260,
        borderRadius: 20, // ✅ More rounded (was 16)
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2, // ✅ More subtle (was 0.15)
        shadowRadius: 12, // ✅ Softer (was 8)
        elevation: 8,
    },
    gradientBackground: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "rgba(157, 127, 245, 0.2)", // ✅ Lighter border
        overflow: "hidden",
    },
    // ✅ NEW: Subtle glow overlay
    glowOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        backgroundColor: "rgba(124, 77, 255, 0.03)",
    },
    brandBadge: {
        position: "absolute",
        top: 12,
        right: 12,
        borderRadius: 10, // ✅ More rounded (was 8)
        overflow: "hidden",
        zIndex: 10,
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5, // ✅ Stronger glow
        shadowRadius: 6,
        elevation: 5,
    },
    brandBadgeGradient: {
        paddingHorizontal: 10, // ✅ More padding (was 8)
        paddingVertical: 5, // ✅ Slightly taller (was 4)
    },
    brandText: {
        color: "#fff",
        fontSize: 10, // ✅ Slightly larger (was 9)
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.8, // ✅ More spacing (was 0.5)
    },
    imageContainer: {
        width: "100%",
        height: 120, // ✅ Slightly taller (was 110)
        backgroundColor: "#141414", // ✅ Slightly lighter (was #1a1a1a)
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
    },
    vehicleImage: {
        width: "100%",
        height: "100%",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderIcon: {
        fontSize: 48, // ✅ Larger (was 40)
        opacity: 0.3, // ✅ More subtle (was 0.5)
    },
    colorDotContainer: {
        position: "absolute",
        bottom: 10,
        left: 12,
    },
    // ✅ NEW: Glow effect for color dot
    colorDotGlow: {
        position: "absolute",
        width: 24,
        height: 24,
        borderRadius: 12,
        top: -4,
        left: -4,
    },
    colorDot: {
        width: 18, // ✅ Larger (was 16)
        height: 18,
        borderRadius: 9,
        borderWidth: 2,
        borderColor: "#0a0a0a",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
    },
    colorDotBorder: {
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#666",
    },
    infoSection: {
        padding: 14, // ✅ More padding (was 12)
    },
    nameRow: {
        marginBottom: 10, // ✅ More space (was 8)
    },
    nameContainer: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 16, // ✅ Larger (was 15)
        fontWeight: "700",
        color: "#fff",
        marginBottom: 3, // ✅ More space (was 2)
        letterSpacing: 0.3, // ✅ NEW: Better readability
    },
    vehicleType: {
        fontSize: 11, // ✅ Larger (was 10)
        color: "#999", // ✅ Lighter (was #999)
        fontWeight: "500",
    },
    // ✅ NEW: Divider line
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginVertical: 10,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceContainer: {
        flex: 1,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "baseline",
        marginBottom: 2, // ✅ NEW: Space for label
    },
    priceAmount: {
        fontSize: 18, // ✅ Larger (was 16)
        fontWeight: "800",
        color: "#fff",
    },
    priceUnit: {
        fontSize: 11, // ✅ Larger (was 10)
        color: "#888",
        fontWeight: "500",
        marginLeft: 3,
    },
    // ✅ NEW: Price label
    priceLabel: {
        fontSize: 9,
        color: "#666",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    bookButton: {
        borderRadius: 12, // ✅ More rounded (was 10)
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5, // ✅ Stronger (was 0.4)
        shadowRadius: 6, // ✅ Softer (was 4)
        elevation: 6,
    },
    bookButtonGradient: {
        paddingVertical: 11, // ✅ Slightly taller (was 10)
        paddingHorizontal: 20, // ✅ Wider (was implicit)
        alignItems: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 14, // ✅ Larger (was 13)
        fontWeight: "700",
        letterSpacing: 0.6, // ✅ More spacing (was 0.5)
    },
});