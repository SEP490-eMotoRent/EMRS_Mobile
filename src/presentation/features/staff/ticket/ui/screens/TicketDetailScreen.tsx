import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { RouteProp } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InfoCard } from "../../../../../common/components/molecules/InfoCard";
import { InfoItem } from "../../../../../common/components/molecules/InfoItem";
import { GetTicketDetailUseCase } from "../../../../../../domain/usecases/ticket/GetTicketDetailUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { TicketDetailResponse } from "../../../../../../data/models/ticket/TicketDetailResponse";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { ActivityIndicator } from "react-native";
import { UpdateTicketUseCase } from "../../../../../../domain/usecases/ticket/UpdateTicketUseCase";
import Toast from "react-native-toast-message";

type TicketDetailScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "TicketDetail"
>;

type TicketDetailScreenRouteProp = RouteProp<
  StaffStackParamList,
  "TicketDetail"
>;


export const TicketDetailScreen: React.FC = () => {
  const navigation = useNavigation<TicketDetailScreenNavigationProp>();
  const route = useRoute<TicketDetailScreenRouteProp>();
  const { ticketId } = route.params;
  const [ticket, setTicket] = useState<TicketDetailResponse | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const getTicketDetailUseCase = new GetTicketDetailUseCase(
          sl.get("TicketRepository")
        );
        const ticketData = await getTicketDetailUseCase.execute(ticketId);
        setTicket(ticketData);

        // Fetch booking details if bookingId exists
        if (ticketData.bookingId) {
          try {
            const getBookingByIdUseCase = new GetBookingByIdUseCase(
              sl.get("BookingRepository")
            );
            const bookingData = await getBookingByIdUseCase.execute(
              ticketData.bookingId
            );
            setBooking(bookingData);
          } catch (error) {
            console.error("Error fetching booking:", error);
          }
        }
      } catch (error) {
        console.error("Error fetching ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [ticketId]);

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " VND";

  const generateTicketNumber = (id: string) => {
    return `TKT-${id.slice(-8).toUpperCase()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#FFB300";
      case "InProgress":
        return "#7DB3FF";
      case "Resolved":
        return "#67D16C";
      case "Closed":
        return "#999";
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "InProgress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã giải quyết";
      case "Closed":
        return "Đã đóng";
      default:
        return status || "-";
    }
  };

  const getTicketTypeColor = (ticketType: string) => {
    switch (ticketType) {
      case "WeakBattery":
        return "#FFD666";
      case "BrokenVehicle":
        return "#FF6B6B";
      case "Accident":
        return "#FF8A80";
      case "Theft":
        return "#F97316";
      default:
        return "#C9B6FF";
    }
  };

  const getTicketTypeText = (ticketType: string) => {
    switch (ticketType) {
      case "WeakBattery":
        return "Pin yếu";
      case "BrokenVehicle":
        return "Xe hỏng";
      case "Accident":
        return "Tai nạn";
      case "Theft":
        return "Trộm cắp";
      default:
        return ticketType || "-";
    }
  };

  const handleCallRenter = () => {
    if (booking?.renter?.phone) {
      Linking.openURL(`tel:${booking.renter.phone}`);
    }
  };

  const handleOpenGPS = () => {
    if (booking?.vehicle?.id) {
      navigation.navigate("TrackingGPS", {
        vehicleId: booking.vehicle.id,
        licensePlate: booking.vehicle.licensePlate,
      });
    } else if (booking?.handoverBranch?.latitude && booking?.handoverBranch?.longitude) {
      const url = `https://www.google.com/maps?q=${booking.handoverBranch.latitude},${booking.handoverBranch.longitude}`;
      Linking.openURL(url);
    }
  };

  const handleViewBooking = () => {
    if (ticket?.bookingId) {
      navigation.navigate("BookingDetails", { bookingId: ticket.bookingId });
    }
  };

  const getNextStatus = (currentStatus: string): string | null => {
    switch (currentStatus) {
      case "Pending":
        return "InProgress";
      case "InProgress":
        return "Resolved";
      case "Resolved":
        return "Closed";
      default:
        return null;
    }
  };

  const getNextStatusText = (currentStatus: string): string => {
    switch (currentStatus) {
      case "Pending":
        return "Bắt đầu xử lý";
      case "InProgress":
        return "Đánh dấu đã giải quyết";
      case "Resolved":
        return "Đóng ticket";
      default:
        return "Cập nhật trạng thái";
    }
  };

  const handleUpdateStatus = () => {
    if (!ticket) return;

    const nextStatus = getNextStatus(ticket.status);
    if (!nextStatus) {
      Alert.alert("Thông báo", "Ticket đã ở trạng thái cuối cùng.");
      return;
    }

    Alert.alert(
      "Xác nhận",
      `Hoàn thành việc xử lý ticket?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              setUpdating(true);
              const updateTicketUseCase = new UpdateTicketUseCase(
                sl.get("TicketRepository")
              );
              await updateTicketUseCase.execute({
                id: ticketId,
                status: nextStatus,
                staffId: ticket.staffId,
              });

              // Refresh ticket data
              const getTicketDetailUseCase = new GetTicketDetailUseCase(
                sl.get("TicketRepository")
              );
              const updatedTicket = await getTicketDetailUseCase.execute(ticketId);
              setTicket(updatedTicket);

              Toast.show({
                type: "success",
                text1: "Thành công",
                text2: `Đã hoàn thành việc xử lý ticket`,
              });
            } catch (error: any) {
              console.error("Error updating ticket status:", error);
              Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: error?.message || "Không thể cập nhật trạng thái",
              });
            } finally {
              setUpdating(false);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Chi tiết Ticket"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!ticket) {
    return (
      <SafeAreaView style={styles.container}>
        <ScreenHeader
          title="Chi tiết Ticket"
          onBack={() => navigation.goBack()}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.errorText}>Không tìm thấy ticket</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Chi tiết Ticket"
        subtitle={generateTicketNumber(ticket.id)}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status and Ticket Type */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(ticket.status) + "20" },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: getStatusColor(ticket.status) },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(ticket.status) },
              ]}
            >
              {getStatusText(ticket.status)}
            </Text>
          </View>
          <View
            style={[
              styles.ticketTypeBadge,
              { backgroundColor: getTicketTypeColor(ticket.ticketType) + "20" },
            ]}
          >
            <Text
              style={[
                styles.ticketTypeText,
                { color: getTicketTypeColor(ticket.ticketType) },
              ]}
            >
              {getTicketTypeText(ticket.ticketType)}
            </Text>
          </View>
        </View>

        {/* Issue Description */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AntDesign name="exclamation-circle" size={18} color="#FFB300" />
            <Text style={styles.sectionTitle}>Mô tả sự cố</Text>
          </View>
          <InfoCard>
            <Text style={styles.issueTitle}>{ticket.title}</Text>
            <Text style={styles.issueDescription}>{ticket.description}</Text>
            <View style={styles.issueMeta}>
              <View style={styles.metaItem}>
                <AntDesign
                  name="clock-circle"
                  size={12}
                  color={colors.text.secondary}
                />
                <Text style={styles.metaText}>
                  {new Date(ticket.createdAt).toLocaleString("en-GB")}
                </Text>
              </View>
            </View>
            {ticket.attachments && ticket.attachments.length > 0 && (
              <View style={styles.attachmentsContainer}>
                <Text style={styles.attachmentsLabel}>Đính kèm:</Text>
                {ticket.attachments.map((attachment, index) => (
                  <TouchableOpacity
                    key={attachment.id || index}
                    style={styles.attachmentItem}
                    onPress={() => Linking.openURL(attachment.fileUrl)}
                  >
                    <AntDesign name="file" size={14} color="#C9B6FF" />
                    <Text style={styles.attachmentText} numberOfLines={1}>
                      {attachment.docNo || `File ${index + 1}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </InfoCard>
        </View>

        {/* Booking Information */}
        {booking && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AntDesign name="calendar" size={18} color="#C9B6FF" />
              <Text style={styles.sectionTitle}>Thông tin Booking</Text>
            </View>
            <InfoCard>
              <InfoItem
                label="Mã booking"
                value={booking.bookingCode || `#${booking.id.slice(-8).toUpperCase()}`}
              />
              {booking.startDatetime && (
                <InfoItem
                  label="Ngày nhận xe"
                  value={booking.startDatetime.toLocaleString("en-GB")}
                />
              )}
              {booking.endDatetime && (
                <InfoItem
                  label="Ngày trả xe"
                  value={booking.endDatetime.toLocaleString("en-GB")}
                />
              )}
              <InfoItem
                label="Giá thuê xe"
                value={formatVnd(booking.baseRentalFee || 0)}
              />
              <TouchableOpacity
                style={styles.viewBookingButton}
                onPress={handleViewBooking}
                activeOpacity={0.7}
              >
                <AntDesign name="arrow-right" size={16} color="#C9B6FF" />
                <Text style={styles.viewBookingText}>Xem chi tiết booking</Text>
              </TouchableOpacity>
            </InfoCard>
          </View>
        )}

        {/* GPS Location */}
        {booking && (booking.vehicle?.id || booking.handoverBranch) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AntDesign name="environment" size={18} color="#67D16C" />
              <Text style={styles.sectionTitle}>Vị trí GPS hiện tại</Text>
            </View>
            <InfoCard>
              {booking.vehicle?.id ? (
                <>
                  <View style={styles.locationRow}>
                    <View style={styles.locationInfo}>
                      <AntDesign
                        name="environment"
                        size={16}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.locationText}>
                        Xe có GPS tracking - Nhấn để xem vị trí
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.gpsButton}
                      onPress={handleOpenGPS}
                      activeOpacity={0.7}
                    >
                      <AntDesign name="arrow-right" size={16} color="#67D16C" />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity
                    style={styles.trackGPSButton}
                    onPress={handleOpenGPS}
                    activeOpacity={0.7}
                  >
                    <AntDesign name="environment" size={16} color="#fff" />
                    <Text style={styles.trackGPSText}>Theo dõi GPS</Text>
                  </TouchableOpacity>
                </>
              ) : booking.handoverBranch ? (
                <>
                  <View style={styles.locationRow}>
                    <View style={styles.locationInfo}>
                      <AntDesign
                        name="environment"
                        size={16}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.locationText}>
                        {booking.handoverBranch.branchName || "-"}
                      </Text>
                    </View>
                    {booking.handoverBranch.latitude &&
                      booking.handoverBranch.longitude && (
                        <TouchableOpacity
                          style={styles.gpsButton}
                          onPress={handleOpenGPS}
                          activeOpacity={0.7}
                        >
                          <AntDesign name="arrow-right" size={16} color="#67D16C" />
                        </TouchableOpacity>
                      )}
                  </View>
                  {booking.handoverBranch.latitude &&
                    booking.handoverBranch.longitude && (
                      <View style={styles.coordinatesRow}>
                        <Text style={styles.coordinateText}>
                          Vĩ độ: {booking.handoverBranch.latitude.toFixed(6)}
                        </Text>
                        <Text style={styles.coordinateText}>
                          Kinh độ: {booking.handoverBranch.longitude.toFixed(6)}
                        </Text>
                      </View>
                    )}
                </>
              ) : null}
            </InfoCard>
          </View>
        )}

        {/* Renter Information */}
        {booking?.renter && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <AntDesign name="user" size={18} color="#7DB3FF" />
              <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            </View>
            <InfoCard>
              <InfoItem
                label="Họ và tên"
                value={booking.renter.fullName() || "-"}
              />
              <InfoItem
                label="Số điện thoại"
                value={booking.renter.phone || "-"}
              />
              <InfoItem
                label="Email"
                value={booking.renter.email || "-"}
              />
              {booking.renter.phone && (
                <TouchableOpacity
                  style={styles.callButton}
                  onPress={handleCallRenter}
                  activeOpacity={0.7}
                >
                  <AntDesign name="phone" size={16} color="#fff" />
                  <Text style={styles.callButtonText}>Gọi điện</Text>
                </TouchableOpacity>
              )}
            </InfoCard>
          </View>
        )}

        {/* Update Status Button */}
        {ticket && ticket.status === "InProgress" && (
          <View style={styles.section}>
            <TouchableOpacity
              style={[styles.updateStatusButton, updating && styles.updateStatusButtonDisabled]}
              onPress={handleUpdateStatus}
              disabled={updating}
              activeOpacity={0.7}
            >
              {updating ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <AntDesign name="check-circle" size={20} color="#000" />
              )}
              <Text style={styles.updateStatusButtonText}>
                {updating ? "Đang cập nhật..." : getNextStatusText(ticket.status)}
              </Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },
  ticketTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  ticketTypeText: {
    fontSize: 13,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 12,
  },
  errorText: {
    color: colors.text.secondary,
    fontSize: 16,
  },
  attachmentsContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  attachmentsLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#131313",
    borderRadius: 8,
    marginBottom: 6,
  },
  attachmentText: {
    color: "#C9B6FF",
    fontSize: 12,
    flex: 1,
  },
  viewBookingButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 12,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 12,
  },
  viewBookingText: {
    color: "#C9B6FF",
    fontSize: 14,
    fontWeight: "600",
  },
  trackGPSButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#67D16C",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  trackGPSText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  issueTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  issueDescription: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  issueMeta: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    flex: 1,
  },
  locationText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
    lineHeight: 20,
  },
  gpsButton: {
    padding: 8,
  },
  coordinatesRow: {
    flexDirection: "row",
    gap: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  coordinateText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#7DB3FF",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 12,
  },
  callButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  updateStatusButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  updateStatusButtonDisabled: {
    opacity: 0.6,
  },
  updateStatusButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  updateStatusNote: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
  },
});

