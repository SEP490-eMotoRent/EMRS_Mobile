import React, { useState, useEffect } from "react";
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
import { RouteLine } from "../molecules/RouteLine";
import { useLocation } from "../../context/LocationContext";
import { BranchInfoCard } from "../organisms/BranchInfoCard";

export const BranchMapScreen: React.FC = () => {
  const { branches, loading, error, refetch } = useBranches();
  const { location } = useLocation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showRoute, setShowRoute] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [region, setRegion] = useState<Region>({
    latitude: location?.latitude || 0,
    longitude: location?.longitude || 0,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });

  // Update region when branches are loaded
  useEffect(() => {
    if (!location) return;
    if (branches.length > 0) {
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

      setRegion({
        latitude: (minLat + maxLat) / 2,
        longitude: (minLng + maxLng) / 2,
        latitudeDelta: Math.max(latDelta, 0.05),
        longitudeDelta: Math.max(lngDelta, 0.05),
      });
    }
  }, [branches, location]);

  const handleBranchPress = (branch: Branch) => {
    setSelectedBranch(branch);
    setShowRoute(false);
    setIsNavigating(false);
  };

  const handleCloseBranchInfo = () => {
    setSelectedBranch(null);
    setShowRoute(false);
    setIsNavigating(false);
  };

  const handleToggleRoute = () => {
    setShowRoute(!showRoute);
  };

  const handleStartNavigation = () => {
    if (!selectedBranch || !location) return;
    setIsNavigating(true);
    setShowRoute(true);
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
          <MapView
            key={branches?.length}
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            mapType="standard"
            region={region}
            showsUserLocation
            showsMyLocationButton={false}
            initialRegion={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
            {/* Route Line using Google Directions API */}
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
              />
            )}

            {/* Branch Markers */}
            {branches.map((branch) => (
              <Marker
                key={branch.id}
                coordinate={{
                  latitude: branch.latitude,
                  longitude: branch.longitude,
                }}
                onPress={() => handleBranchPress(branch)}
                anchor={{ x: 0.5, y: 0.75 }}
              >
                <BranchMapMarker
                  isSelected={selectedBranch?.id === branch.id}
                />
              </Marker>
            ))}
          </MapView>

          {/* My Location Button */}
          {location && (
            <TouchableOpacity
              style={styles.myLocationButton}
              onPress={() => {
                setRegion({
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

          {/* Stop Navigation Button */}
          {isNavigating && (
            <TouchableOpacity
              style={styles.stopNavigationButton}
              onPress={() => {
                setIsNavigating(false);
                setShowRoute(false);
              }}
            >
              <AntDesign name="close" size={20} color="#000" />
              <Text style={styles.stopNavigationText}>Dừng chỉ đường</Text>
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
          {selectedBranch && !isNavigating && (
            <View style={styles.branchInfoCardContainer}>
              <BranchInfoCard
                branch={selectedBranch}
                onClose={handleCloseBranchInfo}
                onNavigate={handleStartNavigation}
                onShowRoute={handleToggleRoute}
                isRouteVisible={showRoute}
                hasUserLocation={!!location}
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
  stopNavigationButton: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    backgroundColor: "#C9B6FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  stopNavigationText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
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