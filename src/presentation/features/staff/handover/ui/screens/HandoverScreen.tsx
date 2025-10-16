import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { AppHeader } from '../../../../../common/components/organisms/AppHeader';
import { SectionHeader } from '../molecules/SectionHeader';
import { InfoCard } from '../../../../../common/components/molecules/InfoCard';
import { PrimaryButton } from '../../../../../common/components/atoms/PrimaryButton';

const vehicleImg = require("../../../../../../../assets/images/motor.png");

type HandoverScreenNavigationProp = StackNavigationProp<StaffStackParamList, 'Handover'>;

export const HandoverScreen: React.FC = () => {
  const navigation = useNavigation<HandoverScreenNavigationProp>();

  const handleStartHandover = () => {
    console.log("Start handover process");
  };

  const handleViewDetails = () => {
    navigation.navigate('BookingDetails');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Header */}
        <AppHeader />

        {/* Today's Handovers Section */}
        <View style={styles.handoversHeader}>
          <View style={styles.handoversTitleRow}>
            <Text style={styles.handoversTitle}>Today's Handovers</Text>
            <Text style={styles.handoversDate}>Sep 15, 2025</Text>
            <TouchableOpacity style={styles.notificationButton}>
              <AntDesign name="bell" size={20} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.staffBadge}>
              <Text style={styles.staffText}>ST</Text>
            </View>
          </View>
          <View style={styles.branchRow}>
            <Text style={styles.branchText}>District 2 Branch</Text>
            <AntDesign name="down" size={12} color={colors.text.primary} />
          </View>
        </View>

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
                  <AntDesign name="camera" size={16} color="#FFFFFF" />
                  <Text style={styles.scanButtonText}>Scan Renter Face</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.authTitle}>Xác thực khách hàng</Text>
            <Text style={styles.authDescription}>
              Sử dụng camera để xác thực khuôn mặt khách hàng để tìm kiếm
              bookings của họ
            </Text>
          </InfoCard>
        </View>

        {/* Today's Vehicle Delivery Schedule */}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Lịch giao xe hôm nay</Text>
            <View style={styles.scheduleBadge}>
              <Text style={styles.scheduleBadgeText}>2</Text>
            </View>
          </View>

          {/* Handover Item 1 */}
          <View style={styles.handoverCard}>
            <View style={styles.handoverHeader}>
              <View style={styles.timeSection}>
                <AntDesign
                  name="clock-circle"
                  size={16}
                  color={colors.text.primary}
                />
                <Text style={styles.timeText}>10:30 AM - 11:00 AM</Text>
                <Text style={styles.timeSubtext}>In 2 hours</Text>
              </View>
              <TouchableOpacity style={styles.arrivalButton}>
                <Text style={styles.arrivalButtonText}>Arrives in 15 min</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>John Nguyen</Text>
                <AntDesign name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.bookingId}>#EMR240915001</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <Image source={vehicleImg} style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>VinFast Evo200</Text>
                <Text style={styles.rentalDuration}>7 days rental</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.specsSection}>
              <Text style={styles.specsTitle}>Vehicle Specifications</Text>
              <Text style={styles.branchText}>District 2 Branch</Text>

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

            {/* Bottom Action Button */}
            <PrimaryButton title="View Details Booking" onPress={handleViewDetails} style={styles.viewDetailsButton} />
          </View>

          {/* Handover Item 2 */}
          <View style={styles.handoverCard}>
            <View style={styles.handoverHeader}>
              <View style={styles.timeSection}>
                <AntDesign
                  name="clock-circle"
                  size={16}
                  color={colors.text.primary}
                />
                <Text style={styles.timeText}>10:30 AM - 11:00 AM</Text>
                <Text style={styles.timeSubtext}>In 2 hours</Text>
              </View>
              <TouchableOpacity style={styles.arrivalButton}>
                <Text style={styles.arrivalButtonText}>Arrives in 15 min</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.customerSection}>
              <View style={styles.customerInfo}>
                <AntDesign name="user" size={16} color={colors.text.primary} />
                <Text style={styles.customerName}>Doraemon Nguyen</Text>
                <AntDesign name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.bookingId}>#EMR240915002</Text>
              </View>
            </View>

            <View style={styles.vehicleSection}>
              <Image source={vehicleImg} style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>Klara S</Text>
                <Text style={styles.rentalDuration}>7 days rental</Text>
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.specsSection}>
              <Text style={styles.specsTitle}>Vehicle Specifications</Text>
              <Text style={styles.branchText}>District 2 Branch</Text>

              <View style={styles.specsGrid}>
                <View style={styles.specCard}>
                  <FontAwesome
                    name="battery-4"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Battery Capacity 6.79 kWh</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="clock-circle"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Max Range 200 km</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="dashboard"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Top Speed 120 km/h</Text>
                </View>
                <View style={styles.specCard}>
                  <FontAwesome5
                    name="weight-hanging"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>Weight 128 kg</Text>
                </View>
              </View>
            </View>

            {/* Bottom Action Button */}
            <PrimaryButton title="View Details Booking" onPress={handleViewDetails} style={styles.viewDetailsButton} />
          </View>
        </View>
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
    paddingBottom: 100, // Space for bottom navigation
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  menuButton: {
    padding: 8,
  },
  handoversHeader: {
    backgroundColor: "#1A1A1A",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  handoversTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  handoversTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  handoversDate: {
    fontSize: 14,
    color: colors.text.secondary,
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
    color: "#FFFFFF",
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
  },
  authSection: {
    marginBottom: 24,
  },
  authCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 20,
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
    color: "#FFFFFF",
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
    marginLeft: 8,
    marginRight: 8,
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
  viewDetailsButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});
