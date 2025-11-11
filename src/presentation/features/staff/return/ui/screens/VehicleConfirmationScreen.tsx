import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";

const vehicleImage = require("../../../../../../../assets/images/technician.png");

type VehicleConfirmationScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "VehicleConfirmation"
>;

type VehicleConfirmationScreenRouteProp = RouteProp<
  StaffStackParamList,
  "VehicleConfirmation"
>;

export const VehicleConfirmationScreen: React.FC = () => {
  const navigation = useNavigation<VehicleConfirmationScreenNavigationProp>();
  const route = useRoute<VehicleConfirmationScreenRouteProp>();
  const { bookingId, vehicleId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const getBookingByIdUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const booking = await getBookingByIdUseCase.execute(bookingId);
      setBooking(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#a78bfa" />
      </View>
    );
  }

  const handleStartReturnInspection = () => {
    navigation.navigate("ReturnInspection", {
      bookingId,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Vehicle Confirmation"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        {/* Customer Verification */}
        <View style={styles.verificationCard}>
          <View style={styles.verificationHeader}>
            <View style={styles.verificationIconContainer}>
              <AntDesign name="check" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.verificationContent}>
              <Text style={styles.verificationText}>Customer Verified</Text>
              <Text style={styles.verificationName}>
                {booking?.renter.account?.fullname}
              </Text>
            </View>
          </View>
          <View style={styles.verificationFooter}>
            <AntDesign
              name="clock-circle"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.verificationTime}>Verified at 11:00 AM</Text>
          </View>
        </View>

        {/* Vehicle Image with Active Rental Tag */}
        <View style={styles.vehicleImageContainer}>
          <Image source={vehicleImage} style={styles.vehicleImage} />
          <View style={styles.imageOverlay}>
            <View style={styles.vehicleInfoOverlay}>
              <Text style={styles.vehicleModel}>
                {booking?.vehicleModel.modelName}
              </Text>
              <Text style={styles.vehiclePlate}>
                {booking?.vehicle.licensePlate}
              </Text>
            </View>
          </View>
          <View style={styles.activeRentalTag}>
            <View style={styles.tagIcon}>
              <AntDesign name="car" size={12} color="#FFFFFF" />
            </View>
            <Text style={styles.activeRentalText}>Active Rental</Text>
          </View>
        </View>

        {/* Vehicle and Rental Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailsColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Mẫu xe</Text>
              <Text style={styles.detailValue}>
                {booking?.vehicleModel.modelName}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Biển số xe</Text>
              <Text style={styles.detailValueLarge}>
                {booking?.vehicle.licensePlate}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Màu sắc</Text>
              <Text style={styles.detailValue}>{booking?.vehicle.color}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Năm sản xuất</Text>
              <Text style={styles.detailValue}>
                {booking?.vehicle.yearOfManufacture?.getFullYear() || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.detailsColumn}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Chi nhánh nhận xe</Text>
              <Text style={styles.detailValue}>District 2 Branch</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Thời gian nhận xe</Text>
              <Text style={styles.detailValue}>
                {booking?.startDatetime?.toLocaleDateString()}{" "}
                {booking?.startDatetime?.toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Thời gian trả xe</Text>
              <Text style={styles.detailValue}>
                {booking?.endDatetime?.toLocaleDateString()}{" "}
                {booking?.endDatetime?.toLocaleTimeString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Status</Text>
              <View style={styles.statusTag}>
                <Text style={styles.statusText}>On-time</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Information */}
        <View style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingTitle}>Thông tin đặt xe</Text>
            <AntDesign name="up" size={16} color={colors.text.secondary} />
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingLabel}>Mã đặt xe</Text>
            <Text style={styles.bookingValue}>#{booking?.id.slice(-10)}</Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingLabel}>Bảo hiểm</Text>
            <Text style={styles.bookingValue}>Premium Package</Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingLabel}>Tiền cọc</Text>
            <Text style={styles.bookingValue}>5,000,000 VND</Text>
          </View>
        </View>

        {/* Start Return Inspection Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.startReturnButton}
            onPress={handleStartReturnInspection}
          >
            <View style={styles.buttonContent}>
              <View style={styles.buttonIconContainer}>
                <AntDesign name="camera" size={20} color="#000000" />
              </View>
              <View style={styles.buttonTextContainer}>
                <Text style={styles.startReturnText}>
                  Start Return Inspection
                </Text>
                <Text style={styles.buttonSubtext}>
                  Begin 4-angle photo capture
                </Text>
              </View>
              <AntDesign name="right" size={16} color="#000000" />
            </View>
          </TouchableOpacity>
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
  verificationCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 24,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
  },
  verificationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  verificationIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
    shadowColor: "#4CAF50",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  verificationContent: {
    flex: 1,
  },
  verificationText: {
    color: "#4CAF50",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  verificationName: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "bold",
  },
  verificationFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#444444",
  },
  verificationTime: {
    color: colors.text.secondary,
    fontSize: 14,
    marginLeft: 8,
  },
  vehicleImageContainer: {
    position: "relative",
    marginHorizontal: 16,
    marginBottom: 28,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  vehicleImage: {
    width: "100%",
    height: 240,
    backgroundColor: "#444444",
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 16,
  },
  vehicleInfoOverlay: {
    alignItems: "flex-start",
  },
  vehicleModel: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  vehiclePlate: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.9,
  },
  activeRentalTag: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#FF6B35",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#FF6B35",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  tagIcon: {
    marginRight: 6,
  },
  activeRentalText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  detailsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 20,
  },
  detailsColumn: {
    flex: 1,
    marginRight: 16,
  },
  detailItem: {
    marginBottom: 16,
  },
  detailLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  detailValueLarge: {
    color: colors.text.primaryLight,
    fontSize: 20,
    fontWeight: "bold",
  },
  statusTag: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  summarySection: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "500",
  },
  summaryValue: {
    color: colors.text.secondary,
    fontSize: 16,
    fontWeight: "500",
  },
  bookingCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  bookingTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "bold",
  },
  bookingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  bookingLabel: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  bookingValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  buttonContainer: {
    marginHorizontal: 16,
    marginTop: 8,
  },
  startReturnButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  buttonTextContainer: {
    flex: 1,
  },
  startReturnText: {
    color: colors.text.dark,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  buttonSubtext: {
    color: "rgba(0, 0, 0, 0.7)",
    fontSize: 14,
  },
});
