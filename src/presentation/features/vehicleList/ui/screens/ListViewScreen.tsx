// src/presentation/features/vehicleList/ui/ListView.tsx
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListHeader } from "../orgamism/ListHeader";
import { ListControls } from "../orgamism/ListControls";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { MapViewButton } from "../atoms/buttons/MapViewButtons";
import { useVehicleModels } from "../../hooks/useVehicleModels";
import { VehicleModelMapper } from "../../mappers/VehicleModelMapper";
import { EmptyState } from "../molecules/state/EmptyState";
import { ErrorState } from "../molecules/state/ErrorState";
import { LoadingState } from "../molecules/state/LoadingState";
import { MotorcycleCard } from "../orgamism/MotorcycleCard";

type ListViewRouteProp = RouteProp<BrowseStackParamList, "ListView">;
type ListViewNavigationProp = StackNavigationProp<BrowseStackParamList, "ListView">;

type SortType = "closest" | "price-low" | "price-high";

export const ListView: React.FC = () => {
    const route = useRoute<ListViewRouteProp>();
    const navigation = useNavigation<ListViewNavigationProp>();

    const { vehicleModels, loading, error, refetch } = useVehicleModels();

    const [sortBy, setSortBy] = useState<SortType>("closest");
    const [bookingModalVisible, setBookingModalVisible] = useState(false);

    const { location, dateRange, address } = route.params || {
        location: "Ho Chi Minh City, Vietnam",
        dateRange: "Oct 20 | 10:00 AM - Oct 23 | 10:00 AM",
        address: "Ho Chi Minh City, Vietnam",
    };

    const motorcycles = useMemo(() => {
        return VehicleModelMapper.toMotorcycles(vehicleModels);
    }, [vehicleModels]);

    const sortedMotorcycles = useMemo(() => {
        const sorted = [...motorcycles].sort((a, b) => {
        if (sortBy === "closest") return a.distance - b.distance;
        if (sortBy === "price-low") return a.price - b.price;
        if (sortBy === "price-high") return b.price - a.price;
        return 0;
        });
        return sorted;
    }, [motorcycles, sortBy]);

    const handleSortPress = () => {
        if (sortBy === "closest") setSortBy("price-low");
        else if (sortBy === "price-low") setSortBy("price-high");
        else setSortBy("closest");
    };

    const getSortLabel = () => {
        if (sortBy === "closest") return "Closest To Address";
        if (sortBy === "price-low") return "Price: Low to High";
        return "Price: High to Low";
    };

    const handleMapViewPress = () => {
        navigation.navigate("Map", { location, dateRange, address });
    };

    const handleSearchPress = () => {
        setBookingModalVisible(true);
    };

    const renderEmptyComponent = () => {
        if (loading) return <LoadingState />;
        if (error) return <ErrorState message={error} onRetry={refetch} />;
        return <EmptyState onAction={refetch} />;
    };

    return (
        <View style={styles.container}>
        <FlatList
            data={sortedMotorcycles}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => <MotorcycleCard motorcycle={item} />}
            ListHeaderComponent={
            <>
                <ListHeader
                location={address}
                dateRange={dateRange}
                onSearchPress={handleSearchPress}
                onPricePress={() => console.log("Price filter")}
                onModelPress={() => console.log("Model filter")}
                onRangePress={() => console.log("Range filter")}
                />
                <ListControls
                totalResults={motorcycles.length}
                sortLabel={getSortLabel()}
                onSortPress={handleSortPress}
                />
            </>
            }
            ListEmptyComponent={renderEmptyComponent}
            contentContainerStyle={
            sortedMotorcycles.length === 0 ? styles.emptyListContent : styles.listContent
            }
            stickyHeaderIndices={[0]}
            refreshing={loading}
            onRefresh={refetch}
        />

        <View style={styles.mapButtonContainer}>
            <MapViewButton onPress={handleMapViewPress} />
        </View>

        <BookingModal
            visible={bookingModalVisible}
            onClose={() => setBookingModalVisible(false)}
        />
        </View>
    );
    };

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    listContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
    },
    emptyListContent: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 100,
        flexGrow: 1,
    },
    mapButtonContainer: {
        position: "absolute",
        bottom: 25,
        alignSelf: "center",
    },
});