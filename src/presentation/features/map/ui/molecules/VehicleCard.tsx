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
            activeOpacity={0.95}
        >
            <LinearGradient
                colors={['#1f1f1f', '#0a0a0a']}
                style={styles.gradientBackground}
            >
                {/* Brand Badge - Top Right */}
                <View style={styles.brandBadge}>
                    <Text style={styles.brandText}>{vehicle.brand}</Text>
                </View>

                {/* Image */}
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
                    
                    {/* Color Dot */}
                    <View style={styles.colorDotContainer}>
                        <View style={[styles.colorDot, { backgroundColor: vehicle.colorHex }]}>
                            {vehicle.color === "Trắng" && <View style={styles.colorDotBorder} />}
                        </View>
                    </View>
                </View>

                {/* Info Section - Compact */}
                <View style={styles.infoSection}>
                    <View style={styles.nameRow}>
                        {/* Name & Type */}
                        <View style={styles.nameContainer}>
                            <Text style={styles.vehicleName} numberOfLines={1}>
                                {vehicle.name}
                            </Text>
                            <Text style={styles.vehicleType}>{vehicle.type}</Text>
                        </View>

                        {/* Price */}
                        <View style={styles.priceContainer}>
                            <Text style={styles.priceAmount}>
                                {vehicle.price.toLocaleString('vi-VN')}₫
                            </Text>
                            <Text style={styles.priceUnit}>/ngày</Text>
                        </View>
                    </View>

                    {/* ✅ REMOVED: Total price section */}

                    {/* Book Button */}
                    <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onBookPress(vehicle.id);
                        }}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#9d7ff5', '#7c4dff']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.bookButtonGradient}
                        >
                            <Text style={styles.bookButtonText}>Đặt xe</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 8,
        width: 260, // ✅ Smaller (was 300)
        borderRadius: 16,
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    gradientBackground: {
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "rgba(124, 77, 255, 0.2)",
    },
    brandBadge: {
        position: "absolute",
        top: 10,
        right: 10,
        backgroundColor: "rgba(124, 77, 255, 0.9)",
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        zIndex: 10,
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
    },
    brandText: {
        color: "#fff",
        fontSize: 9,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    imageContainer: {
        width: "100%",
        height: 110, // ✅ Smaller (was 140)
        backgroundColor: "#1a1a1a",
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
        fontSize: 40,
        opacity: 0.5,
    },
    colorDotContainer: {
        position: "absolute",
        bottom: 8,
        left: 10,
    },
    colorDot: {
        width: 16,
        height: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#0a0a0a",
    },
    colorDotBorder: {
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#666",
    },
    infoSection: {
        padding: 12, // ✅ Less padding (was 14)
    },
    nameRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10, // ✅ More space for button (was 8)
    },
    nameContainer: {
        flex: 1,
        marginRight: 8,
    },
    vehicleName: {
        fontSize: 15, // ✅ Slightly smaller (was 16)
        fontWeight: "700",
        color: "#fff",
        marginBottom: 2,
    },
    vehicleType: {
        fontSize: 10, // ✅ Smaller (was 11)
        color: "#999",
        fontWeight: "500",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "baseline",
    },
    priceAmount: {
        fontSize: 16, // ✅ Smaller (was 18)
        fontWeight: "800",
        color: "#fff",
    },
    priceUnit: {
        fontSize: 10, // ✅ Smaller (was 11)
        color: "#888",
        fontWeight: "500",
        marginLeft: 2,
    },
    bookButton: {
        borderRadius: 10,
        overflow: "hidden",
        shadowColor: "#7c4dff",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    bookButtonGradient: {
        paddingVertical: 10, // ✅ Smaller (was 12)
        alignItems: "center",
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 13, // ✅ Smaller (was 14)
        fontWeight: "700",
        letterSpacing: 0.5,
    },
});