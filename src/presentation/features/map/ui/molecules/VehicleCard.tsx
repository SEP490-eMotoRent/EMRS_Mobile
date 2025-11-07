import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";

export interface ElectricVehicle {
    id: number;
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
}

type VehicleCardNavigationProp = StackNavigationProp<BrowseStackParamList>;

interface VehicleCardProps {
    vehicle: ElectricVehicle;
    onBookPress: (vehicleId: number) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onBookPress }) => {
    const navigation = useNavigation<VehicleCardNavigationProp>();

    const handleCardPress = () => {
        navigation.navigate('VehicleDetails', { vehicleId: vehicle.id.toString() });
    };

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={handleCardPress}
            activeOpacity={0.9}
        >
            {/* Phần trên: Thương hiệu & Hình xe */}
            <View style={styles.topSection}>
                <View style={styles.brandContainer}>
                    <View style={styles.brandLogo}>
                        <Text style={styles.brandIcon}>⚡</Text>
                    </View>
                    <View style={styles.brandInfo}>
                        <Text style={styles.vehicleName}>{vehicle.name}</Text>
                        <Text style={styles.vehicleType}>{vehicle.type}</Text>
                    </View>
                </View>

                <View style={styles.vehicleImageContainer}>
                    <Text style={styles.vehicleImage}>🛵</Text>
                </View>
            </View>

            {/* Hàng thông số */}
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

            {/* Giá & Nút đặt xe */}
            <View style={styles.footer}>
                <View style={styles.priceSection}>
                    <Text style={styles.price}>{vehicle.price.toLocaleString('vi-VN')}đ / ngày</Text>
                    <Text style={styles.total}>Tổng { (vehicle.price * 3).toLocaleString('vi-VN') }đ</Text>
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
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#2a2a2a",
        borderRadius: 16,
        padding: 12,
        marginHorizontal: 8,
        width: 320,
    },
    topSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    brandContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
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
    vehicleImageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    vehicleImage: {
        fontSize: 60,
    },
    specsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 8,
        borderTopWidth: 1,
        borderTopColor: "#3a3a3a",
        marginBottom: 10,
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