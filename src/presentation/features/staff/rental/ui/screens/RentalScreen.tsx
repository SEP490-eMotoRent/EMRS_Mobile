import React, { useState } from "react";
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
import { AppHeader } from "../../../../../common/components/organisms/AppHeader";
import { InfoCard } from "../../../../../common/components/molecules/InfoCard";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";

type RentalScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "Rental"
>;

interface RentedVehicle {
  id: string;
  customerName: string;
  customerAvatar: any;
  branch: string;
  vehicleName: string;
  licensePlate: string;
  startTime: string;
  expectedReturn: string;
  status: "upcoming" | "normal" | "overdue";
  vehicleImage: any;
}

export const RentalScreen: React.FC = () => {
  const navigation = useNavigation<RentalScreenNavigationProp>();
  const [activeTab, setActiveTab] = useState<"handover" | "rented">("handover");
  const [searchPlate, setSearchPlate] = useState("");

  // Mock data for handover schedule
  const handoverSchedule = [
    {
      id: "1",
      time: "10:30 AM - 11:00 AM",
      timeSubtext: "In 2 hours",
      customerName: "John Nguyen",
      bookingId: "#EMR240915001",
      vehicleName: "VinFast Evo200",
      rentalDuration: "7 days rental",
      branch: "District 2 Branch",
      arrivalStatus: "Arrives in 15 min",
    },
    {
      id: "2",
      time: "2:00 PM - 2:30 PM",
      timeSubtext: "In 4 hours",
      customerName: "Doraemon Nguyen",
      bookingId: "#EMR240915002",
      vehicleName: "Klara S",
      rentalDuration: "3 days rental",
      branch: "District 2 Branch",
      arrivalStatus: "Scheduled",
    },
  ];

  // Mock data for rented vehicles
  const rentedVehicles: RentedVehicle[] = [
    {
      id: "1",
      customerName: "John Nguyen",
      customerAvatar: require("../../../../../../../assets/images/avatar.png"),
      branch: "District 2 Branch",
      vehicleName: "VinFast Evo200",
      licensePlate: "59X1-12345",
      startTime: "Sep 18, 9:00 AM",
      expectedReturn: "11:00 AM (1h 30m)",
      status: "upcoming",
      vehicleImage: require("../../../../../../../assets/images/motor-big.png"),
    },
    {
      id: "2",
      customerName: "Sarah Chen",
      customerAvatar: require("../../../../../../../assets/images/avatar.png"),
      branch: "District 1 Branch",
      vehicleName: "VinFast Evo200",
      licensePlate: "59X1-67890",
      startTime: "Sep 18, 8:00 AM",
      expectedReturn: "2:00 PM",
      status: "normal",
      vehicleImage: require("../../../../../../../assets/images/motor-big.png"),
    },
    {
      id: "3",
      customerName: "Michael Tran",
      customerAvatar: require("../../../../../../../assets/images/avatar.png"),
      branch: "District 3 Branch",
      vehicleName: "VinFast Evo200",
      licensePlate: "59X1-11111",
      startTime: "Sep 18, 7:00 AM",
      expectedReturn: "10:30 AM (Overdue 30m)",
      status: "overdue",
      vehicleImage: require("../../../../../../../assets/images/motor-big.png"),
    },
  ];

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
        <InfoCard>
          <View style={styles.authContent}>
            <View style={styles.authLeft}>
              <View style={styles.smileyIcon}>
                <Text style={styles.smileyText}>😊</Text>
              </View>
            </View>
            <View style={styles.authRight}>
              <TouchableOpacity style={styles.scanButton}>
                <AntDesign name="camera" size={16} color="#000" />
                <Text style={styles.scanButtonText}>Scan Renter Face</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.authTitle}>Xác thực khách hàng</Text>
          <Text style={styles.authDescription}>
            Sử dụng camera để xác thực khuôn mặt khách hàng để tìm kiếm bookings
            của họ
          </Text>
        </InfoCard>
      </View>

      {/* Today's Vehicle Delivery Schedule */}
      <View style={styles.scheduleSection}>
        <View style={styles.scheduleHeader}>
          <Text style={styles.scheduleTitle}>Lịch giao xe hôm nay</Text>
          <View style={styles.scheduleBadge}>
            <Text style={styles.scheduleBadgeText}>
              {handoverSchedule.length}
            </Text>
          </View>
        </View>

        {handoverSchedule.map((item) => (
          <View key={item.id} style={styles.handoverCard}>
            <View style={styles.handoverHeader}>
              <View style={styles.timeSection}>
                <AntDesign
                  name="clock-circle"
                  size={16}
                  color={colors.text.primary}
                />
                <Text style={styles.timeText}>{item.time}</Text>
                <Text style={styles.timeSubtext}>{item.timeSubtext}</Text>
              </View>
              <TouchableOpacity style={styles.arrivalButton}>
                <Text style={styles.arrivalButtonText}>
                  {item.arrivalStatus}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>{item.customerName}</Text>
                <AntDesign name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.bookingId}>{item.bookingId}</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <Image
                source={require("../../../../../../../assets/images/motor.png")}
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{item.vehicleName}</Text>
                <Text style={styles.rentalDuration}>{item.rentalDuration}</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.specsSection}>
              <Text style={styles.specsTitle}>Vehicle Specifications</Text>
              <Text style={styles.branchText}>{item.branch}</Text>

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

            <PrimaryButton
              title="View Details Booking"
              onPress={() => navigation.navigate("BookingDetails")}
              style={styles.viewDetailsButton}
            />
          </View>
        ))}
      </View>
    </View>
  );

  const renderRentedTab = () => (
    <View style={styles.tabContent}>
      {/* Search Section */}
      <View style={styles.searchSection}>
        <Text style={styles.searchTitle}>Nhập Biển số xe</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Biển số xe (e.g., 73-MD6999.99)"
            placeholderTextColor={colors.text.secondary}
            value={searchPlate}
            onChangeText={setSearchPlate}
          />
          <TouchableOpacity style={styles.searchButton}>
            <FontAwesome name="search" size={20} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Rented Vehicles List */}
      <View style={styles.rentedSection}>
        <View style={styles.rentedHeader}>
          <Text style={styles.rentedTitle}>Danh sách Xe đang cho thuê</Text>
          <View style={styles.rentedBadge}>
            <Text style={styles.rentedBadgeText}>{rentedVehicles.length}</Text>
          </View>
        </View>

        {rentedVehicles.map((vehicle) => (
          <View key={vehicle.id} style={styles.rentedCard}>
            <View style={styles.rentedCardHeader}>
              <View style={styles.customerInfo}>
                <Image
                  source={vehicle.customerAvatar}
                  style={styles.customerAvatar}
                />
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>
                    {vehicle.customerName}
                  </Text>
                  <Text style={styles.customerBranch}>{vehicle.branch}</Text>
                </View>
                <Image
                  source={vehicle.vehicleImage}
                  style={styles.vehicleThumbnail}
                />
              </View>
            </View>

            <View style={styles.vehicleDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Vehicle</Text>
                <Text style={styles.detailValue}>{vehicle.vehicleName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>License Plate</Text>
                <Text style={styles.detailValue}>{vehicle.licensePlate}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Start Time</Text>
                <Text style={styles.detailValue}>{vehicle.startTime}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Expected Return</Text>
                <Text
                  style={[
                    styles.detailValue,
                    { color: getStatusColor(vehicle.status) },
                  ]}
                >
                  {vehicle.expectedReturn}
                </Text>
              </View>
            </View>

            <TouchableOpacity style={styles.startReturnButton}>
              <Text style={styles.startReturnText}>Start Return</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Rental" subtitle="District 2 Branch" showBackButton={false} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Header */}

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "handover" && styles.activeTab]}
            onPress={() => setActiveTab("handover")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "handover" && styles.activeTabText,
              ]}
            >
              Lịch giao xe
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "rented" && styles.activeTab]}
            onPress={() => setActiveTab("rented")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rented" && styles.activeTabText,
              ]}
            >
              Xe đang cho thuê
            </Text>
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
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: "#C9B6FF",
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  tabContent: {
    flex: 1,
  },
  authSection: {
    marginBottom: 24,
  },
  authContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  authLeft: {
    flex: 1,
  },
  smileyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  smileyText: {
    fontSize: 32,
  },
  authRight: {
    flex: 1,
    alignItems: "flex-end",
  },
  scanButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#C9B6FF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 8,
  },
  authTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  authDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
  scheduleSection: {
    marginBottom: 24,
  },
  scheduleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  scheduleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginRight: 8,
  },
  scheduleBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  handoverCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  },
  timeText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  timeSubtext: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 8,
  },
  arrivalButton: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  arrivalButtonText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "600",
  },
  customerSection: {
    marginBottom: 12,
  },
  customerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  customerName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
    marginBottom: 4,
  },
  bookingId: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 8,
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
  separator: {
    height: 1,
    backgroundColor: "#444444",
    marginVertical: 16,
  },
  specsSection: {
    marginBottom: 16,
  },
  specsTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  branchText: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
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
  viewDetailsButton: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 4,
  },
  searchSection: {
    marginBottom: 24,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 12,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 20,
    padding: 8,
    marginLeft: 8,
  },
  rentedSection: {
    marginBottom: 24,
  },
  rentedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  rentedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginRight: 8,
  },
  rentedBadge: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  rentedBadgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  rentedCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  startReturnButton: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  startReturnText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "600",
  },
});
