import React, { useEffect, useRef } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Animated, Dimensions } from "react-native";
import { VehicleCarousel } from "./VehicleCarousel";
import { ElectricVehicle } from "../molecules/VehicleCard";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 280;

interface VehicleBottomSheetProps {
    visible: boolean;
    vehicles: ElectricVehicle[];
    markerType?: "price" | "cluster";
    onClose: () => void;
    onBookVehicle: (vehicleId: number) => void;
}

export const VehicleBottomSheet: React.FC<VehicleBottomSheetProps> = ({
    visible,
    vehicles,
    markerType = "price",
    onClose,
    onBookVehicle,
}) => {
    const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;

    useEffect(() => {
        if (visible) {
            Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 8,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: BOTTOM_SHEET_HEIGHT,
                duration: 250,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    // Don't render at all if not visible (instead of checking _value)
    if (!visible) {
        return null;
    }

    const getTitle = () => {
        if (markerType === "cluster") {
            return `${vehicles.length} Electric Vehicles Available`;
        }
        return "Available Electric Vehicles";
    };

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    transform: [{ translateY }],
                },
            ]}
        >
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.handleBar} />
                <View style={styles.headerContent}>
                    <Text style={styles.title}>{getTitle()}</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Vehicle Carousel */}
            <VehicleCarousel vehicles={vehicles} onBookVehicle={onBookVehicle} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 60,
        left: 16,
        right: 16,
        height: BOTTOM_SHEET_HEIGHT,
        backgroundColor: "#1a1a1a",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 8,
    },
    handleBar: {
        width: 32,
        height: 3,
        backgroundColor: "#444",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 8,
    },
    headerContent: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        fontSize: 14,
        fontWeight: "700",
        color: "#fff",
    },
    closeButton: {
        padding: 2,
    },
    closeButtonText: {
        fontSize: 20,
        color: "#999",
        fontWeight: "300",
    },
});