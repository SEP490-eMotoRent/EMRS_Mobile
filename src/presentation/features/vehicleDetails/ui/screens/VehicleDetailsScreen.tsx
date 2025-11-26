import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  BrowseStackParamList,
  HomeStackParamList,
} from "../../../../shared/navigation/StackParameters/types";

import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../core/di/InjectionContainer";
import { VehicleModelRemoteDataSource } from "../../../../../data/datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { useVehicleBranches } from "../../hooks/useVehicleBranches";
import { useVehicleDetail } from "../../hooks/useVehicleModelsDetails";
import { BookingButtonWithPrice } from "../atoms/buttons/BookingButtonWithPrice";
import { ConditionSection } from "../organisms/ConditionSection";
import { ImageGallery } from "../organisms/ImageGallery";
import { PickupLocationSection } from "../organisms/PickupLocationSection";

type RoutePropType = RouteProp<BrowseStackParamList, "VehicleDetails">;
type NavProp = StackNavigationProp<HomeStackParamList>;

export const VehicleDetailsScreen: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavProp>();
  
  // ✅ UPDATED: Extract dateRange and location from route params
  const { vehicleId, dateRange, location } = route.params;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const remote = useMemo(
    () => sl.get<VehicleModelRemoteDataSource>("VehicleModelRemoteDataSource"),
    []
  );

  const branchUseCase = useMemo(
    () => sl.getBranchesByVehicleModelUseCase(),
    []
  );

  const { data, loading, error } = useVehicleDetail(vehicleId, remote);
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useVehicleBranches(vehicleId, branchUseCase);

  // Auto-select first branch when branches load
  React.useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      setSelectedBranchId(branches[0].id);
    }
  }, [branches, selectedBranchId]);

  if (loading || branchesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  if (!data || error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{error || "Không Tìm Được Xe"}</Text>
      </View>
    );
  }

  const images = data.images;
  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const securityDeposit = data.depositAmount > 0 ? data.depositAmount : 2000000;

  const handleBooking = () => {
    if (!selectedBranchId || !selectedBranch) {
      return;
    }

    navigation.navigate("Booking", {
      screen: "ConfirmRentalDuration",
      params: {
        vehicleId,
        vehicleName: data.name,
        vehicleImageUrl: data.imageUrl,
        branchId: selectedBranchId,
        branchName: selectedBranch.name,
        pricePerDay: data.pricePerDay,
        securityDeposit: securityDeposit,
        branchOpenTime: selectedBranch.openingTime,
        branchCloseTime: selectedBranch.closingTime,
        vehicleCategory: data.category || "ECONOMY",
        dateRange: dateRange,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Chi tiết xe"
          subtitle={data.name}
          onBack={() => navigation.goBack()}
        />

        <ImageGallery images={images} />

        {/* Vehicle Name */}
        <View style={styles.nameContainer}>
          <Text style={styles.vehicleName}>{data.name}</Text>
        </View>

        {/* ✅ Specs as vertical list - "Đặc Điểm" */}
        <View style={styles.specsSection}>
          <Text style={styles.sectionTitle}>Đặc Điểm</Text>
          
          {data.battery && (
            <View style={styles.specRow}>
              <View style={styles.specIconContainer}>
                <Text style={styles.specIcon}>🔋</Text>
              </View>
              <View style={styles.specContent}>
                <Text style={styles.specLabel}>Pin</Text>
                <Text style={styles.specValue}>{data.battery}</Text>
              </View>
            </View>
          )}
          
          {data.topSpeed && (
            <View style={styles.specRow}>
              <View style={styles.specIconContainer}>
                <Text style={styles.specIcon}>⚡</Text>
              </View>
              <View style={styles.specContent}>
                <Text style={styles.specLabel}>Tốc Độ Tối Đa</Text>
                <Text style={styles.specValue}>{data.topSpeed}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.specRow}>
            <View style={styles.specIconContainer}>
              <Text style={styles.specIcon}>📍</Text>
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Quãng Đường Tối Đa</Text>
              <Text style={styles.specValue}>{data.range || "N/A"}</Text>
            </View>
          </View>
          
          <View style={styles.specRow}>
            <View style={styles.specIconContainer}>
              <Text style={styles.specIcon}>🏍️</Text>
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Loại Xe</Text>
              <Text style={styles.specValue}>{data.category || "ECONOMY"}</Text>
            </View>
          </View>
        </View>

        {/* ✅ Security Deposit Card */}
        <View style={styles.depositCard}>
          <View style={styles.depositHeader}>
            <Text style={styles.depositIcon}>💰</Text>
            <Text style={styles.depositLabel}>Đặt Cọc</Text>
          </View>
          <Text style={styles.depositAmount}>
            {securityDeposit.toLocaleString('vi-VN')}₫
          </Text>
        </View>

        {/* ✅ Description with Vietnamese buttons */}
        {data.description && data.description !== "No description." && (
          <View style={styles.descriptionContainer}>
            <View style={styles.descriptionHeader}>
              <Text style={styles.descriptionTitle}>Thông Tin Xe</Text>
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                activeOpacity={0.7}
              >
                <Text style={styles.showMoreText}>
                  {isDescriptionExpanded ? "Ẩn Đi" : "Hiển Thị Thêm"}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={styles.descriptionText}
              numberOfLines={isDescriptionExpanded ? undefined : 3}
            >
              {data.description}
            </Text>
          </View>
        )}

        {/* ✅ Pickup Location */}
        <PickupLocationSection
          branches={branches}
          branchesError={branchesError}
          selectedBranchId={selectedBranchId}
          onBranchSelect={setSelectedBranchId}
        />

        {/* ✅ Conditions at the bottom */}
        <ConditionSection
          requirements={[
            "Yêu cầu CMND/CCCD",
            "Yêu cầu Giấy phép lái xe",
            "Khách hàng phải đặt cọc",
          ]}
        />
      </ScrollView>

      <BookingButtonWithPrice
        pricePerDay={data.pricePerDay}
        dateRange={dateRange}
        onPress={handleBooking}
        disabled={!selectedBranchId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100, // ✅ Space for booking button + safe area
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  error: {
    color: "#FF4444",
    fontSize: 16,
    textAlign: "center",
    paddingHorizontal: 32,
  },
  nameContainer: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  vehicleName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
  },
  // ✅ Vertical specs list
  specsSection: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  specRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  specIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  specIcon: {
    fontSize: 20,
  },
  specContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  specLabel: {
    color: "#999",
    fontSize: 14,
    fontWeight: "500",
  },
  specValue: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
  depositCard: {
    backgroundColor: "#1a1a1a",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  depositHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  depositIcon: {
    fontSize: 20,
  },
  depositLabel: {
    color: "#999",
    fontSize: 14,
    fontWeight: "600",
  },
  depositAmount: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "700",
    textAlign: "left",
  },
  descriptionContainer: {
    backgroundColor: "#1a1a1a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  descriptionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  descriptionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  showMoreButton: {
    backgroundColor: "#a78bfa",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  showMoreText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },
  descriptionText: {
    color: "#9ca3af",
    fontSize: 14,
    lineHeight: 20,
  },
});