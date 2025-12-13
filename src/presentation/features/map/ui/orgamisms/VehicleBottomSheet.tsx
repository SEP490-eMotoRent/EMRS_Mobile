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
import { trackBreadcrumb, trackError } from "../../utils/crashTracker";

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
    const translateY = useRef(new Animated.Value(BOTTOM_SHEET_HEIGHT)).current;
    const animationInProgress = useRef(false);
    const currentAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
    const lastVisibleState = useRef<boolean>(false); // ✅ NEW: Track last state

    const distanceKm = useMemo(() => {
        if (!branchLocation || !searchedLocation) return null;
        
        return calculateDistance(
            searchedLocation.latitude,
            searchedLocation.longitude,
            branchLocation.latitude,
            branchLocation.longitude
        );
    }, [branchLocation, searchedLocation]);

    const formattedDistance = useMemo(() => {
        if (distanceKm === null) return null;
        return formatDistance(distanceKm);
    }, [distanceKm]);

    useEffect(() => {
        // ✅ CRITICAL: Skip if state didn't actually change
        if (lastVisibleState.current === visible) {
            return;
        }
        lastVisibleState.current = visible;

        try {
            trackBreadcrumb(`🎬 Animation trigger: visible=${visible}, inProgress=${animationInProgress.current}`);

            // ✅ CRITICAL: Force stop any running animation FIRST
            if (currentAnimationRef.current) {
                trackBreadcrumb('⏹️ Force stopping previous animation');
                currentAnimationRef.current.stop();
                currentAnimationRef.current = null;
            }
            
            // Stop the native animation
            translateY.stopAnimation(() => {
                // After native animation stops, reset flag
                animationInProgress.current = false;
            });

            // ✅ Wait a tick to ensure native cleanup
            setTimeout(() => {
                if (animationInProgress.current) {
                    trackBreadcrumb('⚠️ Animation still in progress after cleanup, aborting');
                    return;
                }

                animationInProgress.current = true;

                if (visible) {
                    trackBreadcrumb(`📈 Opening bottom sheet (${vehicles?.length || 0} vehicles)`);
                    
                    // Reset position
                    translateY.setValue(BOTTOM_SHEET_HEIGHT);
                    
                    // Create animation
                    currentAnimationRef.current = Animated.spring(translateY, {
                        toValue: 0,
                        useNativeDriver: true,
                        tension: 50,
                        friction: 9,
                    });

                    currentAnimationRef.current.start(({ finished }) => {
                        if (finished) {
                            trackBreadcrumb('✅ Open animation completed');
                        } else {
                            trackBreadcrumb('⚠️ Open animation interrupted');
                        }
                        animationInProgress.current = false;
                        currentAnimationRef.current = null;
                    });
                } else {
                    trackBreadcrumb('📉 Closing bottom sheet');
                    
                    // Create animation
                    currentAnimationRef.current = Animated.timing(translateY, {
                        toValue: BOTTOM_SHEET_HEIGHT,
                        duration: 250,
                        useNativeDriver: true,
                    });

                    currentAnimationRef.current.start(({ finished }) => {
                        if (finished) {
                            trackBreadcrumb('✅ Close animation completed');
                        } else {
                            trackBreadcrumb('⚠️ Close animation interrupted');
                        }
                        animationInProgress.current = false;
                        currentAnimationRef.current = null;
                    });
                }
            }, 16); // ✅ One frame delay (16ms) to ensure cleanup
            
        } catch (error) {
            trackError('ANIMATION_ERROR', error, 'Bottom sheet animation failed', {
                visible,
                vehicleCount: vehicles?.length,
                animationInProgress: animationInProgress.current,
            });
            animationInProgress.current = false;
            currentAnimationRef.current = null;
        }
    }, [visible, translateY, vehicles?.length]);

    // ✅ Cleanup on unmount
    useEffect(() => {
        return () => {
            trackBreadcrumb('🧹 Cleaning up bottom sheet animations');
            if (currentAnimationRef.current) {
                currentAnimationRef.current.stop();
                currentAnimationRef.current = null;
            }
            translateY.stopAnimation();
            animationInProgress.current = false;
        };
    }, [translateY]);

    // ✅ Don't render at all when not visible
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
            trackBreadcrumb('👆 Close button pressed');
            onClose();
        } catch (error) {
            trackError('JS_ERROR', error, 'Bottom sheet close handler failed');
        }
    };

    const handleBookVehicle = (vehicleId: string) => {
        try {
            if (!vehicleId || typeof vehicleId !== 'string') {
                trackError('STATE_ERROR', new Error('Invalid vehicle ID'), 'Invalid vehicle ID on book', { vehicleId });
                return;
            }
            trackBreadcrumb(`📖 Booking vehicle: ${vehicleId}`);
            onBookVehicle(vehicleId);
        } catch (error) {
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
                    <View style={styles.header}>
                        <View style={styles.handleBar} />
                        
                        <View style={styles.headerContent}>
                            <View style={styles.titleSection}>
                                <Text style={styles.icon}>🏍️</Text>
                                <View style={styles.titleContainer}>
                                    <Text style={styles.title}>{getTitle()}</Text>
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