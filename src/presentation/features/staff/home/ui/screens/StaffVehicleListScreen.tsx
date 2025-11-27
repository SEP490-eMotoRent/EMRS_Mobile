import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { colors } from "../../../../../common/theme/colors";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { Vehicle } from "../../../../../../domain/entities/vehicle/Vehicle";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { PaginatedVehicleItem } from "../../../../../../data/models/vehicle/PaginatedVehicle";

type StaffVehicleListNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AllVehicles"
>;

const PAGE_SIZE = 10;
type VehicleStatusFilter = "all" | "Available" | "Rented";

export const StaffVehicleListScreen: React.FC = () => {
  const navigation = useNavigation<StaffVehicleListNavigationProp>();
  const user = useAppSelector((state: any) => state.auth.user);
  const [filterStatus, setFilterStatus] = useState<VehicleStatusFilter>("all");
  const [filterColor, setFilterColor] = useState("");
  const [filterBatteryMin, setFilterBatteryMin] = useState("");
  const [filterOdometerMin, setFilterOdometerMin] = useState("");
  const [filterModelId, setFilterModelId] = useState("");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelList, setShowModelList] = useState(false);
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [draftFilterColor, setDraftFilterColor] = useState("");
  const [draftFilterBatteryMin, setDraftFilterBatteryMin] = useState("");
  const [draftFilterOdometerMin, setDraftFilterOdometerMin] = useState("");
  const [draftFilterStatus, setDraftFilterStatus] =
    useState<VehicleStatusFilter>("all");
  const [draftFilterModelId, setDraftFilterModelId] = useState("");
  const [vehicles, setVehicles] = useState<PaginatedVehicleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const listRef = useRef<FlatList<PaginatedVehicleItem>>(null);

  const vehiclePlaceholder = require("../../../../../../../assets/images/default-motorcycle.png");

  const fetchVehicles = useCallback(
    async (page = 1, append = false, options?: { silent?: boolean }) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else if (!options?.silent) {
          setLoading(true);
        }

        const getVehicleListUseCase = new GetVehicleListUseCase(
          sl.get("VehicleRepository")
        );

        const response = await getVehicleListUseCase.execute(
          undefined,
          filterColor || undefined,
          filterOdometerMin ? Number(filterOdometerMin) : undefined,
          filterBatteryMin ? Number(filterBatteryMin) : undefined,
          filterStatus !== "all" ? filterStatus : undefined,
          user?.branchId,
          filterModelId || undefined,
          PAGE_SIZE,
          page
        );

        setVehicles((prev) =>
          append ? [...prev, ...response.items] : response.items
        );
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        });
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        if (append) {
          setLoadingMore(false);
        } else if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [
      filterBatteryMin,
      filterColor,
      filterModelId,
      filterOdometerMin,
      filterStatus,
      user?.branchId,
    ]
  );

  useEffect(() => {
    fetchVehicles(1);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [fetchVehicles]);

  useEffect(() => {
    const fetchVehicleModels = async () => {
      try {
        const getAllVehicleModelsUseCase = new GetAllVehicleModelsUseCase(
          sl.get("VehicleModelRepository")
        );
        const models = await getAllVehicleModelsUseCase.execute();
        setVehicleModels(models || []);
      } catch (error) {
        console.error("Error fetching vehicle models:", error);
      }
    };

    fetchVehicleModels();
  }, []);

  const hasActiveFilters =
    !!filterColor ||
    !!filterBatteryMin ||
    !!filterOdometerMin ||
    !!filterModelId ||
    filterStatus !== "all";

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVehicles(1, false, { silent: true });
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (
      pagination.currentPage < pagination.totalPages &&
      !loadingMore &&
      !loading
    ) {
      fetchVehicles(pagination.currentPage + 1, true, { silent: true });
    }
  };

  const syncDraftFilters = () => {
    setDraftFilterColor(filterColor);
    setDraftFilterBatteryMin(filterBatteryMin);
    setDraftFilterOdometerMin(filterOdometerMin);
    setDraftFilterStatus(filterStatus);
    setDraftFilterModelId(filterModelId);
  };

  const openFilterModal = () => {
    syncDraftFilters();
    setShowModelList(false);
    setShowFilterModal(true);
  };

  const resetDraftFilters = () => {
    setDraftFilterColor("");
    setDraftFilterBatteryMin("");
    setDraftFilterOdometerMin("");
    setDraftFilterStatus("all");
    setDraftFilterModelId("");
    setShowModelList(false);
  };

  const applyDraftFilters = () => {
    setFilterColor(draftFilterColor);
    setFilterBatteryMin(draftFilterBatteryMin);
    setFilterOdometerMin(draftFilterOdometerMin);
    setFilterStatus(draftFilterStatus);
    setFilterModelId(draftFilterModelId);
    handleCloseFilterModal();
  };

  const handleCloseFilterModal = () => {
    setShowFilterModal(false);
    setShowModelList(false);
  };

  const filteredVehicles = useMemo(() => {
    const colorQuery = filterColor.trim().toLowerCase();
    const batteryThreshold = filterBatteryMin ? Number(filterBatteryMin) : null;
    const odometerThreshold = filterOdometerMin
      ? Number(filterOdometerMin)
      : null;

    return vehicles.filter((vehicle) => {
      const matchesModel =
        !filterModelId || vehicle.vehicleModel?.id === filterModelId;

      const matchesStatus =
        filterStatus === "all" ||
        vehicle.status?.toLowerCase() === filterStatus.toLowerCase();

      const matchesColor =
        !colorQuery || vehicle.color?.toLowerCase().includes(colorQuery);

      const matchesBattery =
        batteryThreshold === null ||
        (vehicle.batteryHealthPercentage ?? 0) >= batteryThreshold;

      const matchesOdometer =
        odometerThreshold === null ||
        (vehicle.currentOdometerKm ?? 0) >= odometerThreshold;

      return (
        matchesStatus &&
        matchesColor &&
        matchesBattery &&
        matchesOdometer &&
        matchesModel
      );
    });
  }, [
    vehicles,
    filterStatus,
    filterColor,
    filterBatteryMin,
    filterOdometerMin,
    filterModelId,
  ]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "#67D16C";
      case "rented":
        return "#FFB300";
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "Sẵn sàng";
      case "rented":
        return "Đang thuê";
      default:
        return status || "Không xác định";
    }
  };

  const getBatteryColor = (level: number) => {
    if (level >= 70) return "#67D16C";
    if (level >= 40) return "#FFB300";
    return "#FF6B6B";
  };

  const renderVehicleCard = ({ item }: { item: PaginatedVehicleItem }) => {
    const batteryLevel = item.batteryHealthPercentage || 0;
    const statusColor = getStatusColor(item.status);
    const imageSource =
      item.fileUrl && item.fileUrl.length > 0
        ? { uri: item.fileUrl[0] }
        : vehiclePlaceholder;
    const pricePerDay = item.rentalPricing?.rentalPrice || 0;
    const reviewCount = item.rentalCount || 0;
    const ratingValue = (
      Math.min(4.9, Math.max(3.6, (batteryLevel || 80) / 18)) || 4.5
    ).toFixed(1);

    return (
      <TouchableOpacity
        style={styles.motorbikeCard}
        activeOpacity={0.92}
        onPress={() =>
          navigation.navigate("RentedVehicleDetails", { vehicleId: item.id })
        }
      >
        <View style={styles.heroWrapper}>
          <Image source={imageSource} style={styles.vehicleImage} />
          <View style={styles.heroOverlay} />
          <View style={styles.heroTopRow}>
            <View style={styles.statusBadge}>
              <View
                style={[styles.statusDot, { backgroundColor: statusColor }]}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
            <View style={styles.priceBadge}>
              <Text style={styles.priceValue}>
                {pricePerDay
                  ? `${new Intl.NumberFormat("vi-VN").format(pricePerDay)}đ`
                  : "—"}
              </Text>
              <Text style={styles.priceUnit}>/ngày</Text>
            </View>
          </View>
          <View style={styles.heroBottomRow}>
            <View style={styles.ratingBadge}>
              <AntDesign name="star" size={12} color="#FFD666" />
              <Text style={styles.ratingValue}>{ratingValue}</Text>
              <Text style={styles.ratingLabel}>
                {reviewCount > 0 ? `${reviewCount} lượt thuê` : "Mới cập nhật"}
              </Text>
            </View>
            <View style={styles.platePill}>
              <Text style={styles.plateText}>{item.licensePlate}</Text>
            </View>
          </View>
        </View>

        <View style={styles.cardHeader}>
          <View style={styles.motorbikeInfo}>
            <Text style={styles.motorbikeName}>
              {item.vehicleModel?.modelName || "Mẫu xe chưa cập nhật"}
            </Text>
          </View>
        </View>

        <View style={styles.chipRow}>
          <View style={styles.infoChip}>
            <MaterialIcons name="category" size={13} color="#C9B6FF" />
            <Text style={styles.infoChipText}>
              {item.vehicleModel?.category || "Không xác định"}
            </Text>
          </View>
          <View style={styles.infoChip}>
            <AntDesign name="tag" size={13} color="#9CA3AF" />
            <Text style={styles.infoChipText}>
              {item.color || "Không rõ màu"}
            </Text>
          </View>
        </View>

        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <View style={styles.metricCardContent}>
              <AntDesign
                name="thunderbolt"
                size={16}
                color={getBatteryColor(batteryLevel)}
              />
              <Text style={styles.metricLabel}>Pin</Text>
            </View>
            <Text
              style={[
                styles.metricValue,
                { color: getBatteryColor(batteryLevel) },
              ]}
            >
              {batteryLevel || 0}%
            </Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricCardContent}>
              <AntDesign name="dashboard" size={16} color="#C9B6FF" />
              <Text style={styles.metricLabel}>Số km</Text>
            </View>
            <Text style={styles.metricValue}>
              {item.currentOdometerKm?.toLocaleString("vi-VN") || 0} km
            </Text>
          </View>
          <View style={styles.metricCard}>
            <View style={styles.metricCardContent}>
              <AntDesign name="idcard" size={16} color="#FFB300" />
              <Text style={styles.metricLabel}>Lượt thuê</Text>
            </View>
            <Text style={styles.metricValue}>{reviewCount}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <AntDesign
              name="environment"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.infoText}>
              {item.vehicleModel?.description || "Không xác định"}
            </Text>
          </View>
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("RentedVehicleDetails", {
                vehicleId: item.id,
              })
            }
          >
            <AntDesign name="eye" size={16} color={colors.text.primary} />
            <Text style={styles.actionText}>Chi tiết xe</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.primaryAction]}
            onPress={() =>
              navigation.navigate("TrackingGPS", {
                vehicleId: item.id,
                licensePlate: item.licensePlate,
              })
            }
          >
            <AntDesign name="environment" size={16} color="#000" />
            <Text style={[styles.actionText, styles.primaryActionText]}>
              Theo dõi GPS
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <ScreenHeader
        title="Danh sách xe"
        subtitle={`${pagination.totalItems || filteredVehicles.length} xe`}
        showBackButton
        onBack={() => navigation.goBack()}
      />

      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Xe trong kho ({filteredVehicles.length})
        </Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={openFilterModal}
          activeOpacity={0.8}
        >
          <AntDesign name="filter" size={14} color="#000" />
          <Text style={styles.filterButtonText}>Bộ lọc</Text>
        </TouchableOpacity>
      </View>

      {hasActiveFilters && (
        <View style={styles.activeFiltersRow}>
          {!!filterModelId && (
            <View style={[styles.filterChip, styles.chipModel]}>
              <Text style={styles.filterChipText}>
                {vehicleModels.find((m) => m.id === filterModelId)?.modelName ||
                  "Mẫu xe"}
              </Text>
              <TouchableOpacity onPress={() => setFilterModelId("")}>
                <AntDesign name="close" size={12} color="#000" />
              </TouchableOpacity>
            </View>
          )}
          {filterStatus !== "all" && (
            <View style={[styles.filterChip, styles.chipStatus]}>
              <Text style={styles.filterChipText}>
                {getStatusText(filterStatus)}
              </Text>
              <TouchableOpacity onPress={() => setFilterStatus("all")}>
                <AntDesign name="close" size={12} color="#000" />
              </TouchableOpacity>
            </View>
          )}
          {!!filterColor && (
            <View style={[styles.filterChip, styles.chipColor]}>
              <Text style={styles.filterChipText}>Màu: {filterColor}</Text>
              <TouchableOpacity onPress={() => setFilterColor("")}>
                <AntDesign name="close" size={12} color="#000" />
              </TouchableOpacity>
            </View>
          )}
          {!!filterBatteryMin && (
            <View style={[styles.filterChip, styles.chipBattery]}>
              <Text style={styles.filterChipText}>
                Pin ≥ {filterBatteryMin}%
              </Text>
              <TouchableOpacity onPress={() => setFilterBatteryMin("")}>
                <AntDesign name="close" size={12} color="#000" />
              </TouchableOpacity>
            </View>
          )}
          {!!filterOdometerMin && (
            <View style={[styles.filterChip, styles.chipOdo]}>
              <Text style={styles.filterChipText}>
                Odo ≥ {filterOdometerMin} km
              </Text>
              <TouchableOpacity onPress={() => setFilterOdometerMin("")}>
                <AntDesign name="close" size={12} color="#000" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );

  const renderListFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View style={styles.listFooter}>
        <ActivityIndicator size="small" color="#C9B6FF" />
        <Text style={styles.listFooterText}>Đang tải thêm xe...</Text>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      {loading ? (
        <>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải danh sách xe...</Text>
        </>
      ) : (
        <>
          <AntDesign name="inbox" size={32} color={colors.text.secondary} />
          <Text style={styles.emptyStateTitle}>Không có xe phù hợp</Text>
          <Text style={styles.emptyStateSubtitle}>
            Thử điều chỉnh bộ lọc hoặc tìm kiếm khác.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={listRef}
        data={filteredVehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#C9B6FF"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={showFilterModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseFilterModal}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bộ lọc xe</Text>
              <TouchableOpacity onPress={handleCloseFilterModal}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.fieldRow}>
                <View style={styles.labelWithIcon}>
                  <AntDesign name="car" size={12} color="#C9B6FF" />
                  <Text style={styles.fieldLabel}>Mẫu xe</Text>
                </View>
                <View style={styles.selectContainer}>
                  <TouchableOpacity
                    style={styles.selectTrigger}
                    activeOpacity={0.8}
                    onPress={() => setShowModelList((prev) => !prev)}
                  >
                    <Text style={styles.selectTriggerText}>
                      {draftFilterModelId
                        ? vehicleModels.find((m) => m.id === draftFilterModelId)
                            ?.modelName || "Đã chọn mẫu xe"
                        : "Tất cả mẫu xe"}
                    </Text>
                    <AntDesign
                      name={showModelList ? "up" : "down"}
                      size={12}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                  {showModelList && (
                    <View style={styles.dropdownList}>
                      <ScrollView style={{ maxHeight: 180 }}>
                        <TouchableOpacity
                          style={[
                            styles.dropdownItem,
                            !draftFilterModelId && styles.dropdownItemActive,
                          ]}
                          onPress={() => {
                            setDraftFilterModelId("");
                            setShowModelList(false);
                          }}
                        >
                          <Text style={styles.dropdownItemText}>
                            Tất cả mẫu xe
                          </Text>
                        </TouchableOpacity>
                        {vehicleModels.map((model) => (
                          <TouchableOpacity
                            key={model.id}
                            style={[
                              styles.dropdownItem,
                              draftFilterModelId === model.id &&
                                styles.dropdownItemActive,
                            ]}
                            onPress={() => {
                              setDraftFilterModelId(model.id);
                              setShowModelList(false);
                            }}
                          >
                            <Text style={styles.dropdownItemText}>
                              {model.modelName}
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
                  placeholder="VD: Đỏ, Xanh..."
                  placeholderTextColor={colors.text.secondary}
                  style={styles.input}
                  value={draftFilterColor}
                  onChangeText={setDraftFilterColor}
                />
              </View>

              <View style={styles.twoCol}>
                <View style={styles.col}>
                  <View style={styles.labelWithIcon}>
                    <AntDesign name="dashboard" size={12} color="#C9B6FF" />
                    <Text style={styles.fieldLabel}>Odo tối thiểu (km)</Text>
                  </View>
                  <TextInput
                    placeholder="VD: 500"
                    placeholderTextColor={colors.text.secondary}
                    style={styles.input}
                    keyboardType="numeric"
                    value={draftFilterOdometerMin}
                    onChangeText={setDraftFilterOdometerMin}
                  />
                </View>
                <View style={styles.col}>
                  <View style={styles.labelWithIcon}>
                    <AntDesign name="thunderbolt" size={12} color="#C9B6FF" />
                    <Text style={styles.fieldLabel}>Pin tối thiểu (%)</Text>
                  </View>
                  <TextInput
                    placeholder="VD: 60"
                    placeholderTextColor={colors.text.secondary}
                    style={styles.input}
                    keyboardType="numeric"
                    value={draftFilterBatteryMin}
                    onChangeText={setDraftFilterBatteryMin}
                  />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <View style={styles.labelWithIcon}>
                  <AntDesign name="flag" size={12} color="#C9B6FF" />
                  <Text style={styles.fieldLabel}>Trạng thái</Text>
                </View>
                <View style={styles.statusRow}>
                  {["all", "Available", "Rented"].map((status) => {
                    const active = draftFilterStatus === status;
                    return (
                      <TouchableOpacity
                        key={status}
                        style={[
                          styles.statusChip,
                          active && styles.statusChipActive,
                        ]}
                        onPress={() =>
                          setDraftFilterStatus(status as VehicleStatusFilter)
                        }
                      >
                        <Text
                          style={[
                            styles.statusChipText,
                            active && styles.statusChipTextActive,
                          ]}
                        >
                          {status === "all" ? "Tất cả" : getStatusText(status)}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, styles.resetBtn]}
                onPress={resetDraftFilters}
              >
                <Text style={styles.modalBtnText}>Đặt lại</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, styles.applyBtn]}
                onPress={applyDraftFilters}
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
  listContent: {
    paddingBottom: 32,
  },
  listHeader: {
    paddingTop: 8,
    paddingBottom: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C9B6FF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#C9B6FF",
    gap: 6,
  },
  filterButtonText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
  },
  activeFiltersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  filterChipText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
  },
  chipStatus: {
    backgroundColor: "#FFD666",
  },
  chipModel: {
    backgroundColor: "#C9B6FF",
  },
  chipColor: {
    backgroundColor: "#9CDBFF",
  },
  chipBattery: {
    backgroundColor: "#67D16C",
  },
  chipOdo: {
    backgroundColor: "#C9B6FF",
  },
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
  },
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
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ratingValue: {
    color: "#FFD666",
    fontWeight: "700",
    fontSize: 13,
  },
  ratingLabel: {
    color: "#fff",
    fontSize: 11,
  },
  platePill: {
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  plateText: {
    color: "#fff",
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
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    flex: 1,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
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
    paddingVertical: 8,
    gap: 4,
  },
  primaryAction: {
    backgroundColor: "#C9B6FF",
  },
  actionText: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  primaryActionText: {
    color: "#000",
  },
  loadingState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
    gap: 12,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyStateTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  emptyStateSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 24,
    lineHeight: 18,
  },
  listFooter: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    gap: 8,
  },
  listFooterText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  modalContent: {
    paddingBottom: 12,
    gap: 16,
  },
  fieldRow: {
    gap: 8,
  },
  labelWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  fieldLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  selectContainer: {
    position: "relative",
  },
  selectTrigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  selectTriggerText: {
    color: colors.text.primary,
    fontSize: 13,
  },
  dropdownList: {
    position: "absolute",
    top: 52,
    left: 0,
    right: 0,
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 4,
    zIndex: 100,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  dropdownItemActive: {
    backgroundColor: "#2E2E2E",
  },
  dropdownItemText: {
    color: colors.text.primary,
    fontSize: 13,
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
  twoCol: {
    flexDirection: "row",
    gap: 12,
  },
  col: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    backgroundColor: "#2A2A2A",
  },
  statusChipActive: {
    backgroundColor: "#C9B6FF",
    borderColor: "#C9B6FF",
  },
  statusChipText: {
    color: colors.text.secondary,
    fontWeight: "600",
    fontSize: 12,
  },
  statusChipTextActive: {
    color: "#000",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
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
  resetBtn: {
    backgroundColor: "#2A2A2A",
  },
  applyBtn: {
    backgroundColor: "#C9B6FF",
    borderColor: "#C9B6FF",
  },
  modalBtnText: {
    color: colors.text.primary,
    fontWeight: "700",
  },
});
