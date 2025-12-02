import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { GetBookingByIdUseCase } from "../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import sl from "../../../../../core/di/InjectionContainer";
import { Booking } from "../../../../../domain/entities/booking/Booking";

type NavProp = StackNavigationProp<TripStackParamList, "ReturnComplete">;
type RouteP = RouteProp<TripStackParamList, "ReturnComplete">;

export const ReturnCompleteScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  const { bookingId, refundAmount } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const bookingUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const fetchedBooking = await bookingUseCase.execute(bookingId);
      setBooking(fetchedBooking);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  // ✅ Check if any fees exist
  const hasAdditionalFees = !!(
    booking?.lateReturnFee ||
    booking?.excessKmFee ||
    booking?.cleaningFee ||
    booking?.crossBranchFee ||
    booking?.totalChargingFee ||
    booking?.earlyHandoverFee ||
    (booking?.additionalFees && booking.additionalFees.length > 0)
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingText}>Đang tải thông tin...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Trả xe thành công!</Text>
          <View style={styles.successIconContainer}>
            <View style={styles.successIconCircle}>
              <AntDesign name="check" size={32} color="#22C55E" />
            </View>
          </View>
          <Text style={styles.successMessage}>Xe đã được trả thành công</Text>
          <Text style={styles.timestamp}>
            {formatDate(booking?.actualReturnDatetime?.toString())}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tóm tắt hoàn tất</Text>

          <View style={styles.userRow}>
            <View style={styles.avatarContainer}>
              <AntDesign name="user" size={24} color={colors.text.secondary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {booking?.renter?.account?.fullname || "N/A"}
              </Text>
              <Text style={styles.vehicleInfo}>
                {booking?.vehicleModel?.modelName || "N/A"} -{" "}
                {booking?.vehicle?.licensePlate || "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.handoverStatusRow}>
            <View style={styles.checkmarkCircle}>
              <AntDesign name="check" size={12} color="#22C55E" />
            </View>
            <Text style={styles.handoverStatusText}>
              Tuyệt vời! Lại một lần bàn giao thành công
            </Text>
          </View>

          <View style={styles.feedbackRow}>
            <Text style={styles.feedbackLabel}>Đánh giá khách hàng</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((i) => (
                <AntDesign key={i} name="star" size={16} color="#FBBF24" />
              ))}
            </View>
            <Text style={styles.feedbackTime}>
              Khách duyệt lúc{" "}
              {new Date().toLocaleTimeString("vi-VN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          </View>
        </View>

        {/* ✅ NEW: Fee Breakdown Card */}
        {hasAdditionalFees && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Chi phí phát sinh</Text>

            {booking?.lateReturnFee && booking.lateReturnFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="clock-circle" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí trả xe muộn</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.lateReturnFee)}
                </Text>
              </View>
            )}

            {booking?.excessKmFee && booking.excessKmFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="dashboard" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí vượt quá km</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.excessKmFee)}
                </Text>
              </View>
            )}

            {booking?.cleaningFee && booking.cleaningFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="tool" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí vệ sinh</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.cleaningFee)}
                </Text>
              </View>
            )}

            {booking?.crossBranchFee && booking.crossBranchFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="swap" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí chuyển chi nhánh</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.crossBranchFee)}
                </Text>
              </View>
            )}

            {booking?.totalChargingFee && booking.totalChargingFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="thunderbolt" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí sạc pin</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.totalChargingFee)}
                </Text>
              </View>
            )}

            {booking?.earlyHandoverFee && booking.earlyHandoverFee > 0 && (
              <View style={styles.feeRow}>
                <View style={styles.feeLeft}>
                  <AntDesign name="calendar" size={14} color="#F59E0B" />
                  <Text style={styles.feeLabel}>Phí bàn giao sớm</Text>
                </View>
                <Text style={styles.feeAmount}>
                  {formatVnd(booking.earlyHandoverFee)}
                </Text>
              </View>
            )}

            {/* ✅ Additional Fees List */}
            {booking?.additionalFees &&
              booking.additionalFees.length > 0 &&
              booking.additionalFees.map((fee) => (
                <View key={fee.id} style={styles.additionalFeeItem}>
                  <View style={styles.additionalFeeLeft}>
                    <Text style={styles.additionalFeeFeeType}>{fee.feeType}</Text>
                    <Text style={styles.additionalFeeDescription}>
                      {fee.description}
                    </Text>
                  </View>
                  <Text style={styles.additionalFeeAmount}>
                    {formatVnd(fee.amount)}
                  </Text>
                </View>
              ))}

            {/* Total Additional Fees */}
            {booking?.totalAdditionalFee && booking.totalAdditionalFee > 0 && (
              <View style={[styles.feeRow, styles.totalFeeRow]}>
                <Text style={styles.totalFeeLabel}>Tổng phí phụ trội</Text>
                <Text style={styles.totalFeeAmount}>
                  {formatVnd(booking.totalAdditionalFee)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Financial Summary Card */}
        <View style={[styles.card, styles.financialCard]}>
          <Text style={styles.cardHeader}>Thanh toán cuối cùng</Text>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Tiền cọc</Text>
            <Text style={styles.financialValue}>
              {formatVnd(booking?.depositAmount || 0)}
            </Text>
          </View>

          {hasAdditionalFees && (
            <View style={styles.financialRow}>
              <Text style={styles.financialLabel}>Trừ phí phát sinh</Text>
              <Text style={[styles.financialValue, { color: "#F59E0B" }]}>
                -{formatVnd(booking?.totalAdditionalFee || 0)}
              </Text>
            </View>
          )}

          <View style={[styles.financialRow, styles.refundRow]}>
            <Text style={styles.financialLabel}>Hoàn tiền</Text>
            <Text style={styles.refundAmount}>{formatVnd(refundAmount)}</Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Phương thức</Text>
            <Text style={styles.financialValue}>Tự động hoàn vào ví</Text>
          </View>

          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Trạng thái</Text>
            <View style={styles.statusRow}>
              <View style={styles.checkmarkCircleSmall}>
                <AntDesign name="check" size={10} color="#22C55E" />
              </View>
              <Text style={styles.completedText}>Đã hoàn tất</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Bước tiếp theo</Text>

          <View style={styles.stepsRow}>
            <Text style={styles.stepsLabel}>Tình trạng xe</Text>
            <View style={styles.availableBadge}>
              <Text style={styles.availableBadgeText}>
                Sẵn sàng cho thuê tiếp
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.feedbackBanner}>
          <Text style={styles.feedbackBannerText}>
            Tuyệt vời! Lại một lần trả xe thành công.
          </Text>
          <View style={styles.feedbackRatingRow}>
            <AntDesign name="star" size={12} color="#FBBF24" />
            <Text style={styles.feedbackRatingText}>Đánh giá: 4.90</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("BookingDetails", { bookingId })}
        >
          <AntDesign name="file-text" size={18} color={colors.text.primary} />
          <Text style={styles.secondaryButtonText}>Xem chi tiết đặt xe</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("Trip")}
        >
          <AntDesign name="home" size={18} color="#000" />
          <Text style={styles.primaryButtonText}>Về trang chính</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 12,
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  title: {
    color: colors.text.primary,
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#052e1a",
    borderWidth: 3,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  successMessage: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  timestamp: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  financialCard: {
    backgroundColor: "#052e1a",
    borderColor: "#16A34A",
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  vehicleInfo: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  handoverStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmarkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#052e1a",
    borderWidth: 1,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  handoverStatusText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  feedbackRow: {
    marginTop: 12,
  },
  feedbackLabel: {
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 8,
  },
  feedbackTime: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  // ✅ NEW: Fee Breakdown Styles
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(245, 158, 11, 0.05)",
    borderRadius: 8,
    marginBottom: 8,
  },
  feeLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  feeLabel: {
    color: colors.text.primary,
    fontSize: 14,
  },
  feeAmount: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "700",
  },
  additionalFeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "rgba(187, 134, 252, 0.05)",
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#BB86FC",
  },
  additionalFeeLeft: {
    flex: 1,
    marginRight: 12,
  },
  additionalFeeFeeType: {
    color: "#BB86FC",
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  additionalFeeDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  additionalFeeAmount: {
    color: "#F59E0B",
    fontSize: 14,
    fontWeight: "700",
  },
  totalFeeRow: {
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderTopWidth: 1,
    borderTopColor: "rgba(245, 158, 11, 0.3)",
    marginTop: 4,
  },
  totalFeeLabel: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  totalFeeAmount: {
    color: "#F59E0B",
    fontSize: 16,
    fontWeight: "700",
  },
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  refundRow: {
    borderTopWidth: 1,
    borderTopColor: "rgba(34, 197, 94, 0.3)",
    paddingTop: 12,
    marginTop: 4,
  },
  financialLabel: {
    color: colors.text.primary,
    fontSize: 14,
  },
  refundAmount: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "700",
  },
  financialValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  checkmarkCircleSmall: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#052e1a",
    borderWidth: 1,
    borderColor: "#22C55E",
    alignItems: "center",
    justifyContent: "center",
  },
  completedText: {
    color: "#22C55E",
    fontSize: 14,
    fontWeight: "700",
  },
  stepsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  stepsLabel: {
    color: colors.text.primary,
    fontSize: 14,
  },
  availableBadge: {
    backgroundColor: "#052e1a",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  availableBadgeText: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "700",
  },
  feedbackBanner: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    alignItems: "center",
  },
  feedbackBannerText: {
    color: colors.text.primary,
    fontSize: 14,
    marginBottom: 6,
  },
  feedbackRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  feedbackRatingText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  primaryButton: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryButtonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  secondaryButtonText: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
});