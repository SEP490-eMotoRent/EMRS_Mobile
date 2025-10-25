import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
const motorImage = require("../../../../../../../assets/images/motor.png");

type CustomerRentalsScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "CustomerRentals"
>;

export const CustomerRentalsScreen: React.FC = () => {
  const navigation = useNavigation<CustomerRentalsScreenNavigationProp>();

  const handleSelectVehicle = () => {
    console.log("Select booking");
    navigation.navigate("SelectVehicle");
  };

  const handleViewDetails = () => {
    console.log("View details");
    navigation.navigate("BookingDetails");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Customer Rentals"
          subtitle="John Nguyễn Bookings"
          submeta="Sep 15, 2025"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.header}>
          <View style={styles.branchRow}>
            <Text style={styles.branchText}>District 2 Branch</Text>
            <AntDesign name="down" size={12} color={colors.text.primary} />
          </View>
        </View>

        {/* Rental List Section */}
        <View style={styles.rentalSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>List Rental of John Nguyễn</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>2</Text>
            </View>
          </View>

          {/* Rental Card 1 */}
          <View style={styles.rentalCard}>
            {/* Time and Date Section */}
            <View style={styles.timeSection}>
              <AntDesign
                name="clock-circle"
                size={16}
                color={colors.text.primary}
              />
              <Text style={styles.timeText}>10:30 AM - 11:00 AM</Text>
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>From: Sep 15, 2025</Text>
                <Text style={styles.dateText}>To: Sep 18, 2025</Text>
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.customerSection}>
              <AntDesign name="user" size={16} color={colors.text.primary} />
              <Text style={styles.customerName}>John Nguyen</Text>
              <Text style={styles.bookingId}>#EMR240915001</Text>
            </View>

            {/* Vehicle Section */}
            <View style={styles.vehicleSection}>
              <Image source={motorImage} style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>VinFast Evo200</Text>
                <Text style={styles.rentalDuration}>7 days rental</Text>
              </View>
            </View>

            {/* Vehicle Specifications */}
            <View style={styles.specsSection}>
              <View style={styles.specsHeader}>
                <Text style={styles.specsTitle}>Vehicle Specifications</Text>
                <Text style={styles.branchText}>District 2 Branch</Text>
              </View>
              <View style={styles.specsGrid}>
                <View style={styles.specCard}>
                  <FontAwesome
                    name="battery-4"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>3.24 kWh</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="clock-circle"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>180 km</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="dashboard"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>99 km/h</Text>
                </View>
                <View style={styles.specCard}>
                  <FontAwesome5
                    name="weight-hanging"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>118 kg</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectVehicle}
              >
                <Text style={styles.buttonText}>Select Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Rental Card 2 */}
          <View style={styles.rentalCard}>
            {/* Time and Date Section */}
            <View style={styles.timeSection}>
              <AntDesign
                name="clock-circle"
                size={16}
                color={colors.text.primary}
              />
              <Text style={styles.timeText}>11:30 PM - 17:00 PM</Text>
              <View style={styles.dateInfo}>
                <Text style={styles.dateText}>From: Sep 15, 2025</Text>
                <Text style={styles.dateText}>To: Sep 18, 2025</Text>
              </View>
            </View>

            {/* Customer Info */}
            <View style={styles.customerSection}>
              <AntDesign name="user" size={16} color={colors.text.primary} />
              <Text style={styles.customerName}>John Nguyen</Text>
              <Text style={styles.bookingId}>#EMR240915001</Text>
            </View>

            {/* Vehicle Section */}
            <View style={styles.vehicleSection}>
              <Image source={motorImage} style={styles.vehicleImage} />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>VinFast Evo200</Text>
                <Text style={styles.rentalDuration}>7 days rental</Text>
              </View>
            </View>

            {/* Vehicle Specifications */}
            <View style={styles.specsSection}>
              <View style={styles.specsHeader}>
                <Text style={styles.specsTitle}>Vehicle Specifications</Text>
                <Text style={styles.branchText}>District 2 Branch</Text>
              </View>
              <View style={styles.specsGrid}>
                <View style={styles.specCard}>
                  <FontAwesome
                    name="battery-4"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>3.24 kWh</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="clock-circle"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>180 km</Text>
                </View>
                <View style={styles.specCard}>
                  <AntDesign
                    name="dashboard"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>99 km/h</Text>
                </View>
                <View style={styles.specCard}>
                  <FontAwesome5
                    name="weight-hanging"
                    size={16}
                    color={colors.text.primary}
                  />
                  <Text style={styles.specText}>118 kg</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={handleSelectVehicle}
              >
                <Text style={styles.buttonText}>Select Vehicle</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={handleViewDetails}
              >
                <Text style={styles.buttonText}>View Details</Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom: 40,
  },
  header: {
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
  },
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
});
