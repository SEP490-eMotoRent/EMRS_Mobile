import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useBranches } from "../../../map/hooks/useBranches";
import { colors } from "../../../../common/theme/colors";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { Branch } from "../../../../../domain/entities/operations/Branch";
import { BranchMapMarker } from "../atoms/BranchMapMarker";
import { UserLocationMarker } from "../atoms/UserLocationMarker";
import { RouteLine } from "../molecules/RouteLine";
import { useLocation } from "../../context/LocationContext";
import { BranchInfoCard } from "../organisms/BranchInfoCard";

/**
 * BranchMarkerWrapper - Optimized marker component that prevents unnecessary re-renders
 * 
 * Applies same optimization strategy as MapScreen:
 * - Uses tracksViewChanges intelligently (only true during selection change)
 * - Memoized to prevent re-creation on parent re-renders
 * - 200ms timing for 32×32 markers
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
  
  // Disable view tracking after initial render (prevents blink on map pan/zoom)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTracksViewChanges(false);
    }, 200);
    return () => clearTimeout(timer);
  }, []);
  
  // Enable tracking whenever isSelected CHANGES (both true->false and false->true)
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
      <BranchMapMarker isSelected={isSelected} />
    </Marker>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if selection state changes
  return prevProps.isSelected === nextProps.isSelected && 
         prevProps.branch.id === nextProps.branch.id;
});

BranchMarkerWrapper.displayName = 'BranchMarkerWrapper';

export const BranchMapScreen: React.FC = () => {
  const { branches, loading, error, refetch } = useBranches();
  const { location } = useLocation();
  const mapRef = useRef<MapView>(null);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [routeDistance, setRouteDistance] = useState<string>("");
  const [routeDuration, setRouteDuration] = useState<string>("");
  const [initialRegion] = useState<Region>({
    latitude: location?.latitude || 10.8231,
    longitude: location?.longitude || 106.6297,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // Fit map to show all branches and user location
  useEffect(() => {
    if (!location || branches.length === 0) return;
    
    const allLatitudes = [
      location.latitude,
      ...branches.map((b) => b.latitude),
    ];
    const allLongitudes = [
      location.longitude,
      ...branches.map((b) => b.longitude),
    ];

    const minLat = Math.min(...allLatitudes);
    const maxLat = Math.max(...allLatitudes);
    const minLng = Math.min(...allLongitudes);
    const maxLng = Math.max(...allLongitudes);

    const latDelta = (maxLat - minLat) * 1.5;
    const lngDelta = (maxLng - minLng) * 1.5;

    // Animate to new region instead of setting state
    mapRef.current?.animateToRegion({
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: Math.max(latDelta, 0.05),
      longitudeDelta: Math.max(lngDelta, 0.05),
    }, 1000);
  }, [branches, location]);

  const handleBranchPress = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowRoute(false);
    setRouteDistance("");
    setRouteDuration("");
  };

  const handleCloseBranchInfo = () => {
    setSelectedBranch(null);
    setShowRoute(false);
    setRouteDistance("");
    setRouteDuration("");
  };

  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  };

  const handleRouteData = (distance: string, duration: string) => {
    setRouteDistance(distance);
    setRouteDuration(duration);
  };

  if (loading && branches.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Chi nhánh"
          subtitle="Tìm chi nhánh gần bạn"
          showBackButton={false}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải chi nhánh...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Chi nhánh"
        subtitle="Tìm chi nhánh gần bạn"
        showBackButton={false}
      />
      {location ? (
        <View style={styles.mapContainer}>
          {/* ✅ FIXED: Using initialRegion instead of region for smoother performance */}
          <MapView
            ref={mapRef}
            key={branches?.length}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType="standard"
            initialRegion={initialRegion}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {/* Custom User Location Marker */}
            {location && (
              <Marker
                coordinate={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                anchor={{ x: 0.5, y: 0.5 }}
                flat
                tracksViewChanges={true}
              >
                <UserLocationMarker />
              </Marker>
            )}

            {/* Route Line using Mapbox Directions API */}
            {showRoute && selectedBranch && location && (
              <RouteLine
                origin={{
                  latitude: location.latitude,
                  longitude: location.longitude,
                }}
                destination={{
                  latitude: selectedBranch.latitude,
                  longitude: selectedBranch.longitude,
                }}
                onRouteData={handleRouteData}
              />
            )}

            {/* ✅ FIXED: Branch Markers with optimization wrapper */}
            {branches.map((branch) => (
              <BranchMarkerWrapper
                key={branch.id}
                branch={branch}
                isSelected={selectedBranch?.id === branch.id}
                onPress={() => handleBranchPress(branch)}
              />
            ))}
          </MapView>

          {/* My Location Button */}
          {location && (
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={() => {
                mapRef.current?.animateToRegion({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  latitudeDelta: 0.02,
                  longitudeDelta: 0.02,
                });
              }}
            >
              <AntDesign name="aim" size={22} color="#C9B6FF" />
            </TouchableOpacity>
          )}

          {/* Refresh Button */}
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={refetch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <AntDesign name="reload" size={20} color="#000" />
            )}
          </TouchableOpacity>

          {/* Branch Info Card */}
          {selectedBranch && (
            <View style={styles.branchInfoCardContainer}>
              <BranchInfoCard
                branch={selectedBranch}
                onClose={handleCloseBranchInfo}
                onShowRoute={handleToggleRoute}
                isRouteVisible={showRoute}
                hasUserLocation={!!location}
                distance={routeDistance}
                duration={routeDuration}
              />
            </View>
          )}

          {/* Error Message */}
          {error && branches.length === 0 && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={refetch}>
                <Text style={styles.retryText}>Thử lại</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ) : (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Đang tải bản đồ...</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },
  myLocationButton: {
    position: "absolute",
    bottom: 260,
    right: 16,
    backgroundColor: "#1E1E1E",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#C9B6FF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  refreshButton: {
    position: "absolute",
    bottom: 180,
    right: 16,
    backgroundColor: "#C9B6FF",
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  branchInfoCardContainer: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
  },
  errorContainer: {
    position: "absolute",
    top: "50%",
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  errorText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: "#C9B6FF",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
  },
});