import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { ElectricVehicle, VehicleCard } from "../molecules/VehicleCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 260;
const CARD_SPACING = 12;
const ITEM_WIDTH = CARD_WIDTH + CARD_SPACING;

interface VehicleCarouselProps {
    vehicles: ElectricVehicle[];
    onBookVehicle: (vehicleId: string) => void;
    dateRange?: string;
    location?: string;
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({
    vehicles,
    onBookVehicle,
    dateRange,
    location,
}) => {
    // Animated value for scroll position
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef<FlatList>(null);
    
    // Track mounted state
    const isMountedRef = useRef<boolean>(true);

    /**
     * FIXED: Lifecycle tracking and cleanup
     * - Commented out console.logs for performance
     * - Added proper animation cleanup
     */
    useEffect(() => {
        isMountedRef.current = true;
        // console.log('[VehicleCarousel] Mounted with ', vehicles.length, ' vehicles');
        
        return () => {
            // console.log('[VehicleCarousel] Unmounting');
            isMountedRef.current = false;
            
            // CRITICAL: Stop scroll animation on unmount to prevent memory leaks
            scrollX.stopAnimation();
        };
    }, [scrollX]); // FIXED: Removed vehicles.length from deps to prevent unnecessary cleanup

    // Empty state
    if (!vehicles || vehicles.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>🔍</Text>
                <Text style={styles.emptyText}>Không có xe nào</Text>
            </View>
        );
    }

    /**
     * CRITICAL FIX: FlatList instead of ScrollView
     * - Only renders visible items + buffer
     * - Massive performance improvement with 50+ vehicles
     */
    const renderItem = ({ item, index }: { item: ElectricVehicle; index: number }) => (
        <View style={styles.cardWrapper}>
            <VehicleCard
                vehicle={item}
                onBookPress={onBookVehicle}
                dateRange={dateRange}
                location={location}
            />
        </View>
    );

    /**
     * CRITICAL FIX: Limited pagination dots
     * - Only show dots for 2-20 vehicles
     * - Prevents creating 100+ animated interpolations
     * - For 50+ vehicles, no pagination shown (performance)
     */
    const renderPagination = () => {
        // Only show pagination if we have 2-20 vehicles
        if (vehicles.length <= 1 || vehicles.length > 20) return null;

        return (
            <View style={styles.pagination}>
                {vehicles.map((_, index) => {
                    // Calculate input range for smooth interpolation
                    const inputRange = [
                        (index - 1) * ITEM_WIDTH,
                        index * ITEM_WIDTH,
                        (index + 1) * ITEM_WIDTH,
                    ];

                    // Interpolate scale for zoom effect
                    const scale = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.6, 1.3, 0.6],
                        extrapolate: "clamp",
                    });

                    // Interpolate opacity for fade effect
                    const opacity = scrollX.interpolate({
                        inputRange,
                        outputRange: [0.4, 1, 0.4],
                        extrapolate: "clamp",
                    });

                    return (
                        <Animated.View
                            key={`dot-${index}`}
                            style={[
                                styles.dot,
                                { 
                                    transform: [{ scale }], 
                                    opacity 
                                },
                            ]}
                        />
                    );
                })}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={vehicles}
                renderItem={renderItem}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={ITEM_WIDTH}
                snapToAlignment="center"
                contentContainerStyle={styles.content}
                scrollEventThrottle={16}
                directionalLockEnabled={true}
                overScrollMode="never"
                // CRITICAL: Performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={3}
                initialNumToRender={3}
                windowSize={5}
                // Optimize layout calculations
                getItemLayout={(data, index) => ({
                    length: ITEM_WIDTH,
                    offset: ITEM_WIDTH * index,
                    index,
                })}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { 
                        useNativeDriver: false, // Must be false for scroll animations
                        // FIXED: Commented out listener console.log
                        // listener: (event: any) => {
                        //     console.log('[VehicleCarousel] Scroll X:', event.nativeEvent.contentOffset.x);
                        // }
                    }
                )}
            />

            {/* Pagination dots - limited to 20 vehicles max */}
            {renderPagination()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1,
    },
    content: {
        paddingHorizontal: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        paddingVertical: 12,
        alignItems: "center",
    },
    cardWrapper: {
        width: CARD_WIDTH,
        marginHorizontal: CARD_SPACING / 2,
    },
    pagination: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 12,
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: "#d4c5f9",
        marginHorizontal: 4,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyIcon: {
        fontSize: 36,
        marginBottom: 8,
        opacity: 0.6,
    },
    emptyText: {
        fontSize: 15,
        color: "#888",
        fontWeight: "600",
    },
});