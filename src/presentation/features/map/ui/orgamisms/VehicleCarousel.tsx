import React, { useRef, useState } from "react";
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from "react-native";
import { ElectricVehicle, VehicleCard } from "../molecules/VehicleCard";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = 320;
const CARD_SPACING = 12;

interface VehicleCarouselProps {
    vehicles: ElectricVehicle[];
    onBookVehicle: (vehicleId: number) => void;
}

export const VehicleCarousel: React.FC<VehicleCarouselProps> = ({ vehicles, onBookVehicle }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const index = Math.round(scrollPosition / (CARD_WIDTH + CARD_SPACING));
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
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
                    />
                ))}
            </ScrollView>

            {/* Pagination Dots */}
            {vehicles.length > 1 && (
                <View style={styles.paginationContainer}>
                    {vehicles.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.paginationDot,
                                index === activeIndex && styles.activeDot,
                            ]}
                        />
                    ))}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    scrollContent: {
        paddingLeft: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        paddingRight: (SCREEN_WIDTH - CARD_WIDTH) / 2,
        paddingVertical: 2,
    },
    paginationContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 4,
    },
    paginationDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: "#444",
        marginHorizontal: 2.5,
    },
    activeDot: {
        backgroundColor: "#7c4dff",
        width: 16,
    },
});