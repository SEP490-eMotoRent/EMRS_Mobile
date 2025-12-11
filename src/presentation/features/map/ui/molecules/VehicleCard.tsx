import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
    distance?: string;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
    vehicle,
    onBookPress,
    dateRange = "Chọn Ngày",
    location,
    distance,
}) => {
    const navigation = useNavigation<VehicleCardNavigationProp>();

    const goToVehicleDetails = () => {
        navigation.navigate("VehicleDetails", {
            vehicleId: vehicle.id,
            dateRange,
            location,
        });
    };

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={goToVehicleDetails}
            activeOpacity={0.92}
        >
            <LinearGradient
                colors={["#1a1a1a", "#0d0d0d", "#050505"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.gradientBackground}
            >
                <View style={styles.glowOverlay} />

                {/* Image Container */}
                <View style={styles.imageContainer}>
                    {/* Dark Gradient Overlay for better badge visibility */}
                    <LinearGradient
                        colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.2)", "transparent"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        style={styles.imageOverlay}
                    />

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

                    {/* Distance Badge - Top Left */}
                    {distance && (
                        <View style={styles.distanceBadge}>
                            <View style={styles.distanceBadgeContent}>
                                <Text style={styles.distanceIcon}>📍</Text>
                                <Text style={styles.distanceText}>{distance}</Text>
                            </View>
                        </View>
                    )}

                    {/* Battery/Range Badge - Top Right (only if vehicle.range exists) */}
                    {vehicle.range && (
                        <View style={styles.rangeBadge}>
                            <LinearGradient
                                colors={["rgba(16, 185, 129, 0.25)", "rgba(5, 150, 105, 0.25)"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.rangeBadgeGradient}
                            >
                                <Text style={styles.rangeIcon}>⚡</Text>
                                <Text style={styles.rangeText}>{vehicle.range}</Text>
                            </LinearGradient>
                        </View>
                    )}

                    {/* Enhanced Color Indicator - Bottom Left */}
                    <View style={styles.colorIndicatorContainer}>
                        {/* Glow Effect */}
                        <View
                            style={[
                                styles.colorGlow,
                                { backgroundColor: vehicle.colorHex },
                            ]}
                        />
                        {/* Main Color Dot */}
                        <View
                            style={[
                                styles.colorDot,
                                { backgroundColor: vehicle.colorHex },
                            ]}
                        >
                            {/* Inner Highlight for 3D effect */}
                            <View style={styles.colorHighlight} />
                            {/* White border for light colors */}
                            {(vehicle.color === "Trắng" || vehicle.colorHex === "#ffffff") && (
                                <View style={styles.colorDotBorder} />
                            )}
                        </View>
                        {/* Color Label */}
                        <View style={styles.colorLabel}>
                            <Text style={styles.colorLabelText}>{vehicle.color}</Text>
                        </View>
                    </View>
                </View>

                {/* Info Section */}
                <View style={styles.infoSection}>
                    {/* Vehicle Name & Type */}
                    <View style={styles.nameRow}>
                        <View style={styles.nameContainer}>
                            <Text style={styles.vehicleName} numberOfLines={1}>
                                {vehicle.name}
                            </Text>
                            <Text style={styles.vehicleType}>{vehicle.type}</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    {/* Price & CTA Row */}
                    <View style={styles.actionRow}>
                        <View style={styles.priceContainer}>
                            <View style={styles.priceRow}>
                                <Text style={styles.priceAmount}>
                                    {vehicle.price.toLocaleString("vi-VN")}₫
                                </Text>
                                <Text style={styles.priceUnit}>/ngày</Text>
                            </View>
                            <Text style={styles.priceLabel}>Giá thuê</Text>
                        </View>

                        {/* Enhanced Book Button */}
                        <TouchableOpacity
                            style={styles.bookButton}
                            onPress={(e) => {
                                e.stopPropagation();
                                goToVehicleDetails();
                            }}
                            activeOpacity={0.85}
                        >
                            <LinearGradient
                                colors={["#a78bfa", "#8b5cf6", "#7c4dff"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.bookButtonGradient}
                            >
                                <Text style={styles.bookButtonText}>Đặt xe</Text>
                                <Text style={styles.bookButtonArrow}>→</Text>
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
        width: 240, // Reduced from 260
        borderRadius: 18,
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    gradientBackground: {
        borderRadius: 18,
        borderWidth: 1,
        borderColor: "rgba(157, 127, 245, 0.2)",
        overflow: "hidden",
    },
    glowOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "50%",
        backgroundColor: "rgba(124, 77, 255, 0.03)",
    },
    imageContainer: {
        width: "100%",
        height: 140, // Reduced from 170
        backgroundColor: "#0f0f0f",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        borderBottomWidth: 1,
        borderBottomColor: "rgba(157, 127, 245, 0.1)",
    },
    imageOverlay: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: 60,
        zIndex: 1,
    },
    vehicleImage: {
        width: "90%",
        height: "90%",
    },
    imagePlaceholder: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    placeholderIcon: {
        fontSize: 56,
        opacity: 0.25,
    },
    // Distance Badge - Top Left
    distanceBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 10,
        borderRadius: 10,
        overflow: "hidden",
    },
    distanceBadgeContent: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    distanceIcon: {
        fontSize: 9,
        marginRight: 3,
    },
    distanceText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
    // Range Badge - Top Right
    rangeBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 10,
        borderRadius: 10,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(16, 185, 129, 0.3)",
    },
    rangeBadgeGradient: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    rangeIcon: {
        fontSize: 9,
        marginRight: 3,
    },
    rangeText: {
        color: "#6ee7b7",
        fontSize: 10,
        fontWeight: "700",
    },
    // Enhanced Color Indicator - Bottom Left
    colorIndicatorContainer: {
        position: "absolute",
        bottom: 10,
        left: 10,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 10,
    },
    colorGlow: {
        position: "absolute",
        width: 28,
        height: 28,
        borderRadius: 14,
        opacity: 0.5,
        left: -2,
        top: -2,
    },
    colorDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2.5,
        borderColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
        position: "relative",
    },
    colorHighlight: {
        position: "absolute",
        top: 2,
        left: 2,
        width: 7,
        height: 7,
        borderRadius: 3.5,
        backgroundColor: "rgba(255, 255, 255, 0.4)",
    },
    colorDotBorder: {
        position: "absolute",
        top: -2.5,
        left: -2.5,
        right: -2.5,
        bottom: -2.5,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#888",
    },
    colorLabel: {
        marginLeft: 7,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        paddingHorizontal: 7,
        paddingVertical: 2,
        borderRadius: 7,
    },
    colorLabelText: {
        color: "rgba(255, 255, 255, 0.9)",
        fontSize: 9,
        fontWeight: "600",
    },
    // Info Section
    infoSection: {
        padding: 12,
    },
    nameRow: {
        marginBottom: 8,
    },
    nameContainer: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 2,
        letterSpacing: 0.3,
    },
    vehicleType: {
        fontSize: 10,
        color: "#999",
        fontWeight: "500",
    },
    divider: {
        height: 1,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        marginVertical: 8,
    },
    // Action Row
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
        marginBottom: 1,
    },
    priceAmount: {
        fontSize: 16,
        fontWeight: "800",
        color: "#fff",
    },
    priceUnit: {
        fontSize: 10,
        color: "#888",
        fontWeight: "500",
        marginLeft: 2,
    },
    priceLabel: {
        fontSize: 8,
        color: "#666",
        fontWeight: "500",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    // Enhanced Book Button
    bookButton: {
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.5,
        shadowRadius: 6,
        elevation: 6,
    },
    bookButtonGradient: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "700",
        letterSpacing: 0.6,
    },
    bookButtonArrow: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        marginLeft: 5,
    },
});