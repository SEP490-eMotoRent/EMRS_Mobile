import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { FilterModal, FilterState } from "../../../vehicleList/ui/orgamism/FilterModal";
import { useBranches } from "../../hooks/useBranches";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { useMapRegion } from "../../hooks/useMapRegion";
import { getActiveFilterCount, getDefaultFilters } from "../../utils/filterUtils";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";

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

    const [filters, setFilters] = useState<FilterState>(getDefaultFilters());
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    
    const isDraggingRef = useRef(false);

    const { branches, loading, error, refetch } = useBranches();
    
    const { region, setRegion, searchedLocation, visibleBranches } = useMapRegion({ branches, address });
    
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

    const activeFilterCount = useMemo(() => 
        getActiveFilterCount(filters), 
    [filters]);

    const selectedBranch = useMemo(() => {
        if (!selectedBranchId) return null;
        return visibleBranches.find(b => b.id === selectedBranchId) || null;
    }, [selectedBranchId, visibleBranches]);

    // ✅ Stable marker IDs to prevent unnecessary re-renders
    const markerIds = useMemo(() => 
        visibleBranches.map(b => b.id).sort().join(','),
    [visibleBranches]);

    // ✅ Marker data with stable dependency
    const markerData = useMemo(() => {
        return visibleBranches.map(branch => ({
            id: branch.id,
            coordinate: {
                latitude: branch.latitude,
                longitude: branch.longitude,
            },
            isSelected: selectedBranchId === branch.id,
            branch,
        }));
    }, [markerIds, selectedBranchId]);

    const handleListViewPress = useCallback(() => {
        navigation.navigate('ListView', { location, dateRange, address });
    }, [navigation, location, dateRange, address]);

    const handleFilterPress = useCallback(() => {
        setFilterModalVisible(true);
    }, []);

    const handleFilterApply = useCallback((newFilters: FilterState) => {
        setFilters(newFilters);
        setFilterModalVisible(false);
    }, []);

    const handleFilterClose = useCallback(() => {
        setFilterModalVisible(false);
    }, []);

    const handleRefresh = useCallback(() => {
        setFilters(getDefaultFilters());
        refetch();
    }, [refetch]);

    const handleRegionChange = useCallback(() => {
        isDraggingRef.current = true;
    }, []);

    const handleRegionChangeComplete = useCallback((newRegion: Region) => {
        isDraggingRef.current = false;
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
                onRegionChange={handleRegionChange}
                onRegionChangeComplete={handleRegionChangeComplete}
                onPress={handleMapPress}
                showsUserLocation={false}
                showsMyLocationButton={false}
                toolbarEnabled={false}
                moveOnMarkerPress={false}
                pitchEnabled={false}
                rotateEnabled={false}
                scrollEnabled={true}
                zoomEnabled={true}
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

                {markerData.map((item) => (
                    <Marker
                        key={item.id}
                        identifier={item.id}
                        coordinate={item.coordinate}
                        onPress={() => handleBranchMarkerPress(item.branch)}
                        anchor={{ x: 0.5, y: 1 }}
                    >
                        <BranchMarker isSelected={item.isSelected} />
                    </Marker>
                ))}
            </MapView>

            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            <View style={styles.filtersContainer}>
                <MapFilters
                    onFilterPress={handleFilterPress}
                    onRefreshPress={handleRefresh}
                    activeFilterCount={activeFilterCount}
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

            <FilterModal
                visible={filterModalVisible}
                onClose={handleFilterClose}
                onApply={handleFilterApply}
                currentFilters={filters}
            />

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