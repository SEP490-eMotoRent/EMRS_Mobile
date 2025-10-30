import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { WebView } from "react-native-webview";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../../common/theme/colors";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";

type TrackingGPSRouteProp = RouteProp<StaffStackParamList, "TrackingGPS">;

export const TrackingGPSScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<TrackingGPSRouteProp>();
  const { vehicleId, licensePlate } = route.params || {};

  // Demo OSM map centered on HCMC; replace with real tracking coordinates when available
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=106.660%2C10.762%2C106.700%2C10.790&layer=mapnik`;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Theo dõi GPS"
        subtitle={licensePlate ? `Biển số: ${licensePlate}` : vehicleId || ""}
        onBack={() => navigation.goBack()}
      />
      <View style={styles.mapWrap}>
        <WebView source={{ uri: osmUrl }} style={styles.webview} />
      </View>
      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.refreshBtn]}
        >
          <AntDesign name="reload" size={16} color="#000" />
          <Text style={styles.actionBtnText}>Làm mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, styles.centerBtn]}
          onPress={() => {}}
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
  webview: { flex: 1 },
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
