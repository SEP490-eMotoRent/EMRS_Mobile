import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  TouchableOpacity,
  Alert,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useBranches } from "../../../map/hooks/useBranches";
import { colors } from "../../../../common/theme/colors";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { Branch } from "../../../../../domain/entities/operations/Branch";
import { BranchMapMarker } from "../atoms/BranchMapMarker";
import { useLocation } from "../../context/LocationContext";

export const BranchMapScreen: React.FC = () => {
  const { branches, loading, error, refetch } = useBranches();
  const { location } = useLocation();
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
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
        // Center map on user location with branches visible
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
      } else {
        // No user location, center on all branches
        const allLatitudes = branches.map((b) => b.latitude);
        const allLongitudes = branches.map((b) => b.longitude);

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
    // Center map on selected branch
    // setRegion({
    //   latitude: branch.latitude,
    //   longitude: branch.longitude,
    //   latitudeDelta: 0.01,
    //   longitudeDelta: 0.01,
    // });
  };

  const handleCloseBranchInfo = () => {
    setSelectedBranch(null);
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
            // onRegionChangeComplete={setRegion}
            showsUserLocation
            showsMyLocationButton
            initialRegion={{
              latitude: location?.latitude,
              longitude: location?.longitude,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
          >
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
            <View style={styles.branchInfoCard}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseBranchInfo}
              >
                <AntDesign name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
              <Text style={styles.branchName}>{selectedBranch.branchName}</Text>
              <View style={styles.branchInfoRow}>
                <AntDesign
                  name="environment"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.branchAddress}>
                  {selectedBranch.address}, {selectedBranch.city}
                </Text>
              </View>
              <View style={styles.branchInfoRow}>
                <AntDesign
                  name="phone"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.branchPhone}>{selectedBranch.phone}</Text>
              </View>
              <View style={styles.branchInfoRow}>
                <AntDesign
                  name="clock-circle"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.branchHours}>
                  {selectedBranch.openingTime} - {selectedBranch.closingTime}
                </Text>
              </View>
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
  branchInfoCard: {
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  closeButton: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
  },
  branchName: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    paddingRight: 32,
  },
  branchInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  branchAddress: {
    fontSize: 13,
    color: colors.text.secondary,
    flex: 1,
  },
  branchPhone: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  branchHours: {
    fontSize: 13,
    color: colors.text.secondary,
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
