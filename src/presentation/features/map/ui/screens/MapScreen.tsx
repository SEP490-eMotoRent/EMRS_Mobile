import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { Branch } from "../../../../../domain/entities/operations/Branch";
import { BookingModal } from "../../../../common/components/organisms/bookingSearchBar/BookingModal";
import { BrowseStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { useBranches } from "../../hooks/useBranches";
import { useMapInteractions } from "../../hooks/useMapInteractions";
import { useMapRegion } from "../../hooks/useMapRegion";
import { ListViewButton } from "../atoms/buttons/ListViewButton";
import { BranchMarker } from "../atoms/markers/BranchMarker";
import { LocationPinMarker } from "../atoms/markers/LocationPinMarker";
import { MapSearchBar } from "../molecules/MapSearchBar";
import { MapFilters } from "../orgamisms/MapFilters";
import { VehicleBottomSheet } from "../orgamisms/VehicleBottomSheet";

type MapScreenRouteProp = RouteProp<BrowseStackParamList, 'Map'>;
type MapScreenNavigationProp = StackNavigationProp<BrowseStackParamList, 'Map'>;

/**
 * LocationPinWrapper - Wrapper for location pin marker with proper rendering
 * 
 * Key fix: Allows initial render to complete before disabling view tracking
 * This prevents the "blank marker" issue
 */
const LocationPinWrapper = React.memo(() => {
    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    
    // Disable tracking after initial render completes
    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 200); // Slightly longer to ensure render completes
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <Marker
            coordinate={{ latitude: 0, longitude: 0 }} // Will be overridden by parent
            anchor={{ x: 0.5, y: 1 }}
            identifier="searched-location"
            tracksViewChanges={tracksViewChanges}
        >
            <LocationPinMarker />
        </Marker>
    );
});

LocationPinWrapper.displayName = 'LocationPinWrapper';

/**
 * BranchMarkerWrapper - Optimized marker component that prevents unnecessary re-renders
 * 
 * Key optimizations:
 * - Uses tracksViewChanges intelligently (only true during selection change)
 * - Memoized to prevent re-creation on parent re-renders
 * - CRITICAL FIX: Enables tracking on ANY isSelected change (true OR false)
 */
const BranchMarkerWrapper = React.memo(({ 
    branch, 
    isSelected, 
    onPress 
}: { 
    branch: Branch; 
    isSelected: boolean; 
    onPress: () => void;
}) => {
    // Track whether marker should update its view (for performance)
    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    
    // Disable view tracking after initial render (prevents blink on map pan/zoom)
    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 150);
        return () => clearTimeout(timer);
    }, []);
    
    // CRITICAL FIX: Enable tracking whenever isSelected CHANGES (not just when true)
    // This ensures marker updates back to black when deselected
    useEffect(() => {
        setTracksViewChanges(true);
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 150);
        return () => clearTimeout(timer);
    }, [isSelected]); // Triggers on ANY change (true -> false OR false -> true)
    
    return (
        <Marker
            key={branch.id}
            coordinate={{
                latitude: branch.latitude,
                longitude: branch.longitude,
            }}
            onPress={onPress}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={tracksViewChanges}
            identifier={`branch-${branch.id}`}
        >
            <BranchMarker isSelected={isSelected} />
        </Marker>
    );
}, (prevProps, nextProps) => {
    // Custom comparison: only re-render if selection state changes
    return prevProps.isSelected === nextProps.isSelected && 
           prevProps.branch.id === nextProps.branch.id;
});

