import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import sl from "../../../../../../core/di/InjectionContainer";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vehicle } from "../../../../../../domain/entities/vehicle/Vehicle";
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";

const banner = require("../../../../../../../assets/images/motor-bg.png");

type SelectVehicleScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "SelectVehicle"
>;

export const SelectVehicleScreen: React.FC = () => {
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigation = useNavigation<SelectVehicleScreenNavigationProp>();

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const getVehicleListUseCase = new GetVehicleListUseCase(
        sl.get("VehicleRepository")
      );

      const response = await getVehicleListUseCase.execute(
        "",
        "",
        undefined,
        undefined,
        "",
        pageSize,
        pageNum
      );
      setVehicles(response.items);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const mapVehicleToCard = (vehicle: Vehicle) => {
    return {
      id: vehicle.id,
      plate: vehicle.licensePlate || "Unknown",
      badge: vehicle.status === "Available" ? "Available" : "Unavailable",
      batteryPct: vehicle.batteryHealthPercentage || 0,
      currentOdometerKm: vehicle?.currentOdometerKm || 0,
      color: vehicle.color || "Unknown",
      status: vehicle.status || "Unknown",
      fileUrl: vehicle.fileUrl || [],
      rentalPricing: vehicle.rentalPricing,
      disabled: vehicle.status === "Unavailable",
      nextMaintenanceDue: vehicle.nextMaintenanceDue,
    };
  };

  const renderBadge = (status: string) => {
    if (status === "Available")
      return (
        <Text style={[styles.badge, styles.badgeAvailable]}>Available</Text>
      );
    return (
      <Text style={[styles.badge, styles.badgeUnavailable]}>Unavailable</Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Select Vehicle"
          subtitle="John Nguyen"
          submeta="Booked type: VinFast Evo200"
          showSearch={true}
          onSearchPress={() => {}}
          onBack={() => navigation.goBack()}
        />

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>Available Vehicles</Text>
          <TouchableOpacity style={styles.filterRow}>
            <AntDesign name="filter" size={16} color={colors.text.primary} />
            <Text style={styles.filterText}>Filter & Sort</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading vehicles...</Text>
          </View>
        ) : vehicles.length > 0 ? (
          vehicles.map((vehicle) => {
            const vehicleCard = mapVehicleToCard(vehicle);
            return (
              <View
                key={vehicleCard.id}
                style={[
                  styles.card,
                  !vehicleCard.disabled && styles.cardDisabled,
                ]}
              >
                {/* Badges row */}
                <View style={styles.badgesRow}>
                  {renderBadge(vehicleCard.badge)}
                  <Text style={[styles.badge, styles.badgeMuted]}>
                    Ready for inspection
                  </Text>
                </View>

                {/* Vehicle image */}
                <Image
                  source={
                    vehicleCard.fileUrl.length > 0
                      ? { uri: vehicleCard.fileUrl[0] }
                      : banner
                  }
                  style={styles.banner}
                />

                {/* Plate + right link */}
                <View style={styles.rowBetween}>
                  <Text style={styles.plate}>{vehicleCard.plate}</Text>
                  <TouchableOpacity disabled={vehicleCard.disabled}>
                    <Text style={styles.link}>View details</Text>
                  </TouchableOpacity>
                </View>

                {/* Vehicle info */}
                <View style={styles.preInspectRow}>
                  <View style={styles.rowLeft}>
                    <AntDesign
                      name="car"
                      size={14}
                      color={colors.text.primary}
                    />
                    <Text style={[styles.mutedText, styles.boldText]}>
                      {vehicleCard.color} • {vehicleCard.status}
                    </Text>
                  </View>
                  <View style={styles.rowRight}>
                    <Text style={styles.mutedText}>
                      Next maintenance:{" "}
                      {vehicleCard.nextMaintenanceDue.toLocaleDateString(
                        "en-GB"
                      )}
                    </Text>
                  </View>
                </View>

                {/* Battery summary */}
                <View style={styles.batterySummaryRow}>
                  <View style={styles.rowLeft}>
                    <FontAwesome
                      name="battery-4"
                      size={14}
                      color={colors.text.primary}
                    />
                    <Text style={styles.metricText}>
                      {" "}
                      {vehicleCard.batteryPct} %
                    </Text>
                  </View>
                  <Text style={styles.positiveText}>
                    {vehicleCard.batteryPct >= 80
                      ? "Fully charged"
                      : "Charging needed"}
                  </Text>
                </View>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${vehicleCard.batteryPct}%` },
                    ]}
                  />
                </View>
                <Text style={styles.rangeText}>
                  Current odometer:{" "}
                  <Text style={styles.rangeValue}>
                    {vehicleCard.currentOdometerKm}km
                  </Text>
                </Text>

                {/* Detail chips grid */}
                <View style={styles.detailGrid}>
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <View style={styles.valueRight}>
                        <Text
                          style={
                            vehicleCard.status === "Available"
                              ? styles.okText
                              : styles.warnText
                          }
                        >
                          {vehicleCard.status}
                        </Text>
                        <AntDesign
                          name={
                            vehicleCard.status === "Available"
                              ? "check-circle"
                              : "exclamation-circle"
                          }
                          size={12}
                          color={
                            vehicleCard.status === "Available"
                              ? "#67D16C"
                              : "#FFB300"
                          }
                          style={styles.valueIcon}
                        />
                      </View>
                    </View>
                  </View>
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <Text style={styles.detailLabel}>Color</Text>
                      <View style={styles.valueRight}>
                        <Text
                          style={[styles.okText, { color: vehicleCard.color }]}
                        >
                          {vehicleCard.color}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.detailCard}>
                    <View style={styles.detailHeaderRow}>
                      <Text style={styles.detailLabel}>Pricing</Text>
                      <View style={styles.valueRight}>
                        <Text style={styles.okText}>
                          {vehicleCard.rentalPricing}.000 đ/h
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Footer actions */}
                <View style={styles.footerRow}>
                  <TouchableOpacity disabled={vehicleCard.disabled}>
                    <Text style={styles.link}>
                      View Details{" "}
                      <AntDesign
                        name="arrow-right"
                        size={12}
                        color={colors.text.primary}
                      />
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.inspectionBtn}
                    onPress={() => navigation.navigate("VehicleInspection")}
                  >
                    <AntDesign name="camera" size={16} color="#000" />
                    <Text style={styles.inspectionBtnText}>Inspection</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No vehicles available</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: { paddingBottom: 40 },
  metaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  metaTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary },
  metaRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8 },
  staffBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  staffBadgeText: { color: "#000", fontWeight: "700", fontSize: 12 },
  bookedInfo: { paddingHorizontal: 16, marginBottom: 8 },
  bookedType: { color: colors.text.secondary, fontSize: 12 },
  customerName: { color: colors.text.primary, fontSize: 12 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeaderText: { color: colors.text.secondary, fontSize: 12 },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterText: { color: colors.text.primary, marginLeft: 6 },

  card: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  cardDisabled: { opacity: 0.7 },
  badgesRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  badge: {
    color: "#000",
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  badgeAvailable: { backgroundColor: "#4CAF50", color: "#fff" },
  badgeUnavailable: { backgroundColor: "#FF8A80", color: "#000" },
  badgeMuted: { backgroundColor: "#2A2A2A", color: colors.text.secondary },
  banner: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 8,
  },
  plate: { color: colors.text.primary, fontWeight: "700", fontSize: 14 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  mutedText: { color: colors.text.secondary, fontSize: 12 },
  statusRight: { marginLeft: "auto", fontSize: 12 },
  goodStatus: { color: "#67D16C" },
  rowRight: { marginLeft: "auto", fontSize: 12 },
  metricText: { color: colors.text.primary, fontSize: 12 },
  metricTextSmall: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 6 },
  dotOk: { backgroundColor: "#67D16C" },
  dotWarn: { backgroundColor: "#FFB300" },

  preInspectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  boldText: { fontWeight: "600", color: colors.text.primary },
  positiveText: { color: "#67D16C", fontSize: 12 },
  batterySummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3A3A3A",
    marginTop: 8,
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: "#67D16C" },
  rangeText: { color: colors.text.secondary, fontSize: 12, marginTop: 6 },
  rangeValue: { color: colors.text.primary },

  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  detailCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 10,
    minWidth: "48%",
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailLabel: { color: colors.text.primary, fontSize: 12 },
  detailValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  smallProgressBar: { height: 6, borderRadius: 3, backgroundColor: "#3A3A3A" },
  smallProgressFill: { height: 6, borderRadius: 3, backgroundColor: "#67D16C" },
  valueRight: { flexDirection: "row", alignItems: "center" },
  okText: { color: "#67D16C", marginRight: 6 },
  valueIcon: { marginLeft: 2 },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  link: {
    color: colors.text.primary,
    textDecorationLine: "underline",
    fontSize: 12,
  },
  inspectionBtn: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inspectionBtnText: {
    color: "#000000",
    fontWeight: "700",
    fontSize: 14,
    marginLeft: 6,
  },

  disabledNote: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  disabledNoteText: { color: colors.text.secondary, fontSize: 12 },

  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  warnText: {
    color: "#FFB300",
    marginRight: 6,
  },
});
