import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
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

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    const bookingUseCase = new GetBookingByIdUseCase(
      sl.get("BookingRepository")
    );
    const booking = await bookingUseCase.execute(bookingId);
    setBooking(booking);
  };

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB");
  };

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
                {booking?.renter?.account?.fullname}
              </Text>
              <Text style={styles.vehicleInfo}>
                {booking?.vehicleModel?.modelName} -{" "}
                {booking?.vehicle?.licensePlate}
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

        <View style={[styles.card, styles.financialCard]}>
          <Text style={styles.cardHeader}>Thanh toán cuối cùng</Text>

          <View style={styles.financialRow}>
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
  financialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  stepsValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
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
