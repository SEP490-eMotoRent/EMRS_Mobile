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
import { colors } from "../../../../../common/theme/colors";
import sl from "../../../../../../core/di/InjectionContainer";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetBookingListUseCase } from "../../../../../../domain/usecases/booking/GetBookingListUseCase";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { RootState } from "../../../../authentication/store";
import { RenterResponse } from "../../../../../../data/models/account/renter/RenterResponse";
import { GetRenterByIdUseCase } from "../../../../../../domain/usecases/account/GetRenterByIdUseCase";

type CustomerRentalsScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "CustomerRentals"
>;

type CustomerRentalsScreenRouteProp = RouteProp<
  StaffStackParamList,
  "CustomerRentals"
>;

export const CustomerRentalsScreen: React.FC = () => {
  const user = useAppSelector((state: RootState) => state.auth.user);
  const navigation = useNavigation<CustomerRentalsScreenNavigationProp>();
  const route = useRoute<CustomerRentalsScreenRouteProp>();
  const { renterId } = route.params;
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("Booked");
  const [filterVehicleModelId, setFilterVehicleModelId] = useState<string>("");
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [showModelList, setShowModelList] = useState<boolean>(false);
  const [shouldRefetch, setShouldRefetch] = useState<boolean>(false);
  const [renter, setRenter] = useState<RenterResponse | null>(null);
  useEffect(() => {
    fetchBookings(1);
    fetchVehicleModels();
    fetchRenter();
  }, []);

  useEffect(() => {
    if (showFilter) {
      return;
    }
    if (shouldRefetch) {
      fetchBookings(1);
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const fetchRenter = async () => {
    try {
      const uc = new GetRenterByIdUseCase(sl.get("RenterRepository"));
      const res = await uc.execute(renterId);
      setRenter(res);
    } catch (error) {
      console.error("Error fetching renter:", error);
      setRenter(null);
    }
  };

  const fetchVehicleModels = async () => {
    try {
      const uc = new GetAllVehicleModelsUseCase(
        sl.get("VehicleModelRepository")
      );
      const res = await uc.execute();
      setVehicleModels(res);
    } catch {}
  };

  const fetchBookings = async (page: number = pageNum) => {
    setLoading(true);
    try {
      const getBookingListUseCase = new GetBookingListUseCase(
        sl.get("BookingRepository")
      );
      const response = await getBookingListUseCase.execute(
        filterVehicleModelId || (undefined as any),
        renterId,
        filterStatus,
        undefined,
        page,
        pageSize
      );

      // const bookingsData = unwrapResponse(response);
      setBookings(response.items);
      setPageNum(page);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilterStatus("");
    setFilterVehicleModelId("");
    setShowModelList(false);
    setShowFilter(false);
    setShouldRefetch(true);
  };

  const applyFilters = () => {
    setShowFilter(false);
    fetchBookings(1);
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateRentalDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày thuê`;
  };

  const handleSelectVehicle = (booking: Booking) => {
    navigation.navigate("SelectVehicle", {
      bookingId: booking.id,
      renterName: booking.renter.account.fullname,
      vehicleModel: booking.vehicleModel
    });
  };

  const handleViewDetails = (booking: Booking) => {
    console.log("View details:", booking.id);
    navigation.navigate("BookingDetails", { bookingId: booking.id });
  };

  const renderBookingCard = (booking: Booking) => {
    const hasVehicle = booking.vehicle && booking.vehicle.id;

    return (
      <View
        key={booking.id}
        style={[styles.rentalCard, !hasVehicle && styles.pendingCard]}
      >
        {/* Status Badge */}
        {!hasVehicle && (
          <View style={styles.statusBadge}>
            <AntDesign name="clock-circle" size={12} color="#FFC107" />
            <Text style={styles.statusText}>Đang chờ chọn xe</Text>
          </View>
        )}

        {/* Time and Date Section */}
        <View style={styles.timeSection}>
          <AntDesign
            name="clock-circle"
            size={16}
            color={colors.text.primary}
          />
          <Text style={styles.timeText}>
            {formatTime(booking.startDatetime?.toString() || "")} -{" "}
            {formatTime(booking.endDatetime?.toString() || "")}
          </Text>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>
              Từ: {booking.startDatetime?.toLocaleDateString("en-GB")}
            </Text>
            <Text style={styles.dateText}>
              Đến: {booking.endDatetime?.toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerSection}>
          <AntDesign name="user" size={16} color={colors.text.primary} />
          <Text style={styles.customerName}>
            {booking.renter?.account?.fullname || "Khách hàng không xác định"}
          </Text>
          <Text style={styles.bookingId}>#{booking.id.slice(-10)}</Text>
        </View>

        {/* Vehicle Section */}
        <View style={styles.vehicleSection}>
          {hasVehicle ? (
            <>
              <Image
                source={{ uri: booking.vehicle?.fileUrl?.[0] }}
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                  {booking.vehicle?.vehicleModel?.modelName ||
                    "Xe không xác định"}
                </Text>
                <Text style={styles.rentalDuration}>
                  {calculateRentalDuration(
                    booking.startDatetime?.toString() || "",
                    booking.endDatetime?.toString() || ""
                  )}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noVehicleContainer}>
              <View style={styles.noVehicleIcon}>
                <AntDesign name="car" size={24} color={colors.text.secondary} />
              </View>
              <View style={styles.noVehicleInfo}>
                <Text style={styles.noVehicleTitle}>Chưa gán xe</Text>
                <Text style={styles.noVehicleSubtitle}>
                  Nhân viên cần chọn xe cho đặt chỗ này
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Vehicle Specifications - Only show if vehicle exists */}
        {hasVehicle && (
          <View style={styles.specsSection}>
            <View style={styles.specsHeader}>
              <Text style={styles.specsTitle}>Thông số kỹ thuật xe</Text>
            </View>
            <View style={styles.specsGrid}>
              <View style={styles.specCard}>
                <AntDesign name="thunderbolt" size={16} color="#4CAF50" />
                <Text style={styles.specText}>
                  {booking.vehicle?.batteryHealthPercentage} %
                </Text>
              </View>
              <View style={styles.specCard}>
                <AntDesign name="dashboard" size={16} color="#2196F3" />
                <Text style={styles.specText}>
                  {booking.vehicle?.currentOdometerKm} km
                </Text>
              </View>
              <View style={styles.specCard}>
                <FontAwesome name="battery-4" size={16} color="#FF9800" />
                <Text style={styles.specText}>
                  {booking.vehicle?.vehicleModel?.batteryCapacityKwh} kWh
                </Text>
              </View>
              <View style={styles.specCard}>
                <AntDesign name="rocket" size={16} color="#E91E63" />
                <Text style={styles.specText}>
                  {booking.vehicle?.vehicleModel?.maxSpeedKmh} km/h
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              !hasVehicle && styles.selectButtonPending,
            ]}
            onPress={() => handleSelectVehicle(booking)}
          >
            <Text
              style={[
                styles.buttonText,
                !hasVehicle && styles.buttonTextPending,
              ]}
            >
              {hasVehicle ? "Đổi xe" : "Chọn xe"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(booking)}
          >
            <Text style={styles.buttonText}>Xem chi tiết</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        <ScreenHeader
          title="Thuê của khách hàng"
          subtitle={
            renter?.account?.fullname
              ? `Đặt chỗ của ${renter?.account?.fullname}`
              : "Đặt chỗ khách hàng"
          }
          submeta={
            new Date().toLocaleString("en-GB")
          }
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          refreshControl={
            <RefreshControl
              colors={["white"]}
              refreshing={loading}
              onRefresh={fetchBookings}
            />
          }
        >
          <View style={styles.header}>
            <View style={styles.branchRow}>
              <Text style={styles.branchText}>
                {user?.branchName || "Đang tải chi nhánh..."}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.filterRow}
              onPress={() => setShowFilter(true)}
            >
              <AntDesign name="filter" size={16} color={colors.text.primary} />
              <Text style={styles.filterText}>Lọc & Sắp xếp</Text>
            </TouchableOpacity>
          </View>

          {/* Rental List Section */}
          <View style={styles.rentalSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Danh sách thuê của{" "}
                {renter?.account?.fullname ?? "Khách hàng"}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{bookings?.length ?? 0}</Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Đang tải đặt chỗ...</Text>
              </View>
            ) : bookings && bookings.length > 0 ? (
              bookings.map(renderBookingCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Không tìm thấy đặt chỗ</Text>
              </View>
            )}
          </View>
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
              <Text style={styles.modalTitle}>Lọc thuê</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>Mẫu xe</Text>
              <View style={styles.selectContainer}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={[styles.input, styles.selectLike]}
                  onPress={() => setShowModelList((p) => !p)}
                >
                  <Text style={{ color: colors.text.primary }}>
                    {vehicleModels.find((m) => m.id === filterVehicleModelId)
                      ?.modelName || "Tất cả mẫu xe"}
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
              <Text style={styles.fieldLabel}>Trạng thái đặt chỗ</Text>
              <View style={styles.statusRow}>
                {["Booked", "Renting", "Returned", "Completed"].map((s) => {
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
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
  },
  headerDate: {
    fontSize: 14,
    color: colors.text.secondary,
    marginRight: 16,
  },
  notificationButton: {
    padding: 8,
  },
  staffBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  staffText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "bold",
  },
  branchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  branchText: {
    color: colors.text.primary,
    fontSize: 14,
    marginRight: 4,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterText: { color: colors.text.primary, marginLeft: 6 },
  // Modal styles (reused pattern)
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
  fieldLabel: { color: colors.text.secondary, marginBottom: 6, fontSize: 12 },
  input: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
  },
  selectContainer: { position: "relative" },
  selectLike: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
  rentalSection: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginRight: 8,
  },
  countBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  rentalCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timeText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    marginBottom: 8,
  },
  dateInfo: {
    marginLeft: 24,
  },
  dateText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  customerSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  customerName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
    marginRight: 8,
  },
  bookingId: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  vehicleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleImage: {
    width: 40,
    height: 40,
    backgroundColor: "#444444",
    borderRadius: 8,
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  rentalDuration: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  specsSection: {
    marginBottom: 16,
  },
  specsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  specsTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  specCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 8,
    minWidth: "48%",
  },
  specText: {
    color: colors.text.secondary,
    fontSize: 10,
    marginLeft: 6,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  selectButton: {
    flex: 1,
    backgroundColor: "#C9B6FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  viewButton: {
    flex: 1,
    backgroundColor: "#C9B6FF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
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
  // Pending vehicle styles
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
    backgroundColor: "#2A2A2A",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  noVehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    borderStyle: "dashed",
  },
  noVehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noVehicleInfo: {
    flex: 1,
  },
  noVehicleTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  noVehicleSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  selectButtonPending: {
    backgroundColor: "#FFC107",
  },
  buttonTextPending: {
    color: "#000000",
    fontWeight: "700",
  },
});
