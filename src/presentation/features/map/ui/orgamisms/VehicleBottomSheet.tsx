import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { calculateDistance, formatDistance } from "../../utils/distanceUtils";
import { ElectricVehicle } from "../molecules/VehicleCard";
import { VehicleCarousel } from "./VehicleCarousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 360; // ✅ Increased from 300 to 360

interface VehicleBottomSheetProps {
    visible: boolean;
    vehicles: ElectricVehicle[];
    markerType?: "price" | "cluster";
    onClose: () => void;
    onBookVehicle: (vehicleId: string) => void;
    dateRange?: string;
    location?: string;
    // ✅ NEW: Branch location for distance calculation
    branchLocation?: {
        latitude: number;
        longitude: number;
    };
    // ✅ NEW: Searched location (user's search/current location)
    searchedLocation?: {
        latitude: number;
        longitude: number;
    };
}

export const VehicleBottomSheet: React.FC<VehicleBottomSheetProps> = ({
    visible,
    vehicles,
    markerType = "price",
    onClose,
    onBookVehicle,
    dateRange,
    location,
    branchLocation,
    searchedLocation,
}) => {
    const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
    const animationInProgress = useRef(false);

    // ✅ Calculate distance ONCE when branch is selected
    const distanceKm = useMemo(() => {
        if (!branchLocation || !searchedLocation) return null;
        
        return calculateDistance(
            searchedLocation.latitude,
            searchedLocation.longitude,
            branchLocation.latitude,
            branchLocation.longitude
        );
    }, [branchLocation, searchedLocation]);

    // ✅ Format distance for display
    const formattedDistance = useMemo(() => {
        if (distanceKm === null) return null;
        return formatDistance(distanceKm);
    }, [distanceKm]);

    useEffect(() => {
        if (animationInProgress.current) return;

        try {
            if (visible) {
                animationInProgress.current = true;
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 50,
                    friction: 9,
                }).start(() => {
                    animationInProgress.current = false;
                });
            } else {
                animationInProgress.current = true;
                Animated.timing(translateY, {
                    toValue: BOTTOM_SHEET_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                }).start(() => {
                    animationInProgress.current = false;
                });
            }
        } catch (error) {
            console.error('Animation error:', error);
            animationInProgress.current = false;
        }
    }, [visible, translateY]);

    if (!visible) return null;

    const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

    const getTitle = () => {
        if (markerType === "cluster") {
            return `${safeVehicles.length} Xe Điện`;
        }
        return "Xe Điện Có Sẵn";
    };

    const handleClose = () => {
        try {
            onClose();
        } catch (error) {
            console.error('Error closing bottom sheet:', error);
        }
    };

    const handleBookVehicle = (vehicleId: string) => {
        try {
            if (!vehicleId || typeof vehicleId !== 'string') {
                console.warn('Invalid vehicle ID:', vehicleId);
                return;
            }
            onBookVehicle(vehicleId);
        } catch (error) {
            console.error('Error booking vehicle:', error);
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY }] },
            ]}
        >
            <LinearGradient
                colors={['rgba(212, 197, 249, 0.2)', 'rgba(124, 77, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.content}>
                    {/* Compact Header */}
                    <View style={styles.header}>
                        <View style={styles.handleBar} />
                        
                        <View style={styles.headerContent}>
                            <View style={styles.titleSection}>
                                <Text style={styles.icon}>🏍️</Text>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{getTitle()}</Text>
                                    {/* ✅ NEW: Distance indicator */}
                                    {formattedDistance && (
                                        <View style={styles.distanceBadge}>
                                            <Text style={styles.distanceIcon}>📍</Text>
                                            <Text style={styles.distanceText}>{formattedDistance}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                            
                            <TouchableOpacity 
                                onPress={handleClose} 
                                style={styles.closeButton}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Carousel or Empty */}
                    <View style={styles.carouselContainer}>
                        {safeVehicles.length > 0 ? (
                            <VehicleCarousel 
                                vehicles={safeVehicles} 
                                onBookVehicle={handleBookVehicle}
                                dateRange={dateRange}
                                location={location}
                            />
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyIcon}>🔍</Text>
                                <Text style={styles.emptyText}>Không Có Xe</Text>
                            </View>
                        )}
                    </View>
                </View>
            </LinearGradient>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        bottom: 30,
        left: 0,
        right: 0,
        height: BOTTOM_SHEET_HEIGHT,
        zIndex: 99,
    },
    gradientBorder: {
        flex: 1,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 1,
    },
    content: {
        flex: 1,
        backgroundColor: "#0a0a0a",
        borderTopLeftRadius: 23,
        borderTopRightRadius: 23,
    },
    header: {
        paddingTop: 6,
        paddingHorizontal: 16,
        paddingBottom: 6, // ✅ Reduced from 8 to give carousel more space
    },
    handleBar: {
        width: 36,
        height: 4,
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
    titleSection: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        flex: 1,
    },
    icon: {
        fontSize: 20,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: "700",
        color: "#fff",
        marginBottom: 4,
    },
    // ✅ NEW: Distance badge styles
    distanceBadge: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(124, 77, 255, 0.15)",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
        alignSelf: "flex-start",
        borderWidth: 1,
        borderColor: "rgba(124, 77, 255, 0.3)",
    },
    distanceIcon: {
        fontSize: 10,
        marginRight: 4,
    },
    distanceText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#d4c5f9",
    },
    closeButton: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.1)",
    },
    closeButtonText: {
        fontSize: 18,
        color: "#fff",
        fontWeight: "300",
    },
    carouselContainer: {
        flex: 1,
        paddingBottom: 4, // ✅ Reduced from 8 to maximize carousel height
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    emptyIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    emptyText: {
        fontSize: 14,
        fontWeight: "600",
        color: "#888",
    },
});