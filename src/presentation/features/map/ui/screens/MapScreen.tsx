import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";
import { useBranches } from "../../hooks/useBranches";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { useMapRegion } from "../../hooks/useMapRegion";
// ❌ COMMENTED OUT - Filter imports
// import { FilterModal, FilterState } from "../../../vehicleList/ui/orgamism/FilterModal";
// import { getActiveFilterCount, getDefaultFilters } from "../../utils/filterUtils";

type MapScreenRouteProp = RouteProp<BrowseStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Map'>;

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    const routeParams = useMemo(() => route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Chọn Ngày",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    }, [route.params]);

    const { location, dateRange, address } = routeParams;

    // ❌ COMMENTED OUT - Filter state
    // const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
    // const [filterModalVisible, setFilterModalVisible] = useState(false);

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

    // ❌ COMMENTED OUT - Active filter count
    // const activeFilterCount = useMemo(() => 
    //     getActiveFilterCount(filters), 
    // [filters]);

    const validBranches = useMemo(() => {
        return branches.filter(branch => 
            branch.latitude !== 0 && 
            branch.longitude !== 0 &&
            !isNaN(branch.latitude) &&
            !isNaN(branch.longitude) &&
            branch.latitude >= -90 && 
            branch.latitude <= 90 &&
            branch.longitude >= -180 && 
            branch.longitude <= 180
        );
    }, [branches]);

    // ✅ Get selected branch for distance calculation
    const selectedBranch = useMemo(() => {
        if (!selectedBranchId) return null;
        return validBranches.find(b => b.id === selectedBranchId) || null;
    }, [selectedBranchId, validBranches]);

    const handleListViewPress = useCallback(() => {
        try {
            console.log('[MapScreen] Navigating to ListView');
            navigation.navigate('ListView', { location, dateRange, address });
        } catch (err) {
            console.error('[MapScreen] ListView navigation failed: ', err);
            // Optional: Show toast or error message
        }
    }, [navigation, location, dateRange, address]);

    // ❌ COMMENTED OUT - Filter press handler
    // const handleFilterPress = useCallback(() => {
    //     setFilterModalVisible(true);
    // }, []);

    // ❌ COMMENTED OUT - Filter apply handler
    // const handleFilterApply = useCallback((newFilters: FilterState) => {
    //     setFilters(newFilters);
    //     setFilterModalVisible(false);
    // }, []);

    // ❌ COMMENTED OUT - Filter close handler
    // const handleFilterClose = useCallback(() => {
    //     setFilterModalVisible(false);
    // }, []);

    // ✅ UPDATED - Refresh now actually refreshes the page
    const handleRefresh = useCallback(() => {
        // ❌ COMMENTED OUT - Reset filters
        // setFilters(getDefaultFilters());
        
        // ✅ Refetch branches data
        refetch();
        
        // ✅ Close bottom sheet if open
        if (bottomSheetVisible) {
            handleBottomSheetClose();
        }
        
        // ✅ Reset region to default if needed (optional - you can remove this if you want to keep current position)
        // This will re-center the map based on branches
        // You can uncomment this if you want full reset:
        // if (validBranches.length > 0) {
        //     const firstBranch = validBranches[0];
        //     setRegion({
        //         latitude: firstBranch.latitude,
        //         longitude: firstBranch.longitude,
        //         latitudeDelta: 0.05,
        //         longitudeDelta: 0.05,
        //     });
        // }
    }, [refetch, bottomSheetVisible, handleBottomSheetClose]);

    const handleRegionChangeComplete = useCallback((newRegion: Region) => {
        console.log('[MapScreen] Region changed: ', newRegion);
        setRegion(newRegion);
    }, [setRegion]);

    if (loading && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#d4c5f9" />
                <Text style={styles.loadingText}>Đang tải chi nhánh...</Text>
            </View>
        );
    }

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
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
                onRegionChangeComplete={handleRegionChangeComplete}
                onPress={handleMapPress}
            >
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        anchor={{ x: 0.5, y: 1 }}
                        identifier="searched-location"
                    >
                        <LocationPinMarker />
                    </Marker>
                )}

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
                        >
                            <BranchMarker isSelected={isSelected} />
                        </Marker>
                    );
                })}
            </MapView>

            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            {/* ✅ UPDATED - Only refresh button, no filter */}
            <View style={styles.filtersContainer}>
                <MapFilters
                    // ❌ COMMENTED OUT - Filter press
                    // onFilterPress={handleFilterPress}
                    onRefreshPress={handleRefresh}
                    // ❌ COMMENTED OUT - Active filter count
                    // activeFilterCount={activeFilterCount}
                    showFilterButton={false} // Hide filter button
                />
            </View>

            <View style={[
                styles.listViewContainer,
                bottomSheetVisible && styles.listViewContainerRaised
            ]}>
                <ListViewButton onPress={handleListViewPress} />
            </View>

            <BookingModal
                visible={bookingModalVisible}
                onClose={handleBookingModalClose}
            />

            {/* ❌ COMMENTED OUT - Filter modal */}
            {/* <FilterModal
                visible={filterModalVisible}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
                currentFilters={filters}
            /> */}

            {/* ✅ UPDATED: Pass branch and searched locations */}
            <VehicleBottomSheet
                visible={bottomSheetVisible}
                vehicles={selectedVehicles}
                markerType="price"
                onClose={handleBottomSheetClose}
                onBookVehicle={handleBookVehicle}
                branchLocation={
                    selectedBranch 
                        ? {
                            latitude: selectedBranch.latitude,
                            longitude: selectedBranch.longitude,
                          }
                        : undefined
                }
                searchedLocation={searchedLocation || undefined}
            />

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
        bottom: 420,
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