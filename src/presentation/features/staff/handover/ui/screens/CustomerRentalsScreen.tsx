import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import sl from "../../../../../../core/di/InjectionContainer";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetBookingListUseCase } from "../../../../../../domain/usecases/booking/GetBookingListUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";

type CustomerRentalsScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "CustomerRentals"
>;

export const CustomerRentalsScreen: React.FC = () => {
  const navigation = useNavigation<CustomerRentalsScreenNavigationProp>();
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const getBookingListUseCase = new GetBookingListUseCase(
        sl.get("BookingRepository")
      );
      const response = await getBookingListUseCase.execute(
        "",
        "019a15be-38b0-7746-b665-f07bca082855",
        "Booked",
        pageNum,
        pageSize
      );

      // const bookingsData = unwrapResponse(response);
      setBookings(response.items);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const calculateRentalDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days rental`;
  };

  const handleSelectVehicle = (booking: Booking) => {
    console.log("Select booking:", booking.id);
    navigation.navigate("SelectVehicle", { bookingId: booking.id });
  };

  const handleViewDetails = (booking: Booking) => {
    console.log("View details:", booking.id);
    navigation.navigate("BookingDetails", { bookingId: booking.id });
  };

  const renderBookingCard = (booking: Booking) => {
    const hasVehicle = booking.vehicle && booking.vehicle.id;

    return (
      <View
        key={booking.id}
        style={[styles.rentalCard, !hasVehicle && styles.pendingCard]}
      >
        {/* Status Badge */}
        {!hasVehicle && (
          <View style={styles.statusBadge}>
            <AntDesign name="clock-circle" size={12} color="#FFC107" />
            <Text style={styles.statusText}>Awaiting Vehicle Selection</Text>
          </View>
        )}

        {/* Time and Date Section */}
        <View style={styles.timeSection}>
          <AntDesign
            name="clock-circle"
            size={16}
            color={colors.text.primary}
          />
          <Text style={styles.timeText}>
            {formatTime(booking.startDatetime?.toString() || "")} -{" "}
            {formatTime(booking.endDatetime?.toString() || "")}
          </Text>
          <View style={styles.dateInfo}>
            <Text style={styles.dateText}>
              From: {booking.startDatetime?.toLocaleDateString("en-GB")}
            </Text>
            <Text style={styles.dateText}>
              To: {booking.endDatetime?.toLocaleDateString("en-GB")}
            </Text>
          </View>
        </View>

        {/* Customer Info */}
        <View style={styles.customerSection}>
          <AntDesign name="user" size={16} color={colors.text.primary} />
          <Text style={styles.customerName}>
            {booking.renter?.account?.fullname || "Unknown Customer"}
          </Text>
          <Text style={styles.bookingId}>#{booking.id.slice(0, 12)}</Text>
        </View>

        {/* Vehicle Section */}
        <View style={styles.vehicleSection}>
          {hasVehicle ? (
            <>
              <Image
                source={{ uri: booking.vehicle?.fileUrl?.[0] }}
                style={styles.vehicleImage}
              />
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>
                  {booking.vehicle?.vehicleModel?.modelName ||
                    "Unknown Vehicle"}
                </Text>
                <Text style={styles.rentalDuration}>
                  {calculateRentalDuration(
                    booking.startDatetime?.toString() || "",
                    booking.endDatetime?.toString() || ""
                  )}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.noVehicleContainer}>
              <View style={styles.noVehicleIcon}>
                <AntDesign name="car" size={24} color={colors.text.secondary} />
              </View>
              <View style={styles.noVehicleInfo}>
                <Text style={styles.noVehicleTitle}>No Vehicle Assigned</Text>
                <Text style={styles.noVehicleSubtitle}>
                  Staff needs to select a vehicle for this booking
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Vehicle Specifications - Only show if vehicle exists */}
        {hasVehicle && (
          <View style={styles.specsSection}>
            <View style={styles.specsHeader}>
              <Text style={styles.specsTitle}>Vehicle Specifications</Text>
              <Text style={styles.branchText}>
                {booking.vehicle?.branch?.branchName || "Unknown Branch"}
              </Text>
            </View>
            <View style={styles.specsGrid}>
              <View style={styles.specCard}>
                <AntDesign name="thunderbolt" size={16} color="#4CAF50" />
                <Text style={styles.specText}>
                  {booking.vehicle?.batteryHealthPercentage} %
                </Text>
              </View>
              <View style={styles.specCard}>
                <AntDesign name="dashboard" size={16} color="#2196F3" />
                <Text style={styles.specText}>
                  {booking.vehicle?.currentOdometerKm} km
                </Text>
              </View>
              <View style={styles.specCard}>
                <FontAwesome name="battery-4" size={16} color="#FF9800" />
                <Text style={styles.specText}>
                  {booking.vehicle?.vehicleModel?.batteryCapacityKwh} kWh
                </Text>
              </View>
              <View style={styles.specCard}>
                <AntDesign name="rocket" size={16} color="#E91E63" />
                <Text style={styles.specText}>
                  {booking.vehicle?.vehicleModel?.maxSpeedKmh} km/h
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[
              styles.selectButton,
              !hasVehicle && styles.selectButtonPending,
            ]}
            onPress={() => handleSelectVehicle(booking)}
          >
            <Text
              style={[
                styles.buttonText,
                !hasVehicle && styles.buttonTextPending,
              ]}
            >
              {hasVehicle ? "Change Vehicle" : "Select Vehicle"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewButton}
            onPress={() => handleViewDetails(booking)}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.scrollContent}>
        <ScreenHeader
          title="Customer Rentals"
          subtitle={
            bookings?.[0]?.renter?.account?.fullname
              ? `${bookings?.[0]?.renter?.account?.fullname} Bookings`
              : "Customer Bookings"
          }
          submeta={
            bookings?.[0]
              ? bookings?.[0]?.startDatetime?.toLocaleDateString("en-GB") || ""
              : "Loading..."
          }
          onBack={() => navigation.goBack()}
        />

        <ScrollView
          refreshControl={
            <RefreshControl colors={["white"]} refreshing={loading} onRefresh={fetchBookings} />
          }
        >
          <View style={styles.header}>
            <View style={styles.branchRow}>
              <Text style={styles.branchText}>
                {bookings?.[0]?.vehicle?.branch?.branchName ||
                  "Loading Branch..."}
              </Text>
              <AntDesign name="down" size={12} color={colors.text.primary} />
            </View>
          </View>

          {/* Rental List Section */}
          <View style={styles.rentalSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                List Rental of{" "}
                {bookings?.[0]?.renter?.account?.fullname ?? "Customer"}
              </Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{bookings?.length ?? 0}</Text>
              </View>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading bookings...</Text>
              </View>
            ) : bookings && bookings.length > 0 ? (
              bookings.map(renderBookingCard)
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No bookings found</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
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
  loadingContainer: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  // Pending vehicle styles
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
    backgroundColor: "#2A2A2A",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  statusText: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 6,
  },
  noVehicleContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    borderStyle: "dashed",
  },
  noVehicleIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#333333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  noVehicleInfo: {
    flex: 1,
  },
  noVehicleTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  noVehicleSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  selectButtonPending: {
    backgroundColor: "#FFC107",
  },
  buttonTextPending: {
    color: "#000000",
    fontWeight: "700",
  },
});
