import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Modal,
  TextInput,
} from "react-native";
import sl from "../../../../../../core/di/InjectionContainer";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { Vehicle } from "../../../../../../domain/entities/vehicle/Vehicle";
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";
import { VehicleBookingResponse } from "../../../../../../data/models/booking/staffResponse/BookingResponseForStaff";
import { RootState } from "../../../../authentication/store";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";

const banner = require("../../../../../../../assets/images/motor-bg.png");

type SelectVehicleScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "SelectVehicle"
>;

type SelectVehicleScreenRouteProp = RouteProp<
  StaffStackParamList,
  "SelectVehicle"
>;

export const SelectVehicleScreen: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const route = useRoute<SelectVehicleScreenRouteProp>();
  const { bookingId, renterName, vehicleModel } = route.params;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterColor, setFilterColor] = useState<string>("");
  const [filterOdometerMin, setFilterOdometerMin] = useState<string>("");
  const [filterBatteryMin, setFilterBatteryMin] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [filterVehicleModelId, setFilterVehicleModelId] = useState<string>("");
  const [showModelList, setShowModelList] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const navigation = useNavigation<SelectVehicleScreenNavigationProp>();

  useEffect(() => {
    fetchVehicles(1);
    fetchVehicleModels();
  }, []);

  useEffect(() => {
    if (shouldRefetch) {
      fetchVehicles(1);
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const fetchVehicleModels = async () => {
    const getAllVehicleModelsUseCase = new GetAllVehicleModelsUseCase(
      sl.get("VehicleModelRepository")
    );
    const response = await getAllVehicleModelsUseCase.execute();
    setVehicleModels(response);
  };

  const fetchVehicles = async (page: number = pageNum) => {
    setLoading(true);
    try {
      const getVehicleListUseCase = new GetVehicleListUseCase(
        sl.get("VehicleRepository")
      );

      const response = await getVehicleListUseCase.execute(
        "", // search text
        filterColor || "",
        filterOdometerMin ? Number(filterOdometerMin) : undefined,
        undefined, // max odometer (not used)
        filterStatus || "",
        user?.branchId,
        (filterVehicleModelId || vehicleModel?.id) as any,
        pageSize,
        page
      );
      setVehicles(response.items);
      setPageNum(page);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterColor("");
    setFilterOdometerMin("");
    setFilterBatteryMin("");
    setFilterStatus("");
    setFilterVehicleModelId("");
    setShowModelList(false);
    setShowFilter(false);
    setShouldRefetch(true);
  };

  const applyFilters = () => {
    setShowFilter(false);
    // fetchVehicles(1);
    setShouldRefetch(true);
  };

  const clearFilter = (key: "color" | "odo" | "bat" | "status" | "model") => {
    switch (key) {
      case "color":
        setFilterColor("");
        break;
      case "odo":
        setFilterOdometerMin("");
        break;
      case "bat":
        setFilterBatteryMin("");
        break;
      case "status":
        setFilterStatus("");
        break;
      case "model":
        setFilterVehicleModelId("");
        break;
    }
    setShouldRefetch(true);
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
      disabled: vehicle.status === "Unavailable",
      nextMaintenanceDue: vehicle.nextMaintenanceDue,
      rentalPricing: vehicle.vehicleModel.rentalPricing.rentalPrice,
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

  const handleCloseFilter = () => {
    setShowFilter(false);
    setShowModelList(false);
    setShowFilter(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        <ScreenHeader
          title="Select Vehicle"
          subtitle={renterName}
          submeta={`Booked type: ${vehicleModel?.modelName}`}
          showSearch={true}
          onSearchPress={() => {}}
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchVehicles} />
          }
        >
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeaderText}>Available Vehicles</Text>
            <TouchableOpacity
              style={styles.filterRow}
              onPress={() => setShowFilter(true)}
            >
              <AntDesign name="filter" size={16} color={colors.text.primary} />
              <Text style={styles.filterText}>Filter & Sort</Text>
            </TouchableOpacity>
          </View>

          {/* Active filters */}
          {(!showFilter) && (filterColor ||
          filterOdometerMin ||
            filterBatteryMin ||
            filterStatus ||
            filterVehicleModelId) ? (
            <View style={styles.activeFiltersRow}>
              {!!filterVehicleModelId && (
                <View style={[styles.filterChip, styles.chipModel]}>
                  <AntDesign name="car" size={12} color="#000" />
                  <Text style={styles.filterChipText}>
                    {vehicleModels.find((m) => m.id === filterVehicleModelId)
                      ?.modelName || "Model"}
                  </Text>
                  <TouchableOpacity onPress={() => clearFilter("model")}>
                    <AntDesign name="close" size={12} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              {!!filterColor && (
                <View style={[styles.filterChip, styles.chipColor]}>
                  <AntDesign name="skin" size={12} color="#000" />
                  <Text style={styles.filterChipText}>{filterColor}</Text>
                  <TouchableOpacity onPress={() => clearFilter("color")}>
                    <AntDesign name="close" size={12} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              {!!filterOdometerMin && (
                <View style={[styles.filterChip, styles.chipOdo]}>
                  <AntDesign name="dashboard" size={12} color="#000" />
                  <Text style={styles.filterChipText}>
                    {filterOdometerMin}+ km
                  </Text>
                  <TouchableOpacity onPress={() => clearFilter("odo")}>
                    <AntDesign name="close" size={12} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              {!!filterBatteryMin && (
                <View style={[styles.filterChip, styles.chipBattery]}>
                  <FontAwesome name="battery-4" size={12} color="#000" />
                  <Text style={styles.filterChipText}>
                    {filterBatteryMin}+ %
                  </Text>
                  <TouchableOpacity onPress={() => clearFilter("bat")}>
                    <AntDesign name="close" size={12} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
              {!!filterStatus && (
                <View style={[styles.filterChip, styles.chipStatus]}>
                  <AntDesign
                    name={
                      filterStatus === "Available"
                        ? "check-circle"
                        : filterStatus === "Unavailable"
                        ? "exclamation-circle"
                        : "calendar"
                    }
                    size={12}
                    color="#000"
                  />
                  <Text style={styles.filterChipText}>{filterStatus}</Text>
                  <TouchableOpacity onPress={() => clearFilter("status")}>
                    <AntDesign name="close" size={12} color="#000" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}

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
                    <Text style={styles.plate}>
                      {vehicleCard.plate} • #{vehicleCard.id.slice(-10)}
                    </Text>
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
                        {vehicleCard.nextMaintenanceDue?.toLocaleDateString(
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
                            style={[
                              styles.okText,
                              { color: vehicleCard.color },
                            ]}
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
                      onPress={() =>
                        navigation.navigate("VehicleInspection", {
                          vehicleId: vehicle.id,
                          bookingId: bookingId,
                          currentOdometerKm: vehicle.currentOdometerKm,
                          batteryHealthPercentage:
                            vehicle.batteryHealthPercentage,
                        })
                      }
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
      </View>

      {/* Filter Modal */}
      <Modal
        visible={showFilter}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Vehicles</Text>
              <TouchableOpacity onPress={handleCloseFilter}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.labelWithIcon}>
                <AntDesign name="car" size={12} color="#C9B6FF" />
                <Text style={styles.fieldLabel}>Vehicle Model</Text>
              </View>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.input, styles.selectLike]}
                  onPress={() => setShowModelList((p) => !p)}
                >
                  <Text style={{ color: colors.text.primary }}>
                    {vehicleModels.find(
                      (m) => m.id === (filterVehicleModelId || vehicleModel?.id)
                    )?.modelName || "All models"}
                  </Text>
                  <AntDesign
                    name={showModelList ? "up" : "down"}
                    size={12}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
                {showModelList && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={{ maxHeight: 160 }}>
                      <TouchableOpacity
                        key={"all"}
                        style={[
                          styles.dropdownItem,
                          !filterVehicleModelId && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setFilterVehicleModelId("");
                          setShowModelList(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>All models</Text>
                      </TouchableOpacity>
                      {vehicleModels.map((m) => (
                        <TouchableOpacity
                          key={m.id}
                          style={[
                            styles.dropdownItem,
                            filterVehicleModelId === m.id &&
                              styles.dropdownItemSelected,
                          ]}
                          onPress={() => {
                            setFilterVehicleModelId(m.id);
                            setShowModelList(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            {m.modelName}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.labelWithIcon}>
                <AntDesign name="skin" size={12} color="#C9B6FF" />
                <Text style={styles.fieldLabel}>Color</Text>
              </View>
              <TextInput
                placeholder="e.g. Red"
                placeholderTextColor={colors.text.secondary}
                style={styles.input}
                value={filterColor}
                onChangeText={setFilterColor}
              />
            </View>

            <View style={styles.twoCol}>
              <View style={{ flex: 1 }}>
                <View style={styles.labelWithIcon}>
                  <AntDesign name="dashboard" size={12} color="#C9B6FF" />
                  <Text style={styles.fieldLabel}>Min Odometer (km)</Text>
                </View>
                <TextInput
                  placeholder="e.g. 1000"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="numeric"
                  style={styles.input}
                  value={filterOdometerMin}
                  onChangeText={setFilterOdometerMin}
                />
              </View>
              <View style={{ width: 12 }} />
              <View style={{ flex: 1 }}>
                <View style={styles.labelWithIcon}>
                  <FontAwesome name="battery-4" size={12} color="#C9B6FF" />
                  <Text style={styles.fieldLabel}>Min Battery (%)</Text>
                </View>
                <TextInput
                  placeholder="e.g. 50"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="numeric"
                  style={styles.input}
                  value={filterBatteryMin}
                  onChangeText={setFilterBatteryMin}
                />
              </View>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.labelWithIcon}>
                <AntDesign name="flag" size={12} color="#C9B6FF" />
                <Text style={styles.fieldLabel}>Status</Text>
              </View>
              <View style={styles.statusRow}>
                {["Booked", "Unavailable", "Available"].map((s) => {
                  const active = filterStatus === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[
                        styles.statusChip,
                        active && styles.statusChipActive,
                      ]}
                      onPress={() => setFilterStatus(active ? "" : s)}
                    >
                      <Text
                        style={[
                          styles.statusChipText,
                          active && styles.statusChipTextActive,
                        ]}
                      >
                        {s}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.resetBtn]}
                onPress={resetFilters}
              >
                <Text style={styles.modalBtnText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.applyBtn]}
                onPress={applyFilters}
              >
                <Text style={[styles.modalBtnText, { color: "#000" }]}>
                  Apply
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipText: { color: "#000", fontWeight: "700", fontSize: 12 },
  chipModel: { backgroundColor: "#C9B6FF" },
  chipColor: { backgroundColor: "#FFD666" },
  chipOdo: { backgroundColor: "#7DB3FF" },
  chipBattery: { backgroundColor: "#67D16C" },
  chipStatus: { backgroundColor: "#FFB300" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    overflow: "visible",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { color: colors.text.secondary, fontSize: 12 },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
  },
  selectLike: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectContainer: { position: "relative" },
  dropdownList: {
    position: "absolute",
    bottom: 46,
    left: 0,
    right: 0,
    backgroundColor: "#262626",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
    overflow: "hidden",
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  dropdownItemSelected: { backgroundColor: "#313131" },
  dropdownItemText: { color: colors.text.primary, fontSize: 12 },
  twoCol: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12 },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  resetBtn: { backgroundColor: "#2A2A2A" },
  applyBtn: { backgroundColor: "#C9B6FF", borderColor: "#C9B6FF" },
  modalBtnText: { color: colors.text.primary, fontWeight: "700" },
  statusRow: { flexDirection: "row", gap: 8 },
  statusChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  statusChipActive: { backgroundColor: "#C9B6FF", borderColor: "#C9B6FF" },
  statusChipText: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 12,
  },
  statusChipTextActive: { color: "#000" },

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
