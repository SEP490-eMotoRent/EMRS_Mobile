import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../../common/theme/colors";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import mqtt, { MqttClient } from "mqtt";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { TrackingVehicleUseCase } from "../../../../../../domain/usecases/vehicle/TrackingVehicleUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { VehicleTrackingResponse } from "../../../../../../data/models/vehicle/VehicleTrackingResponse";
type TrackingGPSRouteProp = RouteProp<StaffStackParamList, "TrackingGPS">;

export const TrackingGPSScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<TrackingGPSRouteProp>();
  const { vehicleId, licensePlate } = route.params || {};

  type DeviceLocation = {
    lat: number;
    lon: number;
    raw?: Record<string, any>;
    time?: number;
  };

  const [location, setLocation] = useState<DeviceLocation | null>(null);
  const [connecting, setConnecting] = useState(true);
  const [mqttError, setMqttError] = useState<string | null>(null);
  const [connectionNonce, setConnectionNonce] = useState(0);
  const [mapRefreshKey, setMapRefreshKey] = useState(0);
  const [trackingData, setTrackingData] = useState<VehicleTrackingResponse | null>(null);
  const mapRef = useRef<MapView | null>(null);
  const clientRef = useRef<MqttClient | null>(null);

  /**
   * MQTT configuration
   */
  const DEFAULT_DEVICE_ID = trackingData?.tempTrackingPayload?.deviceId;
  const MQTT_ENDPOINT = "wss://mqtt.flespi.io:443";
  const MQTT_TOPIC = `flespi/state/gw/devices/${DEFAULT_DEVICE_ID}/telemetry/position`;
  const FLESPI_TOKEN = `FlespiToken ${trackingData?.tempTrackingPayload?.tmpToken}`;

  const initialRegion = useMemo(
    () => ({
      latitude: location?.lat ?? 10.776889,
      longitude: location?.lon ?? 106.700806,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
    [location, mapRefreshKey]
  );

  useEffect(() => {
    const tracking = async () => {
      try {
        const trackingUseCase = new TrackingVehicleUseCase(
          sl.get("VehicleRepository")
        );
        const tracking = await trackingUseCase.execute("072ea2b3-c69b-4607-85ff-ff5825ff8e2a");
        setTrackingData(tracking);
      } catch (error) {
        console.error(error);
      }
    };
    tracking();
  }, [vehicleId]);

  useEffect(() => {
    setConnecting(true);
    setMqttError(null);

    const client = mqtt.connect(MQTT_ENDPOINT, {
      username: FLESPI_TOKEN,
      reconnectPeriod: 5000,
      keepalive: 30,
    });

    clientRef.current = client;

    client.on("connect", () => {
      setConnecting(false);
      console.log("Connected to Flespi MQTT");
      client.subscribe(MQTT_TOPIC, (err) => {
        if (err) {
          setMqttError(`Không thể subscribe topic: ${err.message}`);
        }
      });
    });

    client.on("error", (err) => {
      setMqttError(err.message);
    });

    client.on("message", (_, payload) => {
      try {
        const msg = JSON.parse(payload.toString());
        console.log("Message received:", msg);
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
          setLocation({
            lat,
            lon,
            raw: msg,
            time: msg?.timestamp || msg?.["position.timestamp"],
          });
          setMqttError(null);
        }
      } catch (error) {
        setMqttError("Không thể phân tích dữ liệu vị trí");
      }
    });

    return () => {
      client.end(true);
    };
  }, [MQTT_TOPIC, connectionNonce]);

  const handleManualRefresh = () => {
    setConnectionNonce((prev) => prev + 1);
  };

  const handleCenterOnVehicle = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: location.lat,
          longitude: location.lon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        },
        800
      );
    }
  };

  const formattedLat =
    location?.lat != null ? location.lat.toFixed(6) : "Đang cập nhật";
  const formattedLon =
    location?.lon != null ? location.lon.toFixed(6) : "Đang cập nhật";
  const lastUpdated =
    location?.time != null
      ? new Date(location.time * 1000).toLocaleString("vi-VN")
      : location
      ? new Date().toLocaleString("vi-VN")
      : "Chưa có dữ liệu";

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Theo dõi GPS"
        subtitle={licensePlate ? `Biển số: ${licensePlate}` : vehicleId || ""}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              !!location && !connecting
                ? styles.statusBadgeOnline
                : styles.statusBadgeOffline,
            ]}
          >
            <View
              style={[
                styles.statusDot,
                !!location && !connecting
                  ? styles.statusDotOnline
                  : styles.statusDotOffline,
              ]}
            />
            <Text style={styles.statusBadgeText}>
              {connecting
                ? "Đang kết nối..."
                : location
                ? "Đang theo dõi"
                : "Đang chờ dữ liệu"}
            </Text>
          </View>
          {mqttError && <Text style={styles.errorText}>{mqttError}</Text>}
        </View>
        <View style={styles.coordsRow}>
          <View style={styles.coordItem}>
            <Text style={styles.coordLabel}>Vĩ độ</Text>
            <Text style={styles.coordValue}>{formattedLat}</Text>
          </View>
          <View style={styles.coordDivider} />
          <View style={styles.coordItem}>
            <Text style={styles.coordLabel}>Kinh độ</Text>
            <Text style={styles.coordValue}>{formattedLon}</Text>
          </View>
        </View>
        <Text style={styles.lastUpdated}>Cập nhật: {lastUpdated}</Text>
      </View>

      <View style={styles.mapWrap}>
        {connecting && !location ? (
          <View style={styles.mapLoading}>
            <ActivityIndicator color="#C9B6FF" />
            <Text style={styles.mapLoadingText}>Đang tải bản đồ...</Text>
          </View>
        ) : (
          <MapView
            key={location?.lat}
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={initialRegion}
            mapType="standard"
            showsUserLocation
            showsMyLocationButton
          >
            {location && (
              <Marker
                coordinate={{
                  latitude: location.lat,
                  longitude: location.lon,
                }}
                title={licensePlate || "Thiết bị"}
                description={`Vĩ độ: ${formattedLat} | Kinh độ: ${formattedLon}`}
              >
                <View style={styles.marker}>
                  <View style={styles.markerDot} />
                </View>
              </Marker>
            )}
          </MapView>
        )}
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.refreshBtn]}
          onPress={handleManualRefresh}
        >
          <AntDesign name="reload" size={16} color="#000" />
          <Text style={styles.actionBtnText}>Làm mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.centerBtn]}
          onPress={handleCenterOnVehicle}
          disabled={!location}
        >
          <AntDesign name="environment" size={16} color="#000" />
          <Text style={styles.actionBtnText}>Định vị</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  statusCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#1F1F1F",
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusBadgeOnline: {
    backgroundColor: "rgba(34,197,94,0.15)",
  },
  statusBadgeOffline: {
    backgroundColor: "rgba(249,115,22,0.15)",
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusDotOnline: {
    backgroundColor: "#22C55E",
  },
  statusDotOffline: {
    backgroundColor: "#F97316",
  },
  statusBadgeText: {
    color: colors.text.primary,
    fontWeight: "600",
    fontSize: 12,
  },
  errorText: {
    color: "#F97316",
    fontSize: 12,
  },
  coordsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  coordItem: { flex: 1 },
  coordLabel: { color: colors.text.secondary, fontSize: 12 },
  coordValue: { color: colors.text.primary, fontWeight: "700", fontSize: 16 },
  coordDivider: {
    width: 1,
    height: 28,
    backgroundColor: "#2A2A2A",
    marginHorizontal: 12,
  },
  lastUpdated: {
    color: colors.text.secondary,
    fontSize: 11,
    fontStyle: "italic",
  },
  mapWrap: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    backgroundColor: "#0F0A18",
  },
  map: { flex: 1 },
  marker: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(201,182,255,0.25)",
    borderWidth: 2,
    borderColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  markerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6B3EF5",
  },
  mapLoading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  mapLoadingText: { color: colors.text.secondary, fontSize: 12 },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    margin: 16,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  refreshBtn: { backgroundColor: "#FFD666" },
  centerBtn: { backgroundColor: "#C9B6FF" },
  actionBtnText: { color: "#000", fontWeight: "700" },
});

export default TrackingGPSScreen;