BranchMarkerWrapper.displayName = 'BranchMarkerWrapper';

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    // Memoize route params to prevent unnecessary re-calculations
    const routeParams = useMemo(() => route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Chọn Ngày",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    }, [route.params]);

    const { location, dateRange, address } = routeParams;

    // Fetch all branches from API
    const { branches, loading, error, refetch } = useBranches();
    
    // Manage map region and geocoding
    // ✅ FIXED: Removed setRegion to prevent controlled component behavior
    const { region, /* setRegion, */ searchedLocation } = useMapRegion({ branches, address });
    
    // Handle all map interactions (branch clicks, bottom sheet, etc.)
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

    // Filter out invalid branch coordinates
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

    // Get selected branch for distance calculation in bottom sheet
    const selectedBranch = useMemo(() => {
        if (!selectedBranchId) return null;
        return validBranches.find(b => b.id === selectedBranchId) || null;
    }, [selectedBranchId, validBranches]);

    /**
     * Navigate to list view with current search params
     */
    const handleListViewPress = useCallback(() => {
        try {
            console.log('[MapScreen] Navigating to ListView');
            navigation.navigate('ListView', { location, dateRange, address });
        } catch (err) {
            console.error('[MapScreen] ListView navigation failed: ', err);
        }
    }, [navigation, location, dateRange, address]);

    /**
     * Refresh page - refetch branches and reset state
     */
    const handleRefresh = useCallback(() => {
        console.log('[MapScreen] Refreshing...');
        refetch();
        
        // Close bottom sheet if open
        if (bottomSheetVisible) {
            handleBottomSheetClose();
        }
    }, [refetch, bottomSheetVisible, handleBottomSheetClose]);

    // ❌ REMOVED: Region change handler that was causing drag resistance
    // This created a feedback loop: user drags → handler updates state → map re-renders → resistance
    /*
    const regionChangeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    
    const handleRegionChangeComplete = useCallback((newRegion: Region) => {
        // Clear previous timeout
        if (regionChangeTimeoutRef.current) {
            clearTimeout(regionChangeTimeoutRef.current);
        }
        
        // Throttle region updates to reduce state changes
        regionChangeTimeoutRef.current = setTimeout(() => {
            console.log('[MapScreen] Region changed (throttled): ', newRegion);
            setRegion(newRegion);
        }, 300); // Only update after user stops dragging for 300ms
    }, [setRegion]);

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (regionChangeTimeoutRef.current) {
                clearTimeout(regionChangeTimeoutRef.current);
            }
        };
    }, []);
    */

    // Loading state
    if (loading && branches.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#d4c5f9" />
                <Text style={styles.loadingText}>Đang tải chi nhánh...</Text>
            </View>
        );
    }

    // Error state
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
            {/* 
                Google Maps with optimized markers
                
                ✅ CRITICAL FIX: Using initialRegion instead of region prop
                - initialRegion: Sets starting position but doesn't control the map
                - User can drag freely without React state interfering
                - No resistance or rubber-band effect when dragging
                - Map only resets when component remounts or geocoding updates
                
                ❌ REMOVED: onRegionChangeComplete handler that was causing resistance
            */}
            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                // ❌ REMOVED: onRegionChangeComplete={handleRegionChangeComplete}
                onPress={handleMapPress}
                moveOnMarkerPress={false} // Prevent map from moving when marker pressed
                loadingEnabled={true}
                loadingIndicatorColor="#d4c5f9"
            >
                {/* 
                    Searched location pin (green flag) - VISIBLE & NON-INTERACTIVE
                    
                    ✅ tracksViewChanges={true}: Allows proper rendering
                    ✅ tappable={false}: Cannot be clicked
                    ✅ stopPropagation={true}: No event bubbling
                */}
                {searchedLocation && (
                    <Marker
                        coordinate={searchedLocation}
                        anchor={{ x: 0.5, y: 1 }}
                        identifier="searched-location"
                        tracksViewChanges={true}
                        tappable={false}
                        stopPropagation={true}
                    >
                        <LocationPinMarker />
                    </Marker>
                )}

                {/* Branch markers with optimization wrapper */}
                {validBranches.map((branch) => (
                    <BranchMarkerWrapper
                        key={branch.id}
                        branch={branch}
                        isSelected={selectedBranchId === branch.id}
                        onPress={() => handleBranchMarkerPress(branch)}
                    />
                ))}
            </MapView>

            {/* Search bar overlay */}
            <View style={styles.searchBarContainer}>
                <MapSearchBar
                    location={address}
                    dateRange={dateRange}
                    onPress={handleSearchBarPress}
                />
            </View>

            {/* Refresh button (filter removed) */}
            <View style={styles.filtersContainer}>
                <MapFilters
                    onRefreshPress={handleRefresh}
                    showFilterButton={false}
                />
            </View>

            {/* List view toggle button */}
            <View style={[
                styles.listViewContainer,
                bottomSheetVisible && styles.listViewContainerRaised
            ]}>
                <ListViewButton onPress={handleListViewPress} />
            </View>

            {/* Booking modal */}
            <BookingModal
                visible={bookingModalVisible}
                onClose={handleBookingModalClose}
            />

            {/* Vehicle bottom sheet with distance calculation */}
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

            {/* Loading overlay when fetching vehicles */}
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