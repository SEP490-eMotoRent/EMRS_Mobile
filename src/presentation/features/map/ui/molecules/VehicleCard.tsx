import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
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
}

/**
 * Calculates total price based on daily rate and rental duration (including hours)
 * Formula: (dailyRate / 24) * totalHours
 */
const calculateTotalPrice = (dailyRate: number, rentalDays: number): string => {
    const totalHours = rentalDays * 24;
    const hourlyRate = dailyRate / 24;
    const totalPrice = Math.round(hourlyRate * totalHours);
    return `${totalPrice.toLocaleString('vi-VN')}đ`;
};

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onBookPress }) => {
    const navigation = useNavigation<VehicleCardNavigationProp>();

    const handleCardPress = () => {
        navigation.navigate('VehicleDetails', { vehicleId: vehicle.id });
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={handleCardPress}
            activeOpacity={0.9}
        >
            {/* Vehicle Image - Full Width */}
            <View style={styles.imageContainer}>
                {vehicle.imageUrl ? (
                    <Image
                        source={{ uri: vehicle.imageUrl }}
                        style={styles.vehicleImage}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.vehicleImagePlaceholder}>🛵</Text>
                )}
            </View>

            {/* Vehicle Info */}
            <View style={styles.infoSection}>
                <View style={styles.brandContainer}>
                    <View style={styles.brandLogo}>
                        <Text style={styles.brandIcon}>⚡</Text>
                    </View>
                    <View style={styles.brandInfo}>
                        <Text style={styles.vehicleName}>{vehicle.name}</Text>
                        <Text style={styles.vehicleType}>{vehicle.type}</Text>
                    </View>
                </View>

                {/* Specs Row */}
                <View style={styles.specsRow}>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>🔋</Text>
                        <Text style={styles.specText}>{vehicle.range}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <Text style={styles.specIcon}>⚡</Text>
                        <Text style={styles.specText}>{vehicle.battery}</Text>
                    </View>
                    <View style={styles.specItem}>
                        <View style={[styles.colorDot, { backgroundColor: vehicle.colorHex }]}>
                            {vehicle.color === "Trắng" && <View style={styles.colorDotBorder} />}
                        </View>
                        <Text style={styles.specText}>{vehicle.color}</Text>
                    </View>
                </View>

                {/* Price & Book Button */}
                <View style={styles.footer}>
                    <View style={styles.priceSection}>
                        <Text style={styles.price}>{vehicle.price.toLocaleString('vi-VN')}đ / ngày</Text>
                        <Text style={styles.total}>
                            Tổng {calculateTotalPrice(vehicle.price, vehicle.rentalDays || 1)}
                        </Text>
                    </View>
                    <TouchableOpacity 
                        style={styles.bookButton}
                        onPress={(e) => {
                            e.stopPropagation();
                            onBookPress(vehicle.id);
                        }}
                    >
                        <Text style={styles.bookButtonText}>Đặt xe</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2a2a2a",
        borderRadius: 16,
        marginHorizontal: 8,
        width: 320,
        overflow: "hidden",
    },
    imageContainer: {
        width: "100%",
        height: 100,
        backgroundColor: "#1f1f1f",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
    },
    vehicleImage: {
        width: "100%",
        height: "100%",
    },
    vehicleImagePlaceholder: {
        fontSize: 40,
    },
    infoSection: {
        padding: 10,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 6,
    },
    brandLogo: {
        width: 32,
        height: 32,
        backgroundColor: "#3a3a3a",
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
        marginRight: 8,
    },
    brandIcon: {
        fontSize: 16,
    },
    brandInfo: {
        flex: 1,
    },
    vehicleName: {
        fontSize: 14,
        fontWeight: "700",
        color: "#fff",
    },
    vehicleType: {
        fontSize: 10,
        color: "#999",
        marginTop: 1,
    },
    specsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 6,
        borderTopWidth: 1,
        borderTopColor: "#3a3a3a",
        marginBottom: 8,
    },
    specItem: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "center",
        gap: 4,
    },
    specIcon: {
        fontSize: 14,
    },
    specText: {
        fontSize: 10,
        color: "#ccc",
        fontWeight: "500",
    },
    colorDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 2,
        borderColor: "#2a2a2a",
    },
    colorDotBorder: {
        position: "absolute",
        top: -2,
        left: -2,
        right: -2,
        bottom: -2,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#666",
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    priceSection: {
        flex: 1,
    },
    price: {
        fontSize: 15,
        fontWeight: "700",
        color: "#fff",
    },
    total: {
        fontSize: 10,
        color: "#999",
        marginTop: 1,
    },
    bookButton: {
        backgroundColor: "#7c4dff",
        paddingHorizontal: 20,
        paddingVertical: 9,
        borderRadius: 10,
    },
    bookButtonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "700",
    },
});