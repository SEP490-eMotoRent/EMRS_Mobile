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
 * LocationPinWrapper - FIXED version
 * - Keep tracksViewChanges={true} to ensure marker stays visible
 * - This is just ONE marker, minimal performance impact
 * - The crash was from OTHER issues (timers, debouncing, animations)
 */
const LocationPinWrapper = React.memo(({ coordinate }: { coordinate: { latitude: number; longitude: number } }) => {
    return (
        <Marker
            coordinate={coordinate}
            anchor={{ x: 0.5, y: 1 }}
            identifier="searched-location"
            tracksViewChanges={true} // ✅ Keep true - ensures marker stays visible!
            tappable={false}
            stopPropagation={true}
        >
            <LocationPinMarker />
        </Marker>
    );
});

LocationPinWrapper.displayName = 'LocationPinWrapper';

/**
 * BranchMarkerWrapper - FIXED version
 * - Single useEffect for all tracksViewChanges logic
 * - Prevents timer overlap
 * - Increased stabilization time
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
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    
    // ✅ FIXED: Single useEffect to handle all tracksViewChanges logic
    useEffect(() => {
        // Clear any existing timer first
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        // Start tracking changes
        setTracksViewChanges(true);
        
        // Stop tracking after 400ms (increased from 200ms for stability)
        timerRef.current = setTimeout(() => {
            setTracksViewChanges(false);
        }, 400);
        
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isSelected]); // Only re-run when selection changes
    
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
            stopPropagation={false}
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

    // ✅ FIXED: Track if map is ready before allowing interactions
    const [mapReady, setMapReady] = useState(false);
    const mapRef = useRef<MapView>(null);

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
            .slice(0, 100);
    }, [branches]);

    const selectedBranch = useMemo(() => {
        if (!selectedBranchId) return null;
        return validBranches.find(b => b.id === selectedBranchId) || null;
    }, [selectedBranchId, validBranches]);

    const handleListViewPress = useCallback(() => {
        try {
            navigation.navigate('ListView', { location, dateRange, address });
        } catch (err) {
            console.error('[MapScreen] ListView navigation failed: ', err);
        }
    }, [navigation, location, dateRange, address]);

    const handleRefresh = useCallback(() => {
        refetch();
        
        if (bottomSheetVisible) {
            handleBottomSheetClose();
        }
    }, [refetch, bottomSheetVisible, handleBottomSheetClose]);

    // ✅ FIXED: Safe branch marker press handler
    const handleSafeBranchPress = useCallback((branch: Branch) => {
        if (!mapReady) {
            console.warn('[MapScreen] Map not ready, ignoring marker press');
            return;
        }
        handleBranchMarkerPress(branch);
    }, [mapReady, handleBranchMarkerPress]);

    // ✅ FIXED: Safe map press handler
    const handleSafeMapPress = useCallback(() => {
        if (!mapReady) {
            return;
        }
        handleMapPress();
    }, [mapReady, handleMapPress]);

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
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={region}
                onPress={handleSafeMapPress}
                onMapReady={() => {
                    console.log('[MapScreen] ✅ Map ready');
                    setMapReady(true);
                }}
                moveOnMarkerPress={false}
                loadingEnabled={true}
                loadingIndicatorColor="#d4c5f9"
                maxZoomLevel={18}
                minZoomLevel={10}
            >
                {/* ✅ FIXED: Searched location marker - keeps tracksViewChanges={true} to stay visible */}
                {searchedLocation && mapReady && (
                    <LocationPinWrapper coordinate={searchedLocation} />
                )}

                {/* ✅ FIXED: Only render markers when map is ready */}
                {mapReady && validBranches.map((branch) => (
                    <BranchMarkerWrapper
                        key={branch.id}
                        branch={branch}
                        isSelected={selectedBranchId === branch.id}
                        onPress={() => handleSafeBranchPress(branch)}
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