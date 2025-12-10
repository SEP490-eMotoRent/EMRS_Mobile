import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../../common/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import sl from "../../../../../../core/di/InjectionContainer";
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";
import { PaginatedVehicleItem } from "../../../../../../data/models/vehicle/PaginatedVehicle";
import { vehicleSwapDraftStore } from "../store/vehicleSwapDraftStore";
import { formatVnd } from "../../../../../../core/utils/VndFormatter";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { RootState } from "../../../../authentication/store";

type Nav = StackNavigationProp<StaffStackParamList, "SwapSelectVehicle">;
type Route = RouteProp<StaffStackParamList, "SwapSelectVehicle">;

const banner = require("../../../../../../../assets/images/motor-bg.png");

const getStatusColor = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "available":
      return "#67D16C";
    case "booked":
      return "#FFD666";
    case "rented":
      return "#FFB300";
    default:
      return colors.text.secondary;
  }
};

const getStatusText = (status?: string) => {
  switch ((status || "").toLowerCase()) {
    case "available":
      return "Sẵn sàng";
    case "booked":
      return "Đã đặt";
    case "rented":
      return "Đang thuê";
    default:
      return status || "Không rõ";
  }
};

const getBatteryColor = (level?: number) => {
  const pct = level || 0;
  if (pct >= 70) return "#67D16C";
  if (pct >= 40) return "#FFB300";
  return "#FF6B6B";
};

