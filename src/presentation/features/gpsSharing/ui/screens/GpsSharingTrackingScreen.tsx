import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import mqtt, { MqttClient } from "mqtt";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import sl from "../../../../../core/di/InjectionContainer";
import { SessionDetailResponse } from "../../../../../data/models/gpsSharing/SessionDetailResponse";
import { GetGpsSharingSessionDetailUseCase } from "../../../../../domain/usecases/gpsSharing/GetGpsSharingSessionDetailUseCase";

type DeviceLocation = {
  lat: number;
  lon: number;
  raw?: Record<string, any>;
  time?: number;
};

export const GpsSharingTrackingScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const {
    sessionId,
    // ownerVehicleId,
    // ownerVehicleLicensePlate,
    // guestVehicleId,
    // guestVehicleLicensePlate,
    // ownerRenterName,
    // guestRenterName,
  } = route.params || {};

  const [ownerLocation, setOwnerLocation] = useState<DeviceLocation | null>(
    null
  );
  const [guestLocation, setGuestLocation] = useState<DeviceLocation | null>(
    null
  );
  const [connecting, setConnecting] = useState(true);
  const [mqttError, setMqttError] = useState<string | null>(null);
  const [connectionNonce, setConnectionNonce] = useState(0);
  const [sessionDetail, setSessionDetail] =
    useState<SessionDetailResponse | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const ownerClientRef = useRef<MqttClient | null>(null);
  const guestClientRef = useRef<MqttClient | null>(null);
  const bottomSheetRef = useRef<BottomSheet>(null);

  // Bottom sheet snap points
  const snapPoints = useMemo(() => ["10%", "60%"], []);

  // MQTT configuration for owner vehicle from sessionDetail
  const OWNER_DEVICE_ID = sessionDetail?.ownerInfo?.vehicle?.tempTrackingPayload?.deviceId;
  const OWNER_MQTT_TOPIC = `flespi/state/gw/devices/${OWNER_DEVICE_ID}/telemetry/position`;
  const OWNER_FLESPI_TOKEN = `FlespiToken ${sessionDetail?.ownerInfo?.vehicle?.tempTrackingPayload?.tmpToken}`;

  // MQTT configuration for guest vehicle from sessionDetail
  const GUEST_DEVICE_ID = sessionDetail?.guestInfo?.vehicle?.tempTrackingPayload?.deviceId;
  const GUEST_MQTT_TOPIC = `flespi/state/gw/devices/${GUEST_DEVICE_ID}/telemetry/position`;
  const GUEST_FLESPI_TOKEN = `FlespiToken ${sessionDetail?.guestInfo?.vehicle?.tempTrackingPayload?.tmpToken}`;

  const MQTT_ENDPOINT = "wss://mqtt.flespi.io:443";

  const initialRegion = useMemo(() => {
    const locations = [ownerLocation, guestLocation].filter(Boolean);
    if (locations.length === 0) {
      return {
        latitude: 10.776889,
        longitude: 106.700806,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
    }

    const lats = locations.map((loc) => loc!.lat);
    const lons = locations.map((loc) => loc!.lon);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
      latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
      longitudeDelta: Math.max((maxLon - minLon) * 1.5, 0.01),
    };
  }, [ownerLocation, guestLocation]);

  // Route coordinates for Polyline
  const routeCoordinates = useMemo(() => {
    if (!ownerLocation || !guestLocation) return [];
    return [
      { latitude: ownerLocation.lat, longitude: ownerLocation.lon },
      { latitude: guestLocation.lat, longitude: guestLocation.lon },
    ];
  }, [ownerLocation, guestLocation]);

  useEffect(() => {
    const fetchSessionDetail = async () => {
      if (!sessionId) return;
      
      try {
        const getSessionDetailUseCase = new GetGpsSharingSessionDetailUseCase(
          sl.get("GpsSharingRepository")
        );
        const response = await getSessionDetailUseCase.execute(sessionId);
        if (response.success && response.data) {
          setSessionDetail(response.data);
        }
      } catch (error) {
        console.error("Error fetching session detail:", error);
        setMqttError("Không thể tải thông tin session");
      }
    };
    fetchSessionDetail();
  }, [sessionId]);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Reconnecting MQTT...");
      setConnectionNonce((prev) => prev + 1);
    }, 30000); // 30s

    return () => clearInterval(interval);
  }, []);

  // MQTT connection for owner vehicle
  useEffect(() => {
    if (!OWNER_DEVICE_ID || !OWNER_FLESPI_TOKEN) return;

    setConnecting(true);
    setMqttError(null);

    const client = mqtt.connect(MQTT_ENDPOINT, {
      username: OWNER_FLESPI_TOKEN,
      reconnectPeriod: 5000,
      keepalive: 30,
    });

    ownerClientRef.current = client;

    client.on("connect", () => {
      setConnecting(false);
      console.log("Connected to Flespi MQTT for owner vehicle");
      client.subscribe(OWNER_MQTT_TOPIC, (err) => {
        if (err) {
          setMqttError(`Không thể subscribe topic owner: ${err.message}`);
        }
      });
    });

    client.on("error", (err) => {
      setMqttError(err.message);
    });

    client.on("message", (_, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        const lat =
          msg?.["position.latitude"] ??
          msg?.["position.lat"] ??
          msg?.latitude ??
          msg?.lat;
        const lon =
          msg?.["position.longitude"] ??
          msg?.["position.lon"] ??
          msg?.longitude ??
          msg?.lon;

        if (typeof lat === "number" && typeof lon === "number") {
          setOwnerLocation({
            lat,
            lon,
            raw: msg,
            time: msg?.timestamp || msg?.["position.timestamp"],
          });
          setMqttError(null);
        }
      } catch (error) {
        setMqttError("Không thể phân tích dữ liệu vị trí owner");
      }
    });

    return () => {
      client.end(true);
    };
  }, [OWNER_MQTT_TOPIC, connectionNonce]);

  // MQTT connection for guest vehicle
  useEffect(() => {
    if (!GUEST_DEVICE_ID || !GUEST_FLESPI_TOKEN) return;

    const client = mqtt.connect(MQTT_ENDPOINT, {
      username: GUEST_FLESPI_TOKEN,
      reconnectPeriod: 5000,
      keepalive: 30,
    });

    guestClientRef.current = client;

    client.on("connect", () => {
      console.log("Connected to Flespi MQTT for guest vehicle");
      client.subscribe(GUEST_MQTT_TOPIC, (err) => {
        if (err) {
          setMqttError(`Không thể subscribe topic guest: ${err.message}`);
        }
      });
    });

    client.on("error", (err) => {
      setMqttError(err.message);
    });

    client.on("message", (_, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        const lat =
          msg?.["position.latitude"] ??
          msg?.["position.lat"] ??
          msg?.latitude ??
          msg?.lat;
        const lon =
          msg?.["position.longitude"] ??
          msg?.["position.lon"] ??
          msg?.longitude ??
          msg?.lon;

        if (typeof lat === "number" && typeof lon === "number") {
          setGuestLocation({
            lat,
            lon,
            raw: msg,
            time: msg?.timestamp || msg?.["position.timestamp"],
          });
          setMqttError(null);
        }
      } catch (error) {
        setMqttError("Không thể phân tích dữ liệu vị trí guest");
      }
    });

    return () => {
      client.end(true);
    };
  }, [GUEST_MQTT_TOPIC, connectionNonce]);

  // Auto center map when locations update
  useEffect(() => {
    if (ownerLocation && guestLocation && mapRef.current) {
      const lats = [ownerLocation.lat, guestLocation.lat];
      const lons = [ownerLocation.lon, guestLocation.lon];
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLon = Math.min(...lons);
      const maxLon = Math.max(...lons);

      mapRef.current.animateToRegion(
        {
          latitude: (minLat + maxLat) / 2,
          longitude: (minLon + maxLon) / 2,
          latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.01),
          longitudeDelta: Math.max((maxLon - minLon) * 1.5, 0.01),
        },
        800
      );
    }
  }, [ownerLocation, guestLocation]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("Bottom sheet index:", index);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const formattedOwnerLat =
    ownerLocation?.lat != null ? ownerLocation.lat.toFixed(6) : "Đang cập nhật";
  const formattedOwnerLon =
    ownerLocation?.lon != null ? ownerLocation.lon.toFixed(6) : "Đang cập nhật";
  const formattedGuestLat =
    guestLocation?.lat != null ? guestLocation.lat.toFixed(6) : "Đang cập nhật";
  const formattedGuestLon =
    guestLocation?.lon != null ? guestLocation.lon.toFixed(6) : "Đang cập nhật";

  const hasAnyLocation = ownerLocation || guestLocation;
  const isTracking = hasAnyLocation && !connecting;

  return (
    <View style={styles.container}>
      {/* Full Screen Map */}
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion}
        mapType="standard"
        showsUserLocation={false}
        showsMyLocationButton={false}
      >
        {/* Route Line */}
        {routeCoordinates.length === 2 && (
          <>
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#000"
              strokeWidth={6}
              lineJoin="round"
              lineCap="round"
              lineDashPattern={[0]}
            />
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="#C9B6FF"
              strokeWidth={4}
              lineJoin="round"
              lineCap="round"
              lineDashPattern={[10, 5]}
            />
          </>
        )}

        {/* Owner Vehicle Marker */}
        {ownerLocation && sessionDetail?.ownerInfo && (
          <Marker
            coordinate={{
              latitude: ownerLocation.lat,
              longitude: ownerLocation.lon,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerPin, styles.ownerMarkerPin]}>
                <View style={styles.markerDot} />
              </View>
              <View style={[styles.markerCircle, styles.ownerMarkerCircle]} />
            </View>
          </Marker>
        )}

        {/* Guest Vehicle Marker */}
        {guestLocation && sessionDetail?.guestInfo && (
          <Marker
            coordinate={{
              latitude: guestLocation.lat,
              longitude: guestLocation.lon,
            }}
            anchor={{ x: 0.5, y: 0.5 }}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerPin, styles.guestMarkerPin]}>
                <View style={styles.markerDot} />
              </View>
              <View style={[styles.markerCircle, styles.guestMarkerCircle]} />
            </View>
          </Marker>
        )}
      </MapView>

      {/* Back Button Overlay */}
      <SafeAreaView style={styles.headerOverlay} edges={["top"]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <AntDesign name="left" size={20} color={colors.text.primary} />
        </TouchableOpacity>
      </SafeAreaView>

      {/* Loading Overlay */}
      {connecting && !hasAnyLocation && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
        </View>
      )}

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
        enablePanDownToClose={false}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          {/* Title */}
          <Text style={styles.bottomSheetTitle}>Thông tin chia sẻ GPS</Text>

          {/* Owner Info Section */}
          {sessionDetail?.ownerInfo && (
            <View style={styles.userSection}>
              <View style={styles.userInfoRow}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, styles.ownerAvatar]}>
                    <Text style={styles.avatarText}>
                      {getInitials(sessionDetail.ownerInfo.renterName)}
                    </Text>
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {sessionDetail.ownerInfo.renterName || "Chủ xe"}
                  </Text>
                  <Text style={styles.userRole}>Chủ xe</Text>
                </View>
                <TouchableOpacity style={styles.phoneButton} activeOpacity={0.7}>
                  <AntDesign name="phone" size={20} color="#C9B6FF" />
                </TouchableOpacity>
              </View>

              {/* Owner Vehicle Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <AntDesign name="car" size={16} color="#C9B6FF" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Biển số xe</Text>
                  <Text style={styles.infoValue}>
                    {sessionDetail.ownerInfo.vehicle?.licensePlate || "N/A"}
                  </Text>
                </View>
                <View style={[styles.statusBadge, isTracking && styles.statusBadgeActive]}>
                  <View style={[styles.statusDot, isTracking && styles.statusDotActive]} />
                  <Text style={[styles.statusText, isTracking && styles.statusTextActive]}>
                    {isTracking ? "Đang theo dõi" : "Đang chờ"}
                  </Text>
                </View>
              </View>

              {/* Owner Coordinates */}
              {ownerLocation && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <AntDesign name="environment" size={16} color="#C9B6FF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Vị trí</Text>
                    <Text style={styles.infoValue}>
                      {ownerLocation.lat.toFixed(6)}, {ownerLocation.lon.toFixed(6)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Guest Info Section */}
          {sessionDetail?.guestInfo && (
            <View style={[styles.userSection, styles.guestSection]}>
              <View style={styles.userInfoRow}>
                <View style={styles.avatarContainer}>
                  <View style={[styles.avatar, styles.guestAvatar]}>
                    <Text style={styles.avatarText}>
                      {getInitials(sessionDetail.guestInfo.renterName)}
                    </Text>
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>
                    {sessionDetail.guestInfo.renterName || "Khách mời"}
                  </Text>
                  <Text style={styles.userRole}>Khách mời</Text>
                </View>
                <TouchableOpacity style={styles.phoneButton} activeOpacity={0.7}>
                  <AntDesign name="phone" size={20} color="#C9B6FF" />
                </TouchableOpacity>
              </View>

              {/* Guest Vehicle Info */}
              <View style={styles.infoRow}>
                <View style={styles.infoIconContainer}>
                  <AntDesign name="car" size={16} color="#C9B6FF" />
                </View>
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Biển số xe</Text>
                  <Text style={styles.infoValue}>
                    {sessionDetail.guestInfo.vehicle?.licensePlate || "N/A"}
                  </Text>
                </View>
                <View style={[styles.statusBadge, isTracking && styles.statusBadgeActive]}>
                  <View style={[styles.statusDot, isTracking && styles.statusDotActive]} />
                  <Text style={[styles.statusText, isTracking && styles.statusTextActive]}>
                    {isTracking ? "Đang theo dõi" : "Đang chờ"}
                  </Text>
                </View>
              </View>

              {/* Guest Coordinates */}
              {guestLocation && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIconContainer}>
                    <AntDesign name="environment" size={16} color="#C9B6FF" />
                  </View>
                  <View style={styles.infoContent}>
                    <Text style={styles.infoLabel}>Vị trí</Text>
                    <Text style={styles.infoValue}>
                      {guestLocation.lat.toFixed(6)}, {guestLocation.lon.toFixed(6)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Error Message */}
          {mqttError && (
            <View style={styles.errorContainer}>
              <AntDesign name="warning" size={16} color="#FF8A80" />
              <Text style={styles.errorText}>{mqttError}</Text>
            </View>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  map: {
    flex: 1,
  },
  headerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 16,
    marginTop: 8,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 12,
  },
  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  markerPin: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    zIndex: 2,
  },
  ownerMarkerPin: {
    backgroundColor: "#7DB3FF",
    borderColor: "#FFFFFF",
  },
  guestMarkerPin: {
    backgroundColor: "#C9B6FF",
    borderColor: "#FFFFFF",
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFFFFF",
  },
  markerCircle: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 1,
  },
  ownerMarkerCircle: {
    backgroundColor: "rgba(125, 179, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(125, 179, 255, 0.4)",
  },
  guestMarkerCircle: {
    backgroundColor: "rgba(201, 182, 255, 0.2)",
    borderWidth: 2,
    borderColor: "rgba(201, 182, 255, 0.4)",
  },
  bottomSheetBackground: {
    backgroundColor: "#1A1D26",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  bottomSheetIndicator: {
    backgroundColor: "#fff",
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSheetTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 24,
    letterSpacing: 0.5,
  },
  userSection: {
    marginBottom: 24,
  },
  guestSection: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#2A2D36",
  },
  userInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  ownerAvatar: {
    backgroundColor: "rgba(125, 179, 255, 0.15)",
    borderWidth: 2,
    borderColor: "#7DB3FF",
  },
  guestAvatar: {
    backgroundColor: "rgba(201, 182, 255, 0.15)",
    borderWidth: 2,
    borderColor: "#C9B6FF",
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  userRole: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  phoneButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201, 182, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(201, 182, 255, 0.3)",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 4,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(201, 182, 255, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "600",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(158, 158, 158, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(158, 158, 158, 0.2)",
  },
  statusBadgeActive: {
    backgroundColor: "rgba(129, 199, 132, 0.1)",
    borderColor: "rgba(129, 199, 132, 0.3)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9E9E9E",
  },
  statusDotActive: {
    backgroundColor: "#81C784",
  },
  statusText: {
    fontSize: 11,
    color: "#9E9E9E",
    fontWeight: "600",
  },
  statusTextActive: {
    color: "#81C784",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255, 138, 128, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 138, 128, 0.3)",
    marginTop: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 12,
    color: "#FF8A80",
    fontWeight: "500",
  },
});

export default GpsSharingTrackingScreen;
