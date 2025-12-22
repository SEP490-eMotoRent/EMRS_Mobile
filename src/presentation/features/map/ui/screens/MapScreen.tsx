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
 * FIXED: Commented out console logs
 */
const LocationPinWrapper = React.memo(() => {
    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    
    return (
        <Marker
            coordinate={{ latitude: 0, longitude: 0 }}
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
 * BranchMarkerWrapper - ORIGINAL WORKING VERSION
 * 
 * IMPORTANT: This component NEEDS the timer logic to properly render marker images
 * Do NOT optimize this further or markers will render blank!
 * 
 * ONLY CHANGE: Commented out console logs for performance
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
    const [tracksViewChanges, setTracksViewChanges] = useState(true);
    
    // CRITICAL: Keep this - needed for initial marker render
    useEffect(() => {
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 200);
        return () => clearTimeout(timer);
    }, []);
    
    // CRITICAL: Keep this - needed for marker color update on selection
    useEffect(() => {
        setTracksViewChanges(true);
        const timer = setTimeout(() => {
            setTracksViewChanges(false);
        }, 200);
        return () => clearTimeout(timer);
    }, [isSelected]);
    
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
    return prevProps.isSelected === nextProps.isSelected && 
        prevProps.branch.id === nextProps.branch.id;
});

BranchMarkerWrapper.displayName = 'BranchMarkerWrapper';

export const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation<MapScreenNavigationProp>();
    
    const routeParams = useMemo(() => route.params || {
        location: "1 Phạm Văn Hai, Street, Tân Bình...",
        dateRange: "Chọn Ngày",
        address: "1 Phạm Văn Hai, Street, Tân Bình..."
    }, [route.params]);

    const { location, dateRange, address } = routeParams;

    const { branches, loading, error, refetch } = useBranches();
    const { region, searchedLocation } = useMapRegion({ branches, address });
    
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

    /**
     * FIXED: Filter branches and limit to 100 max
     * - Commented out console log
     * - Added .slice(0, 100) to prevent unbounded growth
     */
    const validBranches = useMemo(() => {
        return branches
            .filter(branch => 
                branch.latitude !== 0 && 
                branch.longitude !== 0 &&
                !isNaN(branch.latitude) &&
                !isNaN(branch.longitude) &&
                branch.latitude >= -90 && 
                branch.latitude <= 90 &&
                branch.longitude >= -180 && 
                branch.longitude <= 180
            )
            .slice(0, 100); // LIMIT: Max 100 branches
    }, [branches]);

    const selectedBranch = useMemo(() => {
        if (!selectedBranchId) return null;
        return validBranches.find(b => b.id === selectedBranchId) || null;
    }, [selectedBranchId, validBranches]);

    /**
     * FIXED: Commented out console.log
     */
    const handleListViewPress = useCallback(() => {
        try {
            // console.log('[MapScreen] Navigating to ListView');
            navigation.navigate('ListView', { location, dateRange, address });
        } catch (err) {
            // console.error('[MapScreen] ListView navigation failed: ', err);
        }
    }, [navigation, location, dateRange, address]);

    /**
     * FIXED: Commented out console.log
     */
    const handleRefresh = useCallback(() => {
        // console.log('[MapScreen] Refreshing...');
        refetch();
        
        if (bottomSheetVisible) {
            handleBottomSheetClose();
        }
    }, [refetch, bottomSheetVisible, handleBottomSheetClose]);

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
                initialRegion={region}
                onPress={handleMapPress}
                moveOnMarkerPress={false}
                loadingEnabled={true}
                loadingIndicatorColor="#d4c5f9"
            >
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

                {/* IMPORTANT: Keep original marker wrapper - it works! */}
                {validBranches.map((branch) => (
                    <BranchMarkerWrapper
                        key={branch.id}
                        branch={branch}
                        isSelected={selectedBranchId === branch.id}
                        onPress={() => handleBranchMarkerPress(branch)}
                    />
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
                    onRefreshPress={handleRefresh}
                    showFilterButton={false}
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