export const SwapSelectVehicleScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const user = useAppSelector((state: RootState) => state.auth.user);
  const {
    bookingId,
    returnReceiptId,
    currentVehicleId,
    startOldVehicleOdometerKm,
    licensePlate,
    vehicleModelId,
    modelName,
  } = route.params;

  const [vehicles, setVehicles] = useState<PaginatedVehicleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterColor, setFilterColor] = useState("");
  const [filterBatteryMin, setFilterBatteryMin] = useState("");

  useEffect(() => {
    vehicleSwapDraftStore.init({
      bookingId,
      returnReceiptId,
      currentVehicleId,
      licensePlate,
      modelName,
    });
    fetchVehicles();
  }, [
    bookingId,
    currentVehicleId,
    startOldVehicleOdometerKm,
    licensePlate,
    modelName,
    vehicleModelId,
    filterColor,
    filterBatteryMin,
  ]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const getVehicleListUseCase = new GetVehicleListUseCase(
        sl.get("VehicleRepository")
      );
      const res = await getVehicleListUseCase.execute(
        "",
        filterColor || "",
        filterBatteryMin ? Number(filterBatteryMin) : undefined,
        undefined,
        "Available",
        undefined,
        user?.branchId,
        vehicleModelId,
        20,
        1
      );
      setVehicles(res.items || []);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (v: PaginatedVehicleItem) => {
    // Clear draft trước khi chọn xe mới
    vehicleSwapDraftStore.clear();
    // Init lại với booking info
    vehicleSwapDraftStore.init({
      bookingId,
      returnReceiptId,
      currentVehicleId,
      licensePlate,
      modelName,
    });
    // Set selected new vehicle
    vehicleSwapDraftStore.setSelectedNewVehicle({
      vehicleId: v.id,
      licensePlate: v.licensePlate,
      modelName: v.vehicleModel?.modelName,
    });
    navigation.navigate("SwapOldVehicle", {
      startOldVehicleOdometerKm,
      newVehicleOdometerKm: v.currentOdometerKm,
      newVehicleBatteryPercentage: v.batteryHealthPercentage,
    });
  };

  const renderCard = (v: PaginatedVehicleItem) => {
    const statusColor = getStatusColor(v.status);
    const batteryColor = getBatteryColor(v.batteryHealthPercentage);
    const imageSource = v.fileUrl?.length ? { uri: v.fileUrl[0] } : banner;
    return (
      <View key={v.id} style={styles.motorbikeCard}>
        <View style={styles.heroWrapper}>
          <Image source={imageSource} style={styles.vehicleImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: "rgba(0,0,0,0.55)" },
              ]}
            >
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {getStatusText(v.status)}
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceValue}>
                {formatVnd(v.rentalPricing?.rentalPrice || 0)}
              </Text>
              <Text style={styles.priceUnit}>/giờ</Text>
            </View>
          </View>
          <View style={styles.heroBottomRow}>
            <View style={styles.platePill}>
              <AntDesign name="idcard" size={13} color="#FFD666" />
              <Text style={styles.plateText}>
                {v.licensePlate || "Chưa có biển số"}
              </Text>
            </View>
            <View style={styles.idPill}>
              <Text style={styles.idText}>#{v.id.slice(-6)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>
              {v.vehicleModel?.modelName || "Mẫu xe"}
            </Text>
            <Text style={styles.cardSub}>{v.color || "Màu chưa rõ"}</Text>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <AntDesign name="thunderbolt" size={14} color={batteryColor} />
            </View>
            <Text style={styles.metricLabel}>Pin</Text>
            <Text style={[styles.metricValue, { color: batteryColor }]}>
              {v.batteryHealthPercentage ?? 0}%
            </Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricIconWrap}>
              <AntDesign name="dashboard" size={14} color="#C9B6FF" />
            </View>
            <Text style={styles.metricLabel}>Số km</Text>
            <Text style={styles.metricValue}>
              {(v.currentOdometerKm || 0).toLocaleString("vi-VN")} km
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() => handleSelect(v)}
        >
          <Text style={styles.primaryText}>Chọn xe này</Text>
          <AntDesign name="right" size={16} color="#000" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Chọn xe thay thế"
          subtitle="Bước 1/4"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.banner}>
          <AntDesign name="swap" size={22} color="#FFD666" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Chọn xe mới cho booking</Text>
            <Text style={styles.bannerSub}>
              Xe khả dụng tại chi nhánh hiện tại
            </Text>
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => setShowFilter(true)}
          >
            <AntDesign name="filter" size={16} color="#0B0B0F" />
            <Text style={styles.filterBtnText}>Lọc</Text>
          </TouchableOpacity>
        </View>

        {(filterColor || filterBatteryMin) && (
          <View style={styles.activeFiltersRow}>
            {filterColor ? (
              <View style={[styles.filterChip, styles.chipColor]}>
                <Text style={styles.filterChipText}>{filterColor}</Text>
                <TouchableOpacity onPress={() => setFilterColor("")}>
                  <AntDesign name="close" size={12} color="#000" />
                </TouchableOpacity>
              </View>
            ) : null}
            {filterBatteryMin ? (
              <View style={[styles.filterChip, styles.chipBattery]}>
                <Text style={styles.filterChipText}>{filterBatteryMin}+ %</Text>
                <TouchableOpacity onPress={() => setFilterBatteryMin("")}>
                  <AntDesign name="close" size={12} color="#000" />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}
        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator color="#C9B6FF" />
            <Text style={styles.loadingText}>Đang tải danh sách xe...</Text>
          </View>
        ) : vehicles.length === 0 ? (
          <View style={styles.emptyWrap}>
            <AntDesign name="inbox" size={18} color={colors.text.secondary} />
            <Text style={styles.emptyText}>Không có xe khả dụng</Text>
          </View>
        ) : (
          vehicles.map(renderCard)
        )}
      </ScrollView>

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
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Màu sắc</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: Đỏ"
                placeholderTextColor={colors.text.secondary}
                value={filterColor}
                onChangeText={setFilterColor}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Pin tối thiểu (%)</Text>
              <TextInput
                style={styles.input}
                placeholder="VD: 50"
                placeholderTextColor={colors.text.secondary}
                keyboardType="numeric"
                value={filterBatteryMin}
                onChangeText={setFilterBatteryMin}
              />
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.resetBtn]}
                onPress={() => {
                  setFilterColor("");
                  setFilterBatteryMin("");
                  setShowFilter(false);
                }}
              >
                <Text style={styles.modalBtnText}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.applyBtn]}
                onPress={() => setShowFilter(false)}
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
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  banner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#11131A",
    padding: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  bannerTitle: { color: colors.text.primary, fontWeight: "700", fontSize: 15 },
  bannerSub: { color: colors.text.secondary, fontSize: 12 },
  loadingWrap: { alignItems: "center", marginTop: 20 },
  loadingText: { color: colors.text.secondary, marginTop: 8 },
  emptyWrap: { alignItems: "center", marginTop: 24, gap: 6 },
  emptyText: { color: colors.text.secondary, fontSize: 13 },
  motorbikeCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    marginHorizontal: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  heroWrapper: {
    borderRadius: 12,
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
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontSize: 10, fontWeight: "700", color: colors.text.primary },
  priceBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    backgroundColor: "#FFD666",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  priceValue: { color: "#000", fontWeight: "800", fontSize: 16 },
  priceUnit: { color: "#3F3F46", fontSize: 11, fontWeight: "600" },
  platePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  plateText: { color: "#fff", fontWeight: "700" },
  idPill: {
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#232838",
  },
  idText: { color: colors.text.secondary, fontWeight: "700", fontSize: 12 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  cardTitle: { color: colors.text.primary, fontWeight: "700", fontSize: 15 },
  cardSub: { color: colors.text.secondary, fontSize: 12, marginTop: 2 },
  metricsRow: { flexDirection: "row", gap: 10, marginBottom: 12 },
  metricCard: {
    flex: 1,
    backgroundColor: "#242424",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2F2F2F",
    gap: 4,
  },
  metricIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 8,
    backgroundColor: "rgba(201,182,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  metricLabel: { color: colors.text.secondary, fontSize: 12 },
  metricValue: { color: colors.text.primary, fontWeight: "700", fontSize: 14 },
  primaryBtn: {
    backgroundColor: "#C9B6FF",
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: "#000", fontWeight: "700" },
  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7CFFCB",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  filterBtnText: { color: "#0B0B0F", fontWeight: "700" },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 4,
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
  chipColor: { backgroundColor: "#FFD666" },
  chipBattery: { backgroundColor: "#7DB3FF" },
  chipStatus: { backgroundColor: "#C9B6FF" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#11131A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#1F2430",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalTitle: { color: colors.text.primary, fontWeight: "700", fontSize: 18 },
  field: { marginBottom: 12 },
  fieldLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
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
  },
  statusChipText: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 13,
  },
  statusChipTextActive: { color: "#0B0B0F" },
  modalActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
  },
  modalBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  resetBtn: { backgroundColor: "#1B1F2A", borderColor: "#232838" },
  applyBtn: {
    backgroundColor: "#C9B6FF",
    borderColor: "#C9B6FF",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalBtnText: { color: colors.text.primary, fontWeight: "700", fontSize: 15 },
});
