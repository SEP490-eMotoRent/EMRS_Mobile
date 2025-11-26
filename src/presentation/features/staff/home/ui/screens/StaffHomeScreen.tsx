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
  Dimensions,
} from "react-native";
import Carousel, {
  ICarouselInstance,
  Pagination,
} from "react-native-reanimated-carousel";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { Vehicle } from "../../../../../../domain/entities/vehicle/Vehicle";
import { GetVehicleListUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleListUseCase";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { useSharedValue } from "react-native-reanimated";
import { BrandTitle } from "../../../../authentication/ui/atoms";

type StaffHomeScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "Home"
>;

const PAGE_SIZE = 6;

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CAROUSEL_WIDTH = SCREEN_WIDTH - 32;
const CAROUSEL_HEIGHT = 180;

const data = [
  require("../../../../../../../assets/images/banner1.jpg"),
  require("../../../../../../../assets/images/banner2.jpg"),
  require("../../../../../../../assets/images/banner3.jpg"),
];

export const StaffHomeScreen: React.FC = () => {
  const navigation = useNavigation<StaffHomeScreenNavigationProp>();
  const user = useAppSelector((state: any) => state.auth.user);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const progress = useSharedValue<number>(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [carouselIndex, setCarouselIndex] = useState(0);
  const ref = React.useRef<ICarouselInstance>(null);

  const vehiclePlaceholder = require("../../../../../../../assets/images/motor.png");

  const fetchVehicles = useCallback(
    async (options?: { silent?: boolean }) => {
      try {
        if (!options?.silent) {
          setLoading(true);
        }

        const getVehicleListUseCase = new GetVehicleListUseCase(
          sl.get("VehicleRepository")
        );

        const response = await getVehicleListUseCase.execute(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          user.branchId,
          undefined,
          PAGE_SIZE,
          1
        );

        setVehicles(response.items);
        setPagination({
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalItems: response.totalItems,
        });
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      } finally {
        if (!options?.silent) {
          setLoading(false);
        }
      }
    },
    [user.branchId]
  );

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchVehicles({ silent: true });
    setRefreshing(false);
  };
  const featuredVehicles = useMemo(
    () => vehicles.slice(0, Math.min(4, vehicles.length)),
    [vehicles]
  );

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

  const renderVehicleCard = ({ item }: { item: Vehicle }) => {
    const batteryLevel = item.batteryHealthPercentage || 0;
    const statusColor = getStatusColor(item.status);
    const imageSource =
      item.fileUrl && item.fileUrl.length > 0
        ? { uri: item.fileUrl[0] }
        : vehiclePlaceholder;
    const pricePerDay = item.vehicleModel?.rentalPricing?.rentalPrice || 0;
    const reviewCount = item.bookings?.length || 0;
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
            <AntDesign name="home" size={13} color="#C9B6FF" />
            <Text style={styles.infoChipText}>
              {item.branch?.branchName || "Chưa có chi nhánh"}
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
            <AntDesign
              name="thunderbolt"
              size={16}
              color={getBatteryColor(batteryLevel)}
            />
            <Text style={styles.metricLabel}>Pin</Text>
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
            <AntDesign name="dashboard" size={16} color="#C9B6FF" />
            <Text style={styles.metricLabel}>Số km</Text>
            <Text style={styles.metricValue}>
              {item.currentOdometerKm?.toLocaleString("vi-VN") || 0} km
            </Text>
          </View>
          <View style={styles.metricCard}>
            <AntDesign name="idcard" size={16} color="#FFB300" />
            <Text style={styles.metricLabel}>Lượt thuê</Text>
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
              {item.branch?.address || "Không có địa chỉ chi nhánh"}
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

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };
  const defaultDataWith6Colors = ["#B0604D", "#899F9C", "#B3C680"];
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.headerTitle}>
        <View style={styles.brandRow}>
          <Image
            source={require("../../../../../../../assets/images/LOGO.jpg")}
            style={styles.brandLogo}
          />
          <BrandTitle
            title="eMotoRent"
            accessibilityLabel="eMotoRent brand title"
            textStyle={styles.brandText}
          />
        </View>
        <Text style={styles.welcomeText} numberOfLines={1}>
          Chào mừng trở lại,{" "}
          <Text style={{ color: "#C9B6FF" }}>{user?.fullName || "Staff"}!</Text>
        </Text>
        <Text style={styles.welcomeSubtitle}>
          {pagination.totalItems
            ? `${pagination.totalItems} xe thuộc chi nhánh của bạn`
            : "Theo dõi nhanh đội xe và trạng thái hoạt động hôm nay."}
        </Text>
      </View>
      <View style={styles.carouselContainer}>
        <Carousel
          ref={ref}
          width={CAROUSEL_WIDTH}
          height={CAROUSEL_HEIGHT}
          data={data}
          onProgressChange={progress}
          renderItem={({ item }) => (
            <View style={styles.carouselItem}>
              <Image
                source={item}
                style={styles.carouselImage}
                resizeMode="cover"
              />
            </View>
          )}
          autoPlay
          autoPlayInterval={4000}
          loop
          pagingEnabled
          snapEnabled
          enabled
        />
        <Pagination.Basic<{ color: string }>
          progress={progress}
          data={defaultDataWith6Colors.map((color) => ({ color }))}
          dotStyle={{
            width: 25,
            height: 4,
            backgroundColor: "#fff",
          }}
          activeDotStyle={{
            overflow: "hidden",
            backgroundColor: "#C9B6FF",
          }}
          containerStyle={{
            gap: 10,
            marginTop: 10,
          }}
          horizontal
          onPress={onPressPagination}
        />
      </View>
      <View style={styles.headerRow}>
        <Text style={styles.sectionTitle}>
          Xe nổi bật ({featuredVehicles.length})
        </Text>
        <TouchableOpacity
          style={styles.viewAllButton}
          onPress={() => navigation.navigate("AllVehicles")}
          activeOpacity={0.85}
        >
          <Text style={styles.viewAllText}>Xem tất cả</Text>
          <AntDesign name="right" size={12} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );

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
          <Text style={styles.emptyStateTitle}>Chưa có dữ liệu xe</Text>
          <Text style={styles.emptyStateSubtitle}>
            Kiểm tra lại sau hoặc tải lại danh sách.
          </Text>
        </>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={featuredVehicles}
        renderItem={renderVehicleCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#C9B6FF"
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
  headerTitle: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  carouselContainer: {
    marginHorizontal: 16,
    marginBottom: 4,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  carouselItem: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
  },
  carouselOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContent: {
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
  },
  carouselTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  carouselSubtitle: {
    color: "#E0E0E0",
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  carouselIndicators: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
  indicatorActive: {
    width: 24,
    backgroundColor: "#C9B6FF",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  brandLogo: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#fff",
  },
  brandText: {
    fontSize: 20,
    color: "#fff",
  },
  welcomeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    marginTop: 8,
  },
  welcomeSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 4,
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
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C9B6FF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  viewAllText: {
    color: "#000",
    fontSize: 13,
    fontWeight: "700",
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
  motorbikePlate: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
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
});
