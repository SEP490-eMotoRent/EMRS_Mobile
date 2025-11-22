import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../../common/theme/colors";
import { GetVehicleDetailUseCase } from "../../../../../../domain/usecases/vehicle/GetVehicleDetailUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { Vehicle } from "../../../../../../domain/entities/vehicle/Vehicle";

const { width } = Dimensions.get("window");

const formatVnd = (n: number) =>
  new Intl.NumberFormat("vi-VN").format(n) + " VND";

const formatDate = (dateString?: string | Date) => {
  if (!dateString) return "-";
  const date =
    typeof dateString === "string" ? new Date(dateString) : dateString;
  return date.toLocaleDateString("vi-VN");
};

type RentedVehicleDetailsRouteProp = RouteProp<
  StaffStackParamList,
  "RentedVehicleDetails"
>;

export const RentedVehicleDetailsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RentedVehicleDetailsRouteProp>();
  const { vehicleId } = route.params || {};

  const [activeImage, setActiveImage] = useState(0);
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getVehicleDetails = async () => {
      try {
        setLoading(true);
        const vehicleDetailsUseCase = new GetVehicleDetailUseCase(
          sl.get("VehicleRepository")
        );
        const vehicle = await vehicleDetailsUseCase.execute(vehicleId);
        setVehicle(vehicle);
      } catch (error) {
        console.error("Error fetching vehicle details:", error);
      } finally {
        setLoading(false);
      }
    };
    getVehicleDetails();
  }, [vehicleId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Chi tiết xe thuê"
          subtitle="Đang tải..."
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải thông tin xe...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Chi tiết xe thuê"
          subtitle="Không tìm thấy"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.errorContainer}>
          <AntDesign name="warning" size={32} color="#F97316" />
          <Text style={styles.errorText}>Không thể tải thông tin xe</Text>
        </View>
      </SafeAreaView>
    );
  }

  const statusColors: Record<string, string> = {
    Rented: "#FFD666",
    Available: "#67D16C",
    Unavailable: "#FF8A80",
    Maintenance: "#F97316",
  };

  const statusTextColors: Record<string, string> = {
    Rented: "#000",
    Available: "#000",
    Unavailable: "#fff",
    Maintenance: "#000",
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          title="Chi tiết xe thuê"
          subtitle={vehicle.licensePlate || "Đang cập nhật"}
          onBack={() => navigation.goBack()}
        />

        {/* Hero Image Gallery */}
        <View style={styles.heroCard}>
          {vehicle.fileUrl && vehicle.fileUrl.length > 0 ? (
            <View>
              <Image
                source={{ uri: vehicle.fileUrl[activeImage] }}
                style={styles.heroImage}
                resizeMode="cover"
              />
              <View style={styles.heroPagination}>
                <Text style={styles.heroCounter}>
                  {activeImage + 1} / {vehicle.fileUrl.length}
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.heroPlaceholder}>
              <AntDesign name="car" size={48} color={colors.text.secondary} />
              <Text style={styles.heroPlaceholderText}>
                Chưa có hình ảnh xe
              </Text>
            </View>
          )}
        </View>
        {vehicle.fileUrl && vehicle.fileUrl.length > 1 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailStrip}
            contentContainerStyle={styles.thumbnailStripContent}
          >
            {vehicle.fileUrl.map((img, index) => (
              <TouchableOpacity
                key={img + index}
                activeOpacity={0.8}
                onPress={() => setActiveImage(index)}
              >
                <Image
                  source={{ uri: img }}
                  style={[
                    styles.thumbnail,
                    index === activeImage && styles.thumbnailActive,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        {/* Model Name & Status */}
        <View style={styles.modelHeader}>
          <View style={styles.modelInfo}>
            <Text style={styles.modelName}>
              {vehicle.vehicleModel?.modelName || "Chưa có tên mẫu"}
            </Text>
            {vehicle.vehicleModel?.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>
                  {vehicle.vehicleModel.category}
                </Text>
              </View>
            )}
          </View>
          {vehicle.status && (
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor:
                    statusColors[vehicle.status] || statusColors.Available,
                },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  {
                    color:
                      statusTextColors[vehicle.status] ||
                      statusTextColors.Available,
                  },
                ]}
              >
                {vehicle.status}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Info Chips */}
        <View style={styles.chipsRow}>
          {vehicle.licensePlate && (
            <View style={styles.chip}>
              <AntDesign name="idcard" size={12} color="#fff" />
              <Text style={styles.chipText}>Biển số: {vehicle.licensePlate}</Text>
            </View>
          )}
          {vehicle.color && (
            <View style={styles.chip}>
              <AntDesign name="bg-colors" size={12} color="#fff" />
              <Text style={styles.chipText}>Màu: {vehicle.color}</Text>
            </View>
          )}
          {vehicle.branch?.branchName && (
            <View style={styles.chip}>
              <AntDesign name="environment" size={12} color="#fff" />
              <Text style={styles.chipText} numberOfLines={1}>
                Chi nhánh: {vehicle.branch.branchName}
              </Text>
            </View>
          )}
        </View>

        {/* Vehicle Specifications */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <AntDesign name="car" size={18} color="#C9B6FF" />
            <Text style={styles.sectionTitle}>Thông số xe</Text>
          </View>
          <View style={styles.specGrid}>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="idcard" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Mã xe</Text>
              <Text style={styles.specValue}>
                {vehicle.id ? `#${vehicle.id.slice(-8)}` : "-"}
              </Text>
            </View>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="dashboard" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Số km</Text>
              <Text style={styles.specValue}>
                {vehicle.currentOdometerKm?.toLocaleString("vi-VN") || "0"} km
              </Text>
            </View>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="thunderbolt" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Pin</Text>
              <Text style={styles.specValue}>
                {vehicle.batteryHealthPercentage || 0}%
              </Text>
            </View>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="calendar" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Năm SX</Text>
              <Text style={styles.specValue}>
                {formatDate(vehicle.yearOfManufacture)}
              </Text>
            </View>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="shopping" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Ngày mua</Text>
              <Text style={styles.specValue}>
                {formatDate(vehicle.purchaseDate)}
              </Text>
            </View>
            <View style={styles.specTile}>
              <View style={styles.specIconWrap}>
                <AntDesign name="bg-colors" size={14} color="#fff" />
              </View>
              <Text style={styles.specLabel}>Màu sắc</Text>
              <Text style={styles.specValue}>{vehicle.color || "-"}</Text>
            </View>
          </View>
        </View>

        {/* Performance Metrics */}
        {vehicle.vehicleModel && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="rocket" size={18} color="#C9B6FF" />
              <Text style={styles.sectionTitle}>Hiệu suất</Text>
            </View>
            <View style={styles.performanceList}>
              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <AntDesign name="thunderbolt" size={18} color="#000" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceTitle}>Dung lượng pin</Text>
                  <Text style={styles.performanceValue}>
                    {vehicle.vehicleModel.batteryCapacityKwh || 0} kWh
                  </Text>
                </View>
              </View>
              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <AntDesign name="arrow-right" size={18} color="#000" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceTitle}>
                    Quãng đường tối đa
                  </Text>
                  <Text style={styles.performanceValue}>
                    {vehicle.vehicleModel.maxRangeKm || 0} km
                  </Text>
                </View>
              </View>
              <View style={styles.performanceItem}>
                <View style={styles.performanceIcon}>
                  <AntDesign name="dashboard" size={18} color="#000" />
                </View>
                <View style={styles.performanceContent}>
                  <Text style={styles.performanceTitle}>Tốc độ tối đa</Text>
                  <Text style={styles.performanceValue}>
                    {vehicle.vehicleModel.maxSpeedKmh || 0} km/h
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Pricing Information */}
        {vehicle.vehicleModel?.rentalPricing && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="wallet" size={18} color="#C9B6FF" />
              <Text style={styles.sectionTitle}>Giá thuê</Text>
            </View>
            <View style={styles.pricingRow}>
              <View style={styles.pricingItem}>
                <Text style={styles.pricingLabel}>Giá thuê/ngày</Text>
                <Text style={styles.pricingValue}>
                  {formatVnd(vehicle.vehicleModel.rentalPricing.rentalPrice)}
                </Text>
              </View>
              <View style={styles.pricingDivider} />
              <View style={styles.pricingItem}>
                <Text style={styles.pricingLabel}>Phí vượt km</Text>
                <Text style={styles.pricingValue}>
                  {formatVnd(vehicle.vehicleModel.rentalPricing.excessKmPrice)}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Branch Information */}
        {vehicle.branch && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="environment" size={18} color="#C9B6FF" />
              <Text style={styles.sectionTitle}>Chi nhánh</Text>
            </View>
            <View style={styles.branchInfo}>
              <Text style={styles.branchName}>{vehicle.branch.branchName}</Text>
              {vehicle.branch.address && (
                <View style={styles.branchDetailRow}>
                  <AntDesign
                    name="home"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.branchDetailText}>
                    {vehicle.branch.address}
                    {vehicle.branch.city && `, ${vehicle.branch.city}`}
                  </Text>
                </View>
              )}
              {vehicle.branch.phone && (
                <View style={styles.branchDetailRow}>
                  <AntDesign
                    name="phone"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.branchDetailText}>
                    {vehicle.branch.phone}
                  </Text>
                </View>
              )}
              {vehicle.branch.email && (
                <View style={styles.branchDetailRow}>
                  <AntDesign
                    name="mail"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.branchDetailText}>
                    {vehicle.branch.email}
                  </Text>
                </View>
              )}
              {vehicle.branch.openingTime && vehicle.branch.closingTime && (
                <View style={styles.branchDetailRow}>
                  <AntDesign
                    name="clock-circle"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.branchDetailText}>
                    {vehicle.branch.openingTime} - {vehicle.branch.closingTime}
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Description */}
        {(vehicle.description || vehicle.vehicleModel?.description) && (
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <AntDesign name="file-text" size={18} color="#C9B6FF" />
              <Text style={styles.sectionTitle}>Mô tả</Text>
            </View>
            <Text style={styles.descriptionText}>
              {vehicle.description ||
                vehicle.vehicleModel?.description ||
                "Không có mô tả"}
            </Text>
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
  scrollContent: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 32,
  },
  errorText: {
    color: colors.text.secondary,
    fontSize: 16,
    textAlign: "center",
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#111",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  heroImage: {
    width: "100%",
    height: width * 0.6,
    resizeMode: "cover",
  },
  heroPlaceholder: {
    width: "100%",
    height: width * 0.6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1f1f1f",
    gap: 12,
  },
  heroPlaceholderText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  heroPagination: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  heroCounter: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  thumbnailStrip: {
    backgroundColor: "#0f0f0f",
  },
  thumbnailStripContent: {
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 10,
    opacity: 0.5,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbnailActive: {
    opacity: 1,
    borderColor: "#C9B6FF",
  },
  modelHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 12,
  },
  modelInfo: {
    flex: 1,
    gap: 8,
  },
  modelName: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(201,182,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  categoryText: {
    color: "#C9B6FF",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  chipText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 18,
    borderRadius: 20,
    backgroundColor: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  specGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  specTile: {
    width: (width - 16 * 2 - 12 - 18 * 2) / 2,
    backgroundColor: "#111",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#272727",
    alignItems: "center",
  },
  specIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  specLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    marginBottom: 4,
    textAlign: "center",
  },
  specValue: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  performanceList: {
    gap: 12,
  },
  performanceItem: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: "#131313",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#222",
  },
  performanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  performanceContent: {
    flex: 1,
    gap: 4,
  },
  performanceTitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  performanceValue: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  pricingRow: {
    flexDirection: "row",
    gap: 16,
  },
  pricingItem: {
    flex: 1,
    gap: 6,
  },
  pricingLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  pricingValue: {
    color: "#C9B6FF",
    fontSize: 16,
    fontWeight: "700",
  },
  pricingDivider: {
    width: 1,
    backgroundColor: "#2a2a2a",
  },
  branchInfo: {
    gap: 12,
  },
  branchName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  branchDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  branchDetailText: {
    color: colors.text.secondary,
    fontSize: 13,
    flex: 1,
  },
  descriptionText: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 22,
  },
  highlight: {
    color: "#C9B6FF",
    fontWeight: "700",
  },
});
