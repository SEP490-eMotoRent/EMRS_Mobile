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
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";
import { RootState } from "../../../../authentication/store";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";
import { formatVnd } from "../../../../../../core/utils/VndFormatter";
import { PaginatedVehicleItem } from "../../../../../../data/models/vehicle/PaginatedVehicle";

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
  const { bookingId, renterName, vehicleModel, vehicleStatus, isChangeVehicle } = route.params;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [vehicles, setVehicles] = useState<PaginatedVehicleItem[]>([]);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterColor, setFilterColor] = useState<string>("");
  const [filterOdometerMin, setFilterOdometerMin] = useState<string>("");
  const [filterBatteryMin, setFilterBatteryMin] = useState<string>("");
  const [filterStatus, setFilterStatus] = useState<string>(vehicleStatus || "Booked");
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
        undefined,
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

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "#67D16C";
      case "booked":
        return "#FFD666";
      case "rented":
        return "#FFB300";
      case "unavailable":
        return "#FF6B6B";
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "Sẵn sàng";
      case "booked":
        return "Đã đặt";
      case "rented":
        return "Đang thuê";
      case "unavailable":
        return "Không khả dụng";
      default:
        return status || "Không xác định";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return "#67D16C";
    if (level >= 40) return "#FFB300";
    return "#FF6B6B";
  };

  const mapVehicleToCard = (vehicle: PaginatedVehicleItem) => {
    return {
      id: vehicle.id,
      plate: vehicle.licensePlate || "Không xác định",
      badge:
        vehicle.status === "Available"
          ? "Available"
          : vehicle.status === "Booked"
          ? "Booked"
          : vehicle.status === "Unavailable"
          ? "Unavailable"
          : vehicle.status === "Rented"
          ? "Rented"
          : "Không xác định",
      batteryPct: vehicle.batteryHealthPercentage || 0,
      currentOdometerKm: vehicle?.currentOdometerKm || 0,
      color: vehicle.color || "Không xác định",
      status: vehicle.status || "Không xác định",
      fileUrl: vehicle.fileUrl || [],
      disabled: vehicle.status === "Unavailable" || vehicle.status === "Rented",
      rentalPricing: vehicle.rentalPricing?.rentalPrice || 0,
      vehicleModel: vehicle.vehicleModel,
    };
  };

  const renderBadge = (status: string) => {
    if (status === "Available")
      return (
        <View style={[styles.badge, styles.badgeAvailable]}>
          <AntDesign name="check-circle" size={12} color="#FFFFFF" />
          <Text style={styles.badgeTextAvailable}>Có sẵn</Text>
        </View>
      );
    if (status === "Booked")
      return (
        <View style={[styles.badge, styles.badgeBooked]}>
          <AntDesign name="calendar" size={12} color="#0B0B0F" />
          <Text style={styles.badgeTextBooked}>Đã đặt</Text>
        </View>
      );
    if (status === "Rented")
      return (
        <View style={[styles.badge, styles.badgeRented]}>
          <AntDesign name="car" size={12} color="#0B0B0F" />
          <Text style={styles.badgeTextRented}>Đã thuê</Text>
        </View>
      );
    return (
      <View style={[styles.badge, styles.badgeUnavailable]}>
        <AntDesign name="close-circle" size={12} color="#FFFFFF" />
        <Text style={styles.badgeTextUnavailable}>Không có sẵn</Text>
      </View>
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
          title="Chọn xe"
          subtitle={renterName}
          submeta={`Loại đã đặt: ${vehicleModel?.modelName}`}
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
            <View style={styles.sectionHeaderLeft}>
              <View style={styles.sectionHeaderIcon}>
                <AntDesign name="car" size={18} color="#7CFFCB" />
              </View>
              <View>
                <Text style={styles.sectionHeaderText}>Xe có sẵn</Text>
                <Text style={styles.sectionHeaderSubtext}>
                  {vehicles.length} xe phù hợp
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => setShowFilter(true)}
            >
              <AntDesign name="filter" size={16} color="#0B0B0F" />
              <Text style={styles.filterButtonText}>Lọc</Text>
            </TouchableOpacity>
          </View>

          {/* Active filters */}
          {!showFilter &&
          (filterColor ||
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
                      ?.modelName || "Mẫu xe"}
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
              <Text style={styles.loadingText}>Đang tải xe...</Text>
            </View>
          ) : vehicles.length > 0 ? (
            vehicles.map((vehicle) => {
              const vehicleCard = mapVehicleToCard(vehicle);
              const statusColor = getStatusColor(vehicleCard.status);
              const batteryColor = getBatteryColor(vehicleCard.batteryPct);
              const imageSource = vehicleCard.fileUrl.length > 0
                ? { uri: vehicleCard.fileUrl[0] }
                : banner;

              return (
                <View
                  key={vehicleCard.id}
                  style={[
                    styles.motorbikeCard,
                    vehicleCard.disabled && styles.cardDisabled,
                  ]}
                >
                  {/* Hero Image Section */}
                  <View style={styles.heroWrapper}>
                    <Image source={imageSource} style={styles.vehicleImage} />
                    <View style={styles.heroOverlay} />
                    {vehicleCard.disabled && (
                      <View style={styles.disabledOverlay}>
                        <AntDesign name="lock" size={24} color="#FFFFFF" />
                        <Text style={styles.disabledOverlayText}>
                          {vehicleCard.status === "Rented" ? "Đã thuê" : "Không khả dụng"}
                        </Text>
                      </View>
                    )}
                    <View style={styles.heroTopRow}>
                      <View style={[styles.statusBadge, { backgroundColor: "rgba(0,0,0,0.55)" }]}>
                        <View
                          style={[styles.statusDot, { backgroundColor: statusColor }]}
                        />
                        <Text style={[styles.statusText, { color: statusColor }]}>
                          {getStatusText(vehicleCard.status)}
                        </Text>
                      </View>
                      <View style={styles.priceBadge}>
                        <Text style={styles.priceValue}>
                          {formatVnd(vehicleCard.rentalPricing)}
                        </Text>
                        <Text style={styles.priceUnit}>/giờ</Text>
                      </View>
                    </View>
                    <View style={styles.heroBottomRow}>
                      <View style={styles.platePill}>
                        <AntDesign name="idcard" size={13} color="#FFD666" />
                        <Text style={styles.plateText}>{vehicleCard.plate}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Card Header */}
                  <View style={styles.cardHeader}>
                    <View style={styles.motorbikeInfo}>
                      <Text style={styles.motorbikeName}>
                        {vehicleCard.vehicleModel?.modelName || vehicleModel?.modelName || "Mẫu xe chưa cập nhật"}
                      </Text>
                    </View>
                  </View>

                  {/* Chip Row */}
                  <View style={styles.chipRow}>
                    <View style={styles.infoChip}>
                      <AntDesign name="tag" size={13} color="#9CA3AF" />
                      <Text style={styles.infoChipText}>
                        {vehicleCard.color || "Không rõ màu"}
                      </Text>
                    </View>
                    <View style={styles.infoChip}>
                      <AntDesign name="car" size={13} color="#C9B6FF" />
                      <Text style={styles.infoChipText}>
                        #{vehicleCard.id.slice(-8)}
                      </Text>
                    </View>
                  </View>

                  {/* Metric Row */}
                  <View style={styles.metricRow}>
                    <View style={styles.metricCard}>
                      <View style={styles.metricCardContent}>
                        <AntDesign
                          name="thunderbolt"
                          size={16}
                          color={batteryColor}
                        />
                        <Text style={styles.metricLabel}>Pin</Text>
                      </View>
                      <Text
                        style={[
                          styles.metricValue,
                          { color: batteryColor },
                        ]}
                      >
                        {vehicleCard.batteryPct || 0}%
                      </Text>
                    </View>
                    <View style={styles.metricCard}>
                      <View style={styles.metricCardContent}>
                        <AntDesign name="dashboard" size={16} color="#C9B6FF" />
                        <Text style={styles.metricLabel}>Số km</Text>
                      </View>
                      <Text style={styles.metricValue}>
                        {vehicleCard.currentOdometerKm?.toLocaleString("vi-VN") || 0} km
                      </Text>
                    </View>
                  </View>

                  {/* Card Actions */}
                  <View style={styles.cardActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryAction, vehicleCard.disabled && styles.actionButtonDisabled]}
                      onPress={() =>
                        navigation.navigate("VehicleInspection", {
                          vehicleId: vehicle.id,
                          bookingId: bookingId,
                          currentOdometerKm: vehicle.currentOdometerKm,
                          batteryHealthPercentage:
                            vehicle.batteryHealthPercentage
                        })
                      }
                      disabled={vehicleCard.disabled}
                    >
                      <AntDesign name="camera" size={16} color={vehicleCard.disabled ? "#999" : "#000"} />
                      <Text style={[styles.actionText, styles.primaryActionText, vehicleCard.disabled && styles.actionTextDisabled]}>
                        Bắt đầu kiểm tra
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Không có xe nào</Text>
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
              <Text style={styles.modalTitle}>Lọc xe</Text>
              <TouchableOpacity onPress={handleCloseFilter}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <View style={styles.labelWithIcon}>
                <AntDesign name="car" size={12} color="#C9B6FF" />
                <Text style={styles.fieldLabel}>Mẫu xe</Text>
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
                    )?.modelName || "Tất cả mẫu xe"}
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
                        key={vehicleModel?.id}
                        style={[
                          styles.dropdownItem,
                          !filterVehicleModelId && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setFilterVehicleModelId("");
                          setShowModelList(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>Tất cả mẫu xe</Text>
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
                <Text style={styles.fieldLabel}>Màu sắc</Text>
              </View>
              <TextInput
                placeholder="VD: Đỏ"
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
                  <Text style={styles.fieldLabel}>Số km tối thiểu (km)</Text>
                </View>
                <TextInput
                  placeholder="VD: 1000"
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
                  <Text style={styles.fieldLabel}>Pin tối thiểu (%)</Text>
                </View>
                <TextInput
                  placeholder="VD: 50"
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
                <Text style={styles.fieldLabel}>Trạng thái</Text>
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
                <Text style={styles.modalBtnText}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.applyBtn]}
                onPress={applyFilters}
              >
                <Text style={[styles.modalBtnText, { color: "#000" }]}>
                  Áp dụng
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
    marginTop: 16,
    marginBottom: 12,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  sectionHeaderIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeaderText: { 
    color: colors.text.primary, 
    fontSize: 16,
    fontWeight: "700",
  },
  sectionHeaderSubtext: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7CFFCB",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  filterButtonText: {
    color: "#0B0B0F",
    fontSize: 14,
    fontWeight: "700",
  },
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
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#11131A",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    overflow: "visible",
    borderTopWidth: 1,
    borderColor: "#1F2430",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2430",
  },
  modalTitle: { 
    color: colors.text.primary, 
    fontSize: 20, 
    fontWeight: "700" 
  },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { color: colors.text.secondary, fontSize: 12 },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232838",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 14,
  },
  selectLike: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectContainer: { position: "relative" },
  dropdownList: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232838",
    overflow: "hidden",
    zIndex: 1000,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#232838",
  },
  dropdownItemSelected: { 
    backgroundColor: "rgba(201,182,255,0.15)",
  },
  dropdownItemText: { 
    color: colors.text.primary, 
    fontSize: 14,
    fontWeight: "600",
  },
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
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  resetBtn: { 
    backgroundColor: "#1B1F2A", 
    borderColor: "#232838",
  },
  applyBtn: { 
    backgroundColor: "#C9B6FF", 
    borderColor: "#C9B6FF",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalBtnText: { 
    color: colors.text.primary, 
    fontWeight: "700",
    fontSize: 16,
  },
  statusRow: { flexDirection: "row", gap: 8 },
  statusChip: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#1B1F2A",
    borderWidth: 1,
    borderColor: "#232838",
  },
  statusChipActive: { 
    backgroundColor: "#C9B6FF", 
    borderColor: "#C9B6FF",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statusChipText: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  statusChipTextActive: { color: "#0B0B0F" },

  motorbikeCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    marginTop: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  cardDisabled: { opacity: 0.6 },
  heroWrapper: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    position: "relative",
    backgroundColor: "#111",
  },
  vehicleImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  heroTopRow: {
    position: "absolute",
    top: 10,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroBottomRow: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.text.primary,
  },
  priceBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    backgroundColor: "#FFD666",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceValue: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },
  priceUnit: {
    color: "#3F3F46",
    fontSize: 11,
    fontWeight: "600",
  },
  platePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  plateText: {
    color: "#fff",
    fontWeight: "700",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  motorbikeInfo: {
    flex: 1,
  },
  motorbikeName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  chipRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#2A2A2A",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  infoChipText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  metricRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2F2F2F",
    gap: 6,
  },
  metricCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  metricValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  cardActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingVertical: 12,
    gap: 6,
  },
  actionButtonDisabled: {
    backgroundColor: "#1B1F2A",
    opacity: 0.5,
  },
  primaryAction: {
    backgroundColor: "#C9B6FF",
  },
  actionText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  actionTextDisabled: {
    color: "#9CA3AF",
  },
  primaryActionText: {
    color: "#000",
  },
  badgesRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    overflow: "hidden",
  },
  badgeAvailable: { backgroundColor: "#67D16C" },
  badgeUnavailable: { backgroundColor: "#FF6B6B" },
  badgeBooked: { backgroundColor: "#FFD666" },
  badgeRented: { backgroundColor: "#7CFFCB" },
  badgeTextAvailable: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  badgeTextUnavailable: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  badgeTextBooked: { color: "#0B0B0F", fontSize: 11, fontWeight: "700" },
  badgeTextRented: { color: "#0B0B0F", fontSize: 11, fontWeight: "700" },
  badgeMuted: { backgroundColor: "#2A2A2A", color: colors.text.secondary },
  imageContainer: {
    position: "relative",
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  banner: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    resizeMode: "cover",
  },
  imageOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  disabledOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  disabledOverlayText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 8,
  },
  plateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  plateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(124,255,203,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  plate: { 
    color: "#7CFFCB", 
    fontWeight: "700", 
    fontSize: 16,
  },
  idContainer: {
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  vehicleId: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
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

  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  colorBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  colorText: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusDotAvailable: {
    backgroundColor: "#67D16C",
  },
  statusDotUnavailable: {
    backgroundColor: "#FF6B6B",
  },
  metricsCard: {
    backgroundColor: "#1B1F2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#232838",
  },
  metricItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  metricIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(124,255,203,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  metricContent: {
    flex: 1,
  },
  metricValueGood: {
    color: "#67D16C",
  },
  metricValueWarning: {
    color: "#FFB300",
  },
  batteryBarContainer: {
    width: 80,
  },
  batteryBar: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "#2F3545",
    overflow: "hidden",
  },
  batteryFill: {
    height: 6,
    borderRadius: 3,
  },
  metricDivider: {
    height: 1,
    backgroundColor: "#232838",
    marginVertical: 12,
  },

  pricingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(201,182,255,0.1)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.2)",
  },
  pricingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(201,182,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  pricingContent: {
    flex: 1,
  },
  pricingLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  pricingValue: {
    color: "#C9B6FF",
    fontSize: 18,
    fontWeight: "700",
  },

  footerRow: {
    marginTop: 4,
  },
  inspectionBtn: {
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  inspectionBtnDisabled: {
    backgroundColor: "#2F3545",
    shadowOpacity: 0,
    elevation: 0,
  },
  inspectionBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 10,
  },
  inspectionBtnIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(11,11,15,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  inspectionBtnText: {
    color: "#0B0B0F",
    fontWeight: "700",
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
  inspectionBtnTextDisabled: { color: "#9CA3AF" },

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
