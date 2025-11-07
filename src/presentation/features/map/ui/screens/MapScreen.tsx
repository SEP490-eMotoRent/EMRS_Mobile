import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";

// Custom hooks
import { useBranches } from "../../hooks/useBranches";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { useMapRegion } from "../../hooks/useMapRegion";

type MapScreenRouteProp = RouteProp<BrowseStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Map'>;

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    // Get navigation parameters
    const { location, dateRange, address } = route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Chọn Ngày",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    };

    // Custom hooks for state management
    const { branches, loading, error, refetch } = useBranches();
    const { region, setRegion, searchedLocation } = useMapRegion({ branches, address });
    const {
        selectedBranchId,
        bottomSheetVisible,
        selectedVehicles,
        bookingModalVisible,
        handleBranchMarkerPress,
        handleMapPress,
        handleBottomSheetClose,
        handleSearchBarPress,
        handleBookingModalClose,
        handleBookVehicle,
    } = useMapInteractions();

    // Navigation handlers
    const handleListViewPress = () => {
        navigation.navigate('ListView', { location, dateRange, address });
    };

    // Loading state
    if (loading && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading branches...</Text>
            </View>
        );
    }

    // Error state
    if (error && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>Error: {error}</Text>
                <Text style={styles.retryText} onPress={refetch}>
                    Tap to retry
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Map */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChangeComplete={setRegion}
                onPress={handleMapPress}
            >
                {/* Searched Location Pin */}
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        anchor={{ x: 0.5, y: 0.92 }}
                    >
                        <LocationPinMarker />
                    </Marker>
                )}

                {/* Branch Markers */}
                {branches.map((branch) => (
                    <Marker
                        key={branch.id}
                        coordinate={{
                            latitude: branch.latitude,
                            longitude: branch.longitude,
                        }}
                        onPress={() => handleBranchMarkerPress(branch)}
                        anchor={{ x: 0.5, y: 0.75 }}
                    >
                        <BranchMarker isSelected={selectedBranchId === branch.id} />
                    </Marker>
                ))}
            </MapView>

            {/* Search Bar Overlay */}
            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            {/* Filters */}
            <View style={styles.filtersContainer}>
                <MapFilters
                    onPricePress={() => console.log("Price filter")}
                    onModelPress={() => console.log("Model filter")}
                    onAutopilotPress={() => console.log("Range filter")}
                    onRefreshPress={refetch}
                />
            </View>

            {/* List View Button */}
            <View style={[
                styles.listViewContainer,
                bottomSheetVisible && styles.listViewContainerRaised
            ]}>
                <ListViewButton onPress={handleListViewPress} />
            </View>

            {/* Booking Modal */}
            <BookingModal
                visible={bookingModalVisible}
                onClose={handleBookingModalClose}
            />

            {/* Vehicle Bottom Sheet */}
            <VehicleBottomSheet
                visible={bottomSheetVisible}
                vehicles={selectedVehicles}
                markerType="price"
                onClose={handleBottomSheetClose}
                onBookVehicle={handleBookVehicle}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
        paddingHorizontal: 20,
    },
    retryText: {
        marginTop: 10,
        fontSize: 16,
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    searchBarContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
    },
    filtersContainer: {
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
    },
    listViewContainer: {
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
    },
    listViewContainerRaised: {
        bottom: 360,
    },
});