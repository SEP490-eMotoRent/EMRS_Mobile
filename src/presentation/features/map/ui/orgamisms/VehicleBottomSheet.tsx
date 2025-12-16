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
import { trackBreadcrumb, trackError } from "../../utils/crashTracker";
import { calculateDistance, formatDistance } from "../../utils/distanceUtils";
import { ElectricVehicle } from "../molecules/VehicleCard";
import { VehicleCarousel } from "./VehicleCarousel";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BOTTOM_SHEET_HEIGHT = 360;

interface VehicleBottomSheetProps {
    visible: boolean;
    vehicles: ElectricVehicle[];
    markerType?: "price" | "cluster";
    onClose: () => void;
    onBookVehicle: (vehicleId: string) => void;
    dateRange?: string;
    location?: string;
    branchLocation?: {
        latitude: number;
        longitude: number;
    };
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
    // Animation value for bottom sheet position
    const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
    
    // Track current animation to prevent race conditions
    const animationRef = useRef<Animated.CompositeAnimation | null>(null);
    
    // Track mounted state to prevent updates after unmount
    const isMountedRef = useRef<boolean>(true);

    /**
     * Calculate distance between branch and searched location
     * Memoized to prevent recalculation on every render
     */
    const distanceKm = useMemo(() => {
        if (!branchLocation || !searchedLocation) return null;
        
        return calculateDistance(
            searchedLocation.latitude,
            searchedLocation.longitude,
            branchLocation.latitude,
            branchLocation.longitude
        );
    }, [branchLocation, searchedLocation]);

    /**
     * Format distance for display
     */
    const formattedDistance = useMemo(() => {
        if (distanceKm === null) return null;
        return formatDistance(distanceKm);
    }, [distanceKm]);

    /**
     * Handle animation with race condition prevention
     * 
     * Critical fixes:
     * 1. Stop previous animation before starting new one
     * 2. Check if component is mounted before finishing
     * 3. Clear animation ref after completion
     */
    useEffect(() => {
        console.log('[VehicleBottomSheet] Visible changed to: ', visible);
        
        // CRITICAL: Stop any in-progress animation first
        if (animationRef.current) {
            console.log('[VehicleBottomSheet] Stopping previous animation');
            animationRef.current.stop();
            animationRef.current = null;
        }

        if (visible) {
            console.log('[VehicleBottomSheet] Starting open animation');
            
            // Create spring animation for smooth opening
            animationRef.current = Animated.spring(translateY, {
                toValue: 0,
                useNativeDriver: true,
                tension: 60,
                friction: 10,
            });
            
            animationRef.current.start(({ finished }) => {
                // Only process completion if animation finished naturally and component is mounted
                if (finished && isMountedRef.current) {
                    console.log('[VehicleBottomSheet] Open animation completed');
                    animationRef.current = null;
                }
            });
        } else {
            console.log('[VehicleBottomSheet] Starting close animation');
            
            // Create timing animation for quick closing
            animationRef.current = Animated.timing(translateY, {
                toValue: BOTTOM_SHEET_HEIGHT,
                duration: 280,
                useNativeDriver: true,
            });
            
            animationRef.current.start(({ finished }) => {
                // Only process completion if animation finished naturally and component is mounted
                if (finished && isMountedRef.current) {
                    console.log('[VehicleBottomSheet] Close animation completed');
                    animationRef.current = null;
                }
            });
        }
    }, [visible, translateY]);

    /**
     * Cleanup: Stop animations and reset position on unmount
     * Prevents crash from animations trying to update unmounted component
     */
    useEffect(() => {
        isMountedRef.current = true;
        
        return () => {
            console.log('[VehicleBottomSheet] Unmounting, cleaning up animations');
            isMountedRef.current = false;
            
            // Stop any running animation
            if (animationRef.current) {
                animationRef.current.stop();
                animationRef.current = null;
            }
            
            // Reset position immediately (no animation)
            translateY.setValue(BOTTOM_SHEET_HEIGHT);
        };
    }, [translateY]);

    // Don't render anything if not visible (performance optimization)
    if (!visible) return null;

    // Ensure vehicles is always an array
    const safeVehicles = Array.isArray(vehicles) ? vehicles : [];

    /**
     * Get title based on marker type
     */
    const getTitle = () => {
        if (markerType === "cluster") {
            return `${safeVehicles.length} Xe Điện`;
        }
        return "Xe Điện Có Sẵn";
    };

    /**
     * Handle close button press with error tracking
     */
    const handleClose = () => {
        try {
            console.log('[VehicleBottomSheet] Close button pressed');
            trackBreadcrumb('👆 Close button pressed');
            onClose();
        } catch (error) {
            console.error('[VehicleBottomSheet] Close handler failed: ', error);
            trackError('JS_ERROR', error, 'Bottom sheet close handler failed');
        }
    };

    /**
     * Handle vehicle booking with validation and error tracking
     */
    const handleBookVehicle = (vehicleId: string) => {
        try {
            if (!vehicleId || typeof vehicleId !== 'string') {
                console.error('[VehicleBottomSheet] Invalid vehicle ID: ', vehicleId);
                trackError('STATE_ERROR', new Error('Invalid vehicle ID'), 'Invalid vehicle ID on book', { vehicleId });
                return;
            }
            console.log('[VehicleBottomSheet] Booking vehicle: ', vehicleId);
            trackBreadcrumb(`📖 Booking vehicle: ${vehicleId}`);
            onBookVehicle(vehicleId);
        } catch (error) {
            console.error('[VehicleBottomSheet] Book vehicle failed: ', error);
            trackError('JS_ERROR', error, 'Book vehicle handler failed', { vehicleId });
        }
    };

    return (
        <Animated.View
            style={[
                styles.container,
                { transform: [{ translateY }] },
            ]}
            pointerEvents="box-none"
        >
            <LinearGradient
                colors={['rgba(212, 197, 249, 0.2)', 'rgba(124, 77, 255, 0.05)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientBorder}
            >
                <View style={styles.content}>
                    {/* Header with handle bar, title, and close button */}
                    <View style={styles.header}>
                        <View style={styles.handleBar} />
                        
                        <View style={styles.headerContent}>
                            <View style={styles.titleSection}>
                                <Text style={styles.icon}>🏍️</Text>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{getTitle()}</Text>
                                    {/* Distance badge - only show if we have distance data */}
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

                    {/* Vehicle carousel */}
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
        paddingBottom: 6,
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
        paddingBottom: 4,
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