import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";

// Custom hooks
import { useBranches } from "../../hooks/useBranches";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { useMapRegion } from "../../hooks/useMapRegion";

// Filter utilities
import { FilterModal, FilterState } from "../../../vehicleList/ui/orgamism/FilterModal";
import { getActiveFilterCount, getDefaultFilters } from "../../utils/filterUtils";

type MapScreenRouteProp = RouteProp<BrowseStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Map'>;

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    // Get navigation parameters with defaults
    const { location, dateRange, address } = route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Chọn Ngày",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    };

    // ✅ Filter state
    const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
    const [filterModalVisible, setFilterModalVisible] = useState(false);

    // Custom hooks for state management
    const { branches, loading, error, refetch } = useBranches();
    const { region, setRegion, searchedLocation } = useMapRegion({ branches, address });
    
    const {
        selectedBranchId,
        bottomSheetVisible,
        selectedVehicles,
        bookingModalVisible,
        vehiclesLoading,
        vehiclesError,
        handleBranchMarkerPress,
        handleMapPress,
        handleBottomSheetClose,
        handleSearchBarPress,
        handleBookingModalClose,
        handleBookVehicle,
    } = useMapInteractions({ dateRange });

    // ✅ Calculate active filter count
    const activeFilterCount = useMemo(() => {
        return getActiveFilterCount(filters);
    }, [filters]);

    // ✅ Memoize navigation handler
    const handleListViewPress = useCallback(() => {
        // Pass filters to ListView
        navigation.navigate('ListView', { 
            location, 
            dateRange, 
            address,
            // ✅ TODO: Add filters to navigation params if needed
        });
    }, [navigation, location, dateRange, address]);

    // ✅ Filter handlers
    const handleFilterPress = useCallback(() => {
        setFilterModalVisible(true);
    }, []);

    const handleFilterApply = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setFilterModalVisible(false);
        
        // ✅ TODO: Apply filters to branches/vehicles
        console.log('Filters applied:', newFilters);
    }, []);

    const handleFilterClose = useCallback(() => {
        setFilterModalVisible(false);
    }, []);

    const handleRefresh = useCallback(() => {
        // Reset filters
        setFilters(getDefaultFilters());
        // Refetch branches
        refetch();
    }, [refetch]);

    // ✅ Memoize valid branches (filter out invalid coordinates)
    const validBranches = useMemo(() => {
        return branches.filter(branch => 
            branch.latitude !== 0 && 
            branch.longitude !== 0 &&
            !isNaN(branch.latitude) &&
            !isNaN(branch.longitude)
        );
    }, [branches]);

    // ✅ Loading state
    if (loading && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#d4c5f9" />
                <Text style={styles.loadingText}>Đang tải chi nhánh...</Text>
            </View>
        );
    }

    // ✅ Error state
    if (error && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.retryText} onPress={refetch}>
                    🔄 Nhấn để thử lại
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
                showsUserLocation={false}
                showsMyLocationButton={false}
                showsCompass={false}
                toolbarEnabled={false}
            >
                {/* Searched Location Pin */}
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        anchor={{ x: 0.5, y: 1 }}
                        zIndex={1000}
                        identifier="searched-location"
                    >
                        <LocationPinMarker />
                    </Marker>
                )}

                {/* Branch Markers */}
                {validBranches.map((branch) => {
                    const isSelected = selectedBranchId === branch.id;
                    
                    return (
                        <Marker
                            key={branch.id}
                            coordinate={{
                                latitude: branch.latitude,
                                longitude: branch.longitude,
                            }}
                            onPress={() => handleBranchMarkerPress(branch)}
                            anchor={{ x: 0.5, y: 1 }}
                            zIndex={isSelected ? 999 : 1}
                            identifier={`branch-${branch.id}`}
                        >
                            <BranchMarker isSelected={isSelected} />
                        </Marker>
                    );
                })}
            </MapView>

            {/* Search Bar Overlay */}
            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            {/* ✅ UPDATED: Unified Filters */}
            <View style={styles.filtersContainer}>
                <MapFilters
                    onFilterPress={handleFilterPress}
                    onRefreshPress={handleRefresh}
                    activeFilterCount={activeFilterCount}
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

            {/* ✅ NEW: Filter Modal (Shared with ListView) */}
            <FilterModal
                visible={filterModalVisible}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
                currentFilters={filters}
            />

            {/* Vehicle Bottom Sheet */}
            <VehicleBottomSheet
                visible={bottomSheetVisible}
                vehicles={selectedVehicles}
                markerType="price"
                onClose={handleBottomSheetClose}
                onBookVehicle={handleBookVehicle}
            />

            {/* Vehicle Loading Overlay */}
            {vehiclesLoading && bottomSheetVisible && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingCard}>
                        <ActivityIndicator size="small" color="#d4c5f9" />
                        <Text style={styles.loadingOverlayText}>Đang tìm xe...</Text>
                    </View>
                </View>
            )}
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
        marginTop: 12,
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 16,
        color: '#ff3b30',
        textAlign: 'center',
        paddingHorizontal: 20,
        fontWeight: '600',
    },
    retryText: {
        marginTop: 16,
        fontSize: 16,
        color: '#d4c5f9',
        fontWeight: '600',
    },
    searchBarContainer: {
        position: "absolute",
        top: 50,
        left: 20,
        right: 20,
        zIndex: 100,
    },
    filtersContainer: {
        position: "absolute",
        top: 130,
        left: 0,
        right: 0,
        zIndex: 99,
    },
    listViewContainer: {
        position: "absolute",
        bottom: 100,
        alignSelf: "center",
        zIndex: 98,
    },
    listViewContainerRaised: {
        bottom: 360,
    },
    loadingOverlay: {
        position: "absolute",
        bottom: 120,
        left: 0,
        right: 0,
        alignItems: "center",
        zIndex: 97,
    },
    loadingCard: {
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 20,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    loadingOverlayText: {
        color: "#fff",
        marginLeft: 12,
        fontSize: 14,
        fontWeight: "600",
    },
});