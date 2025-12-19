import { CompositeNavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
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
  HomeStackParamList
} from "../../../../shared/navigation/StackParameters/types";

import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { useRenterProfile } from "../../../../features/profile/hooks/profile/useRenterProfile";
import { useVehicleBranches } from "../../hooks/useVehicleBranches";
import { useVehicleDetail } from "../../hooks/useVehicleModelsDetails";
import { BookingButtonWithPrice } from "../atoms/buttons/BookingButtonWithPrice";
import { ImageGallery } from "../organisms/ImageGallery";
import { PickupLocationSection } from "../organisms/PickupLocationSection";
import { Icon } from "../atoms/Icons/Icons";

type RoutePropType = RouteProp<BrowseStackParamList, "VehicleDetails">;
type NavProp = CompositeNavigationProp<
  StackNavigationProp<BrowseStackParamList, "VehicleDetails">,
  StackNavigationProp<HomeStackParamList>
>;

export const VehicleDetailsScreen: React.FC = () => {
  const route = useRoute<RoutePropType>();
  const navigation = useNavigation<NavProp>();
  
  const { vehicleId, dateRange, location } = route.params;

  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  const { data, loading, error } = useVehicleDetail(vehicleId);
  const {
    branches,
    loading: branchesLoading,
    error: branchesError,
  } = useVehicleBranches(vehicleId);

  const { renter, renterResponse } = useRenterProfile();

  // ✅ NEW: Check if profile is complete
  const checkProfileComplete = () => {
    if (!renter || !renterResponse) {
      return { 
        complete: false, 
        missing: ['Thông tin cá nhân chưa đầy đủ'] 
      };
    }

    const missing: string[] = [];

    // Check required personal info
    if (!renter.account?.fullname?.trim()) {
      missing.push('Họ Tên');
    }

    // Check phone (must be valid Vietnamese number)
    const phone = renter.phone || '';
    const cleanPhone = phone.replace(/^\+84/, '0').replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10 || !cleanPhone.startsWith('0')) {
      missing.push('Số Điện Thoại (10 chữ số)');
    }

    if (!renter.address?.trim()) {
      missing.push('Địa Chỉ');
    }

    if (!renterResponse.dateOfBirth?.trim()) {
      missing.push('Ngày Sinh');
    }

    return {
      complete: missing.length === 0,
      missing,
    };
  };

  // ✅ UPDATED: Check documents complete
  const checkDocumentsComplete = () => {
    if (!renterResponse) {
      return { 
        complete: false, 
        missing: ['Căn Cước Công Dân', 'Giấy Phép Lái Xe'] 
      };
    }

    const citizenDoc = renterResponse.documents.find(
      doc => doc.documentType === 'Citizen'
    );
    const licenseDoc = renterResponse.documents.find(
      doc => doc.documentType === 'Driving' || 
            doc.documentType === 'License' || 
            doc.documentType === 'DriverLicense'
    );

    const missing: string[] = [];
    if (!citizenDoc) missing.push('Căn Cước Công Dân');
    if (!licenseDoc) missing.push('Giấy Phép Lái Xe');

    return {
      complete: missing.length === 0,
      hasCitizen: !!citizenDoc,
      hasLicense: !!licenseDoc,
      missing,
    };
  };

  const profileStatus = checkProfileComplete();
  const documentsStatus = checkDocumentsComplete();

  React.useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      const firstAvailableBranch = branches.find(b => (b.vehicleCount ?? 0) > 0);
      if (firstAvailableBranch) {
        setSelectedBranchId(firstAvailableBranch.id);
      } else {
        setSelectedBranchId(branches[0].id);
      }
    }
  }, [branches, selectedBranchId]);

  if (loading || branchesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#B8A4FF" />
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

  const images = Array.isArray(data.images) 
    ? data.images 
    : data.imageUrl 
      ? [data.imageUrl] 
      : ['https://via.placeholder.com/400x300?text=No+Image'];

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);
  const securityDeposit = data.depositAmount > 0 ? data.depositAmount : 2000000;

  const hasAvailableVehicles = selectedBranch && (selectedBranch.vehicleCount ?? 0) > 0;
  
  // ✅ UPDATED: Block booking if profile incomplete OR documents incomplete
  const isBookingDisabled = 
    !selectedBranchId || 
    !hasAvailableVehicles || 
    !profileStatus.complete || 
    !documentsStatus.complete;

  const handleBooking = () => {
    if (!selectedBranchId || !selectedBranch) {
      return;
    }

    if (!hasAvailableVehicles) {
      console.warn('⚠️ Cannot book - no vehicles available at selected branch');
      return;
    }

    if (!profileStatus.complete) {
      console.warn('⚠️ Cannot book - profile incomplete');
      return;
    }

    if (!documentsStatus.complete) {
      console.warn('⚠️ Cannot book - documents incomplete');
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

  const handleGoToProfile = () => {
    navigation.navigate('ProfileTab', {
      screen: 'EditProfile',
    });
  };

  const handleGoToDocuments = () => {
    navigation.navigate('ProfileTab', {
      screen: 'DocumentManagement',
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

        <View style={styles.nameContainer}>
          <Text style={styles.vehicleName}>{data.name}</Text>
        </View>

        <View style={styles.specsSection}>
          <Text style={styles.sectionTitle}>Đặc Điểm</Text>
          
          {data.battery && (
            <View style={styles.specRow}>
              <View style={styles.specIconContainer}>
                <Icon name="battery" size={20} color="#B8A4FF" />
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
                <Icon name="flash" size={20} color="#B8A4FF" />
              </View>
              <View style={styles.specContent}>
                <Text style={styles.specLabel}>Tốc Độ Tối Đa</Text>
                <Text style={styles.specValue}>{data.topSpeed}</Text>
              </View>
            </View>
          )}
          
          <View style={styles.specRow}>
            <View style={styles.specIconContainer}>
              <Icon name="location" size={20} color="#B8A4FF" />
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Quãng Đường Tối Đa</Text>
              <Text style={styles.specValue}>{data.range || "N/A"}</Text>
            </View>
          </View>
          
          <View style={styles.specRow}>
            <View style={styles.specIconContainer}>
              <Icon name="vehicle" size={20} color="#B8A4FF" />
            </View>
            <View style={styles.specContent}>
              <Text style={styles.specLabel}>Loại Xe</Text>
              <Text style={styles.specValue}>{data.category || "ECONOMY"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.depositCard}>
          <View style={styles.depositHeader}>
            <Icon name="wallet" size={20} color="#B8A4FF" />
            <Text style={styles.depositLabel}>Đặt Cọc</Text>
          </View>
          <Text style={styles.depositAmount}>
            {securityDeposit.toLocaleString('vi-VN')}₫
          </Text>
        </View>

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

        {/* ✅ NEW: Profile Completion Warning */}
        <View style={[
          styles.requirementWarning,
          profileStatus.complete && styles.requirementWarningComplete
        ]}>
          <View style={styles.requirementWarningHeader}>
            <Icon 
              name="person" 
              size={24} 
              color={profileStatus.complete ? "#10b981" : "#B8A4FF"} 
            />
            <View style={styles.requirementWarningTextContainer}>
              <Text style={[
                styles.requirementWarningTitle,
                profileStatus.complete && styles.requirementWarningTitleComplete
              ]}>
                {profileStatus.complete ? 'Thông Tin Đã Đầy Đủ' : 'Yêu Cầu Thông Tin Cá Nhân'}
              </Text>
              <Text style={styles.requirementWarningMessage}>
                {profileStatus.complete 
                  ? 'Thông tin cá nhân của bạn đã được hoàn tất.'
                  : 'Vui lòng hoàn thiện thông tin cá nhân để đặt xe:'}
              </Text>
            </View>
          </View>
          
          {!profileStatus.complete && profileStatus.missing.length > 0 && (
            <View style={styles.missingList}>
              {profileStatus.missing.map((item, index) => (
                <View key={index} style={styles.missingItem}>
                  <Icon name="close" size={18} color="#ef4444" />
                  <Text style={styles.missingText}>{item}</Text>
                </View>
              ))}
            </View>
          )}

          <TouchableOpacity 
            style={[
              styles.actionButton,
              profileStatus.complete && styles.actionButtonComplete
            ]}
            onPress={handleGoToProfile}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>
              {profileStatus.complete ? 'Quản Lý Thông Tin' : 'Hoàn Thiện Thông Tin'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ✅ UPDATED: Document Verification Section */}
        <View style={[
          styles.requirementWarning,
          documentsStatus.complete && styles.requirementWarningComplete
        ]}>
          <View style={styles.requirementWarningHeader}>
            <Icon 
              name="document" 
              size={24} 
              color={documentsStatus.complete ? "#10b981" : "#B8A4FF"} 
            />
            <View style={styles.requirementWarningTextContainer}>
              <Text style={[
                styles.requirementWarningTitle,
                documentsStatus.complete && styles.requirementWarningTitleComplete
              ]}>
                {documentsStatus.complete ? 'Giấy Tờ Đã Xác Thực' : 'Yêu Cầu Giấy Tờ'}
              </Text>
              <Text style={styles.requirementWarningMessage}>
                {documentsStatus.complete 
                  ? 'Bạn đã tải đầy đủ giấy tờ cần thiết để đặt xe.'
                  : 'Bạn cần tải lên đầy đủ giấy tờ để đặt xe:'}
              </Text>
            </View>
          </View>
          
          <View style={styles.missingList}>
            <View style={styles.missingItem}>
              <Icon 
                name={documentsStatus.hasCitizen ? "checkmark" : "close"} 
                size={18} 
                color={documentsStatus.hasCitizen ? "#10b981" : "#ef4444"} 
              />
              <Text style={documentsStatus.hasCitizen ? styles.completeText : styles.missingText}>
                Căn Cước Công Dân (CCCD)
              </Text>
            </View>
            
            <View style={styles.missingItem}>
              <Icon 
                name={documentsStatus.hasLicense ? "checkmark" : "close"} 
                size={18} 
                color={documentsStatus.hasLicense ? "#10b981" : "#ef4444"} 
              />
              <Text style={documentsStatus.hasLicense ? styles.completeText : styles.missingText}>
                Giấy Phép Lái Xe
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={[
              styles.actionButton,
              documentsStatus.complete && styles.actionButtonComplete
            ]}
            onPress={handleGoToDocuments}
            activeOpacity={0.7}
          >
            <Text style={styles.actionButtonText}>
              {documentsStatus.complete ? 'Quản Lý Giấy Tờ' : 'Tải Lên Giấy Tờ'}
            </Text>
          </TouchableOpacity>
        </View>

        <PickupLocationSection
          branches={branches}
          branchesError={branchesError}
          selectedBranchId={selectedBranchId}
          onBranchSelect={setSelectedBranchId}
        />

        {selectedBranch && (selectedBranch.vehicleCount ?? 0) === 0 && (
          <View style={styles.unavailableWarning}>
            <Icon name="warning" size={24} color="#ff6b6b" />
            <View style={styles.unavailableTextContainer}>
              <Text style={styles.unavailableTitle}>Xe Không Có Sẵn</Text>
              <Text style={styles.unavailableMessage}>
                Chi nhánh này hiện đã hết xe này. Vui lòng chọn chi nhánh khác.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      <BookingButtonWithPrice
        pricePerDay={data.pricePerDay}
        dateRange={dateRange}
        onPress={handleBooking}
        disabled={isBookingDisabled}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 100,
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
    backgroundColor: "#B8A4FF",
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
  unavailableWarning: {
    flexDirection: "row",
    backgroundColor: "#2a1a1a",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#4a2a2a",
    alignItems: "flex-start",
  },
  unavailableTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  unavailableTitle: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  unavailableMessage: {
    color: "#ff9999",
    fontSize: 14,
    lineHeight: 20,
  },
  requirementWarning: {
    backgroundColor: "#1a1a2a",
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3a3a4a",
  },
  requirementWarningComplete: {
    backgroundColor: "#1a2a1a",
    borderColor: "#2a4a2a",
  },
  requirementWarningHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  requirementWarningTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  requirementWarningTitle: {
    color: "#B8A4FF",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  requirementWarningTitleComplete: {
    color: "#10b981",
  },
  requirementWarningMessage: {
    color: "#c4b5fd",
    fontSize: 14,
    lineHeight: 20,
  },
  missingList: {
    gap: 12,
    marginBottom: 16,
  },
  missingItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  completeText: {
    color: "#10b981",
    fontSize: 15,
    fontWeight: "500",
  },
  missingText: {
    color: "#ff9999",
    fontSize: 15,
    fontWeight: "500",
  },
  actionButton: {
    backgroundColor: "#B8A4FF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonComplete: {
    backgroundColor: "#10b981",
  },
  actionButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
});