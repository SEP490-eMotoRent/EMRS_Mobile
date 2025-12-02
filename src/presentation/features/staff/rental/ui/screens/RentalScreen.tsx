import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  TextInput,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { InfoCard } from "../../../../../common/components/molecules/InfoCard";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { GetBookingListUseCase } from "../../../../../../domain/usecases/booking/GetBookingListUseCase";
import sl from "../../../../../../core/di/InjectionContainer";

type RentalScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "Rental"
>;

export const RentalScreen: React.FC = () => {
  const navigation = useNavigation<RentalScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<"handover" | "rented">("handover");
  const [searchPlate, setSearchPlate] = useState("");
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [rentedBookings, setRentedBookings] = useState<Booking[] | null>(null);
  const [handoverSchedule, setHandoverSchedule] = useState<Booking[] | null>(null);

  useEffect(() => {
    fetchBookings(1);
  }, []);

  const fetchHandoverSchedule = async (page: number = pageNum) => {
    setLoading(true);
    try {
      const getBookingListUseCase = new GetBookingListUseCase(
        sl.get("BookingRepository")
      );
      const today = new Date().toISOString().split("T")[0]; 
      const response = await getBookingListUseCase.execute(
        "",
        "",
        "Booking",
        today,
        page,
        pageSize
      );
      setHandoverSchedule(response.items);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async (page: number = pageNum) => {
    setLoading(true);
    try {
      const getBookingListUseCase = new GetBookingListUseCase(
        sl.get("BookingRepository")
      );
      const response = await getBookingListUseCase.execute(
        "",
        "",
        "Renting",
        undefined,
        page,
        pageSize
      );

      // const bookingsData = unwrapResponse(response);
      setRentedBookings(response.items);
      setPageNum(page);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "#FFB300";
      case "overdue":
        return "#FF6B6B";
      default:
        return colors.text.primary;
    }
  };

  const renderHandoverTab = () => (
    <View style={styles.tabContent}>
      {/* Customer Authentication Section */}
      <View style={styles.authSection}>
        <View style={styles.authCard}>
          <View style={styles.authCardHeader}>
            <View style={styles.authCardHeaderLeft}>
              <View style={styles.authIconContainer}>
                <AntDesign name="scan" size={20} color="#7CFFCB" />
              </View>
              <View>
                <Text style={styles.authTitle}>Xác thực khách hàng</Text>
                <Text style={styles.authSubtitle}>Quét khuôn mặt để tìm booking</Text>
              </View>
            </View>
          </View>
          <View style={styles.authCardContent}>
            <View style={styles.authDescriptionContainer}>
              <AntDesign name="info-circle" size={14} color="#C9B6FF" />
              <Text style={styles.authDescription}>
                Sử dụng camera để xác thực khuôn mặt khách hàng và tìm kiếm bookings của họ
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.scanButton}
              onPress={() => navigation.navigate("ScanFace")}
            >
              <View style={styles.scanButtonContent}>
                <AntDesign name="camera" size={18} color="#0B0B0F" />
                <Text style={styles.scanButtonText}>Quét khuôn mặt</Text>
                <AntDesign name="right" size={14} color="#0B0B0F" />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Today's Vehicle Delivery Schedule */}
      <View style={styles.scheduleSection}>
        <View style={styles.scheduleHeader}>
          <View style={styles.scheduleHeaderLeft}>
            <View style={styles.scheduleIconContainer}>
              <AntDesign name="calendar" size={18} color="#FFD666" />
            </View>
            <View>
              <Text style={styles.scheduleTitle}>Lịch giao xe hôm nay</Text>
              <Text style={styles.scheduleSubtitle}>
                {handoverSchedule?.length || 0} booking{handoverSchedule?.length !== 1 ? 's' : ''}
              </Text>
            </View>
          </View>
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleBadgeText}>
              {handoverSchedule?.length || 0}
            </Text>
          </View>
        </View>

        {!handoverSchedule || handoverSchedule.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <AntDesign name="calendar" size={48} color={colors.text.secondary} />
            </View>
            <Text style={styles.emptyStateTitle}>Chưa có lịch giao xe</Text>
            <Text style={styles.emptyStateSubtitle}>
              Hôm nay không có booking nào cần giao xe
            </Text>
          </View>
        ) : (
          handoverSchedule.map((item) => (
          <View key={item.id} style={styles.handoverCard}>
            <View style={styles.handoverHeader}>
              <View style={styles.timeSection}>
                <AntDesign
                  name="clock-circle"
                  size={16}
                  color={colors.text.primary}
                />
                <Text style={styles.timeText}>{item.startDatetime?.toLocaleString("en-GB")}</Text>
                <Text style={styles.timeSubtext}>{item.endDatetime?.toLocaleString("en-GB")}</Text>
              </View>
              <TouchableOpacity style={styles.arrivalButton}>
                <Text style={styles.arrivalButtonText}>
                  {item.bookingStatus}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>{item.renter?.account?.fullname}</Text>
                <AntDesign name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.bookingId}>{item.bookingCode}</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <Image
                source={require("../../../../../../../assets/images/motor.png")}
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{item.vehicle?.vehicleModel?.modelName}</Text>
                <Text style={styles.rentalDuration}>{item.vehicle?.vehicleModel?.rentalPricing?.rentalPrice}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.specsSection}>
              <Text style={styles.specsTitle}>Vehicle Specifications</Text>
              <Text style={styles.branchText}>{item.handoverBranch?.branchName}</Text>

              <View style={styles.specsGrid}>
                <View style={styles.specCard}>
                  <FontAwesome
                    name="battery-4"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Battery Capacity 3.24 kWh</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="clock-circle"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Max Range 180 km</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="dashboard"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Top Speed 99 km/h</Text>
                </View>
                <View style={styles.specCard}>
                  <FontAwesome5
                    name="weight-hanging"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Weight 118 kg</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.viewDetailsButton}
              onPress={() => navigation.navigate("BookingDetails", { bookingId: item.id })}
            >
              <View style={styles.viewDetailsButtonContent}>
                <AntDesign name="file-text" size={16} color="#0B0B0F" />
                <Text style={styles.viewDetailsButtonText}>Xem chi tiết Booking</Text>
                <AntDesign name="right" size={14} color="#0B0B0F" />
              </View>
            </TouchableOpacity>
          </View>
          ))
        )}
      </View>
    </View>
  );

  const renderRentedTab = () => (
    <View style={styles.tabContent}>
      {/* Search Section */}
      <View style={styles.searchSection}>
          <View style={styles.searchHeader}>
            <View style={styles.searchIconContainer}>
              <AntDesign name="search" size={18} color="#7DB3FF" />
            </View>
            <Text style={styles.searchTitle}>Tìm kiếm theo biển số</Text>
          </View>
          <View style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <AntDesign name="idcard" size={16} color={colors.text.secondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Nhập biển số xe (VD: 73-MD6999.99)"
                placeholderTextColor={colors.text.secondary}
                value={searchPlate}
                onChangeText={setSearchPlate}
              />
            </View>
            <TouchableOpacity style={styles.searchButton}>
              <AntDesign name="search" size={18} color="#0B0B0F" />
            </TouchableOpacity>
          </View>
      </View>

      {/* Rented Vehicles List */}
      <View style={styles.rentedSection}>
        <View style={styles.rentedHeader}>
          <View style={styles.rentedHeaderLeft}>
            <View style={styles.rentedIconContainer}>
              <AntDesign name="car" size={18} color="#7CFFCB" />
            </View>
            <View>
              <Text style={styles.rentedTitle}>Xe đang cho thuê</Text>
              <Text style={styles.rentedSubtitle}>
                {rentedBookings?.length || 0} xe đang được thuê
              </Text>
            </View>
          </View>
          <View style={styles.rentedBadge}>
            <Text style={styles.rentedBadgeText}>{rentedBookings?.length || 0}</Text>
          </View>
        </View>

        {!rentedBookings || rentedBookings.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyStateIcon}>
              <AntDesign name="car" size={48} color={colors.text.secondary} />
            </View>
            <Text style={styles.emptyStateTitle}>Chưa có xe đang cho thuê</Text>
            <Text style={styles.emptyStateSubtitle}>
              Hiện tại không có xe nào đang được khách hàng thuê
            </Text>
          </View>
        ) : (
          rentedBookings.map((booking) => (
          <View key={booking.id} style={styles.rentedCard}>
            <View style={styles.rentedCardHeader}>
              <View style={styles.customerInfo}>
                <Image
                  source={
                    booking.renter?.avatarUrl ||
                    require("../../../../../../../assets/images/avatar.png")
                  }
                  style={styles.customerAvatar}
                />
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>
                    {booking.renter?.account?.fullname}
                  </Text>
                  <Text style={styles.customerBranch}>
                    {/* {booking.handoverBranch?.branchName} */}
                    District 2 Branch
                  </Text>
                </View>
                <Image
                  source={{ uri: booking.vehicle?.fileUrl[0] }}
                  style={styles.vehicleThumbnail}
                />
              </View>
            </View>

            <View style={styles.vehicleDetails}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <AntDesign name="car" size={14} color={colors.text.primary} />
                  <Text style={styles.detailLabel}>Xe</Text>
                </View>
                <Text style={styles.detailValue}>
                  {booking.vehicle?.vehicleModel?.modelName}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <AntDesign
                    name="idcard"
                    size={14}
                    color={colors.text.primary}
                  />
                  <Text style={styles.detailLabel}>Biển số xe</Text>
                </View>
                <View style={styles.platePill}>
                  <Text style={styles.platePillText}>
                    {booking.vehicle?.licensePlate}
                  </Text>
                </View>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <AntDesign
                    name="calendar"
                    size={14}
                    color={colors.text.primary}
                  />
                  <Text style={styles.detailLabel}>Thời gian nhận xe</Text>
                </View>
                <Text style={styles.detailValue}>
                  {booking.startDatetime?.toLocaleString("en-GB")}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <AntDesign
                    name="clock-circle"
                    size={14}
                    color={colors.text.primary}
                  />
                  <Text style={styles.detailLabel}>Thời gian trả xe</Text>
                </View>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor:
                        getStatusColor(booking.bookingStatus) + "33",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: getStatusColor(booking.bookingStatus) },
                    ]}
                  >
                    {booking.endDatetime?.toLocaleString("en-GB")}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() =>
                  navigation.navigate("BookingDetails", {
                    bookingId: booking.id,
                  })
                }
              >
                <AntDesign name="file-text" size={16} color="#C9B6FF" />
                <Text style={styles.secondaryButtonText}>Xem chi tiết</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.startReturnButton}
                onPress={() =>
                  navigation.navigate("ScanFace")
                }
              >
                <AntDesign name="login" size={16} color="#000" />
                <Text style={styles.startReturnText}>Bắt đầu trả xe</Text>
              </TouchableOpacity>
            </View>
          </View>
          ))
        )}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Cho thuê xe"
        subtitle="District 2 Branch"
        showBackButton={false}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Header */}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "handover" && styles.activeTab]}
            onPress={() => {
              setActiveTab("handover");
              if (!handoverSchedule) {
                fetchHandoverSchedule(1);
              }
            }}
          >
            <View style={styles.tabButtonContent}>
              <AntDesign 
                name="calendar" 
                size={16} 
                color={activeTab === "handover" ? "#0B0B0F" : colors.text.secondary} 
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "handover" && styles.activeTabText,
                ]}
              >
                Lịch giao xe
              </Text>
              {handoverSchedule && handoverSchedule.length > 0 && (
                <View style={[styles.tabBadge, activeTab === "handover" && styles.tabBadgeActive]}>
                  <Text style={[styles.tabBadgeText, activeTab === "handover" && styles.tabBadgeTextActive]}>
                    {handoverSchedule.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "rented" && styles.activeTab]}
            onPress={() => {
              setActiveTab("rented");
              if (!rentedBookings) {
                fetchBookings(1);
              }
            }}
          >
            <View style={styles.tabButtonContent}>
              <AntDesign 
                name="car" 
                size={16} 
                color={activeTab === "rented" ? "#0B0B0F" : colors.text.secondary} 
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "rented" && styles.activeTabText,
                ]}
              >
                Xe đang cho thuê
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === "handover" ? renderHandoverTab() : renderRentedTab()}
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
    paddingHorizontal: 16,
    paddingBottom: 50,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#11131A",
    borderRadius: 16,
    marginBottom: 20,
    padding: 6,
    borderWidth: 1,
    borderColor: "#1F2430",
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#C9B6FF",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  tabButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#0B0B0F",
    fontWeight: "700",
  },
  tabBadge: {
    backgroundColor: "rgba(0,0,0,0.2)",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeActive: {
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  tabBadgeText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "700",
  },
  tabBadgeTextActive: {
    color: "#0B0B0F",
  },
  tabContent: {
    flex: 1,
  },
  authSection: {
    marginBottom: 24,
  },
  authCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  authCardHeader: {
    marginBottom: 16,
  },
  authCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  authIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  authSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  authCardContent: {
    gap: 16,
  },
  authDescriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: "rgba(201,182,255,0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.2)",
  },
  authDescription: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  scanButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  scanButtonText: {
    color: "#0B0B0F",
    fontSize: 16,
    fontWeight: "700",
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  scheduleHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,211,102,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  scheduleSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  scheduleBadge: {
    backgroundColor: "#FFD666",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleBadgeText: {
    color: "#0B0B0F",
    fontSize: 14,
    fontWeight: "700",
  },
  handoverCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  handoverHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  timeSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232838",
  },
  timeText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  timeSubtext: {
    color: colors.text.secondary,
    fontSize: 11,
  },
  arrivalButton: {
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  arrivalButtonText: {
    color: "#FF6B6B",
    fontSize: 11,
    fontWeight: "700",
  },
  customerSection: {
    marginBottom: 16,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  customerName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  bookingId: {
    color: colors.text.secondary,
    fontSize: 12,
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  vehicleSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#1B1F2A",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232838",
  },
  vehicleImage: {
    width: 60,
    height: 60,
    backgroundColor: "#2F3545",
    borderRadius: 12,
    marginRight: 12,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  rentalDuration: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: "#1F2430",
    marginVertical: 16,
  },
  specsSection: {
    marginBottom: 16,
  },
  specsTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
  },
  branchText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 12,
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  specsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  specCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1F2A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: "48%",
    borderWidth: 1,
    borderColor: "#232838",
    gap: 8,
  },
  specText: {
    color: colors.text.secondary,
    fontSize: 11,
    flex: 1,
    fontWeight: "500",
  },
  viewDetailsButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  viewDetailsButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
  },
  viewDetailsButtonText: {
    color: "#0B0B0F",
    fontSize: 15,
    fontWeight: "700",
  },
  searchSection: {
    marginBottom: 24,
  },
  searchHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  searchIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(125,179,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11131A",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#1F2430",
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  searchButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  rentedSection: {
    marginBottom: 24,
  },
  rentedHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  rentedHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  rentedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  rentedTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  rentedSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  rentedBadge: {
    backgroundColor: "#7CFFCB",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  rentedBadgeText: {
    color: "#0B0B0F",
    fontSize: 14,
    fontWeight: "700",
  },
  rentedCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rentedCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  customerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 30,
    marginRight: 12,
  },
  customerDetails: {
    flex: 1,
  },
  customerBranch: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  vehicleThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#444444",
  },
  vehicleDetails: {
    marginBottom: 16,
  },
  detailLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  detailLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  detailValue: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  platePill: {
    backgroundColor: "#2F2A3A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#3A3450",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  platePillText: { color: "#C9B6FF", fontWeight: "700", fontSize: 12 },
  statusPill: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusPillText: { fontWeight: "700", fontSize: 12 },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  secondaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#26212E",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3450",
    flex: 1,
  },
  secondaryButtonText: {
    color: "#C9B6FF",
    fontWeight: "700",
  },
  startReturnButton: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    flex: 1,
  },
  startReturnText: {
    color: "#0B0B0F",
    fontSize: 14,
    fontWeight: "700",
  },
  emptyState: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2430",
    borderStyle: "dashed",
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B1F2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
