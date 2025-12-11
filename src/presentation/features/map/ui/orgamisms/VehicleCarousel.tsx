import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    StyleSheet,
    View
} from "react-native";
import { ElectricVehicle, VehicleCard } from "../molecules/VehicleCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 260;
const CARD_SPACING = 12;

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
    location
}) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;

    const handleScroll = Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        {
            useNativeDriver: false,
            listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
                const scrollPosition = event.nativeEvent.contentOffset.x;
                const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
                setActiveIndex(index);
            },
        }
    );

    return (
        <View style={styles.container}>
            {/* Scrollable Cards */}
            <View style={styles.scrollWrapper}>
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={CARD_WIDTH + CARD_SPACING}
                    snapToAlignment="center"
                    contentContainerStyle={styles.scrollContent}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                >
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                            onBookPress={onBookVehicle}
                            dateRange={dateRange}
                            location={location}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Simple Pagination */}
            {/* {vehicles.length > 1 && (
                <View style={styles.paginationContainer}>
                    {vehicles.map((_, index) => {
                        const isActive = index === activeIndex;
                        return (
                            <View
                                key={index}
                                style={[
                                    styles.paginationDot,
                                    isActive && styles.activeDot,
                                ]}
                            />
                        );
                    })}
                </View>
            )} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollWrapper: {
        flex: 1,
    },
    scrollContent: {
        paddingLeft: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        paddingRight: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        paddingTop: 12, // ✅ Increased from 8 (more top padding)
        paddingBottom: 8, // ✅ Increased from 4 (more bottom padding)
    },
    // paginationContainer: {
    //     flexDirection: "row",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     paddingTop: 6, // ✅ Increased from 4
    //     paddingBottom: 12, // ✅ Increased from 8 (more bottom space)
    // },
    // paginationDot: {
    //     width: 6,
    //     height: 6,
    //     borderRadius: 3,
    //     backgroundColor: "#444",
    //     marginHorizontal: 3,
    // },
    // activeDot: {
    //     backgroundColor: "#d4c5f9",
    //     width: 18,
    //     borderRadius: 3,
    // },
});