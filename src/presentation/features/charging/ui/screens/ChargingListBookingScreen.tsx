import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { colors } from "../../../../common/theme/colors";
import { StaffStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { GetChargingByBookingUseCase } from "../../../../../domain/usecases/charging/GetChargingByBookingUseCase";
import sl from "../../../../../core/di/InjectionContainer";
import { ChargingListResponse } from "../../../../../data/models/charging/ChargingListResponse";

type NavProp = StackNavigationProp<StaffStackParamList, "ChargingListBooking">;
type RouteP = RouteProp<StaffStackParamList, "ChargingListBooking">;

const formatVnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + "đ";

export const ChargingListBookingScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  const { bookingId, licensePlate } = route.params;

  const [chargingList, setChargingList] = useState<ChargingListResponse[]>([]);

  useEffect(() => {
    getChargingByBookingId();
  }, [bookingId]);

  const getChargingByBookingId = async () => {
    try {
      const getChargingByBookingUseCase = new GetChargingByBookingUseCase(
        sl.get("ChargingRepository")
      );
      const response = await getChargingByBookingUseCase.execute(bookingId);
      if (response.success) {
        setChargingList(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusStyle = (status: "PAID" | "PENDING" | "CANCELLED") => {
    switch (status) {
      case "PAID":
        return {
          label: "Đã thanh toán",
          container: styles.statusPaid,
          text: styles.statusPaidText,
          iconColor: "#22C55E",
        };
      case "PENDING":
        return {
          label: "Đang chờ",
          container: styles.statusPending,
          text: styles.statusPendingText,
          iconColor: "#FACC15",
        };
      case "CANCELLED":
        return {
          label: "Đã hủy",
          container: styles.statusCancelled,
          text: styles.statusCancelledText,
          iconColor: "#F97316",
        };
      default:
        return {
          label: status,
          container: styles.statusPending,
          text: styles.statusPendingText,
          iconColor: "#9CA3AF",
        };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Lịch sử sạc"
          subtitle={licensePlate || "Theo booking hiện tại"}
          submeta={bookingId ? `Booking #${bookingId.slice(-6)}` : ""}
          onBack={() => navigation.goBack()}
          showBackButton
        />

        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.heroIcon}>
              <AntDesign name="thunderbolt" size={26} color="#14121F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Tổng quan sạc theo booking</Text>
              <Text style={styles.heroSubtitle}>
                Xem lại các phiên sạc đã tạo trong thời gian khách thuê xe này.
              </Text>
            </View>
          </View>
          {chargingList.length > 0 && (
            <View style={styles.heroBadge}>
              <AntDesign name="thunderbolt" size={16} color="#22C55E" />
              <Text style={styles.heroBadgeText}>Dữ liệu hệ thống</Text>
            </View>
          )}
        </View>

        {/* Summary row */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng số phiên</Text>
            <Text style={styles.summaryValue}>{chargingList.length}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Tổng kWh</Text>
            <Text style={styles.summaryValue}>
              {chargingList
                .reduce((sum, s) => sum + (s.kwhCharged || 0), 0)
                .toFixed(1)}{" "}
              kWh
            </Text>
          </View>
        </View>

        {/* List sessions */}
        <View style={styles.listContainer}>
          {chargingList.length === 0 ? (
            <View style={styles.emptyState}>
              <AntDesign
                name="database"
                size={28}
                color={colors.text.secondary}
              />
              <Text style={styles.emptyTitle}>Chưa có phiên sạc nào</Text>
              <Text style={styles.emptySubtitle}>
                Các lần sạc được tạo trong quá trình thuê xe sẽ hiển thị tại
                đây.
              </Text>
            </View>
          ) : (
            chargingList.map((session, index) => {
              const statusStyle = getStatusStyle("PAID");
              const batteryDelta =
                (session as any).batteryPercentageCharged ??
                session.endBatteryPercentage - session.startBatteryPercentage;

              return (
                <View key={session.bookingCode + index} style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={styles.sessionHeaderLeft}>
                      <View style={styles.sessionIconContainer}>
                        <AntDesign name="thunderbolt" size={20} color="#C9B6FF" />
                      </View>
                      <View>
                        <Text style={styles.sessionTitle}>
                          Phiên sạc #{index + 1}
                        </Text>
                        <Text style={styles.sessionMeta}>
                          {new Date(session.chargingDate).toLocaleString("en-GB")}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.statusBadge, statusStyle.container]}>
                      <AntDesign
                        name="check-circle"
                        size={12}
                        color={statusStyle.iconColor}
                      />
                      <Text style={[styles.statusText, statusStyle.text]}>
                        {statusStyle.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sessionBody}>
                    <View style={styles.sessionRow}>
                      <Text style={styles.sessionLabel}>Số điện (kWh)</Text>
                      <Text style={styles.sessionValue}>
                        {session.kwhCharged} kWh
                      </Text>
                    </View>
                    <View style={styles.sessionRow}>
                      <Text style={styles.sessionLabel}>Thành tiền</Text>
                      <Text style={styles.sessionValueHighlight}>
                        {formatVnd(session.fee)}
                      </Text>
                    </View>
                    <View style={styles.sessionRow}>
                      <Text style={styles.sessionLabel}>Mức pin</Text>
                      <Text style={styles.sessionValueSecondary}>
                        {session.startBatteryPercentage}% →{" "}
                        {session.endBatteryPercentage}% (
                        {batteryDelta > 0 ? "+" : ""}
                        {batteryDelta}%)
                      </Text>
                    </View>
                    <View style={styles.sessionRow}>
                      <Text style={styles.sessionLabel}>Địa điểm</Text>
                      <Text
                        style={styles.sessionValueSecondary}
                        numberOfLines={1}
                      >
                        {session.branchAddress}
                      </Text>
                    </View>
                    <View style={styles.sessionRow}>
                      <Text style={styles.sessionLabel}>Nhân viên tạo</Text>
                      <Text style={styles.sessionValueSecondary}>
                        {session.staffName}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.sessionFooter}>
                    <View style={styles.sessionFooterLeft}>
                      <AntDesign
                        name="calendar"
                        size={12}
                        color={colors.text.secondary}
                      />
                      <Text style={styles.sessionFooterText}>
                        Thời gian sạc: {new Date(session.chargingDate).toLocaleString("en-GB")}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.sessionActionBtn}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.sessionActionText}>Xem chi tiết</Text>
                      <AntDesign name="arrow-right" size={14} color="#C9B6FF" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
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
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#14121F",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFD666",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  heroSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.4)",
  },
  heroBadgeText: {
    color: "#22C55E",
    fontSize: 11,
    fontWeight: "600",
  },
  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginHorizontal: 16,
    marginBottom: 8,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  listContainer: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  sessionCard: {
    backgroundColor: "#1A1A1F",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2F",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sessionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  sessionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(201,182,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  sessionMeta: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  statusPaid: {
    backgroundColor: "rgba(34,197,94,0.1)",
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.5)",
  },
  statusPaidText: {
    color: "#22C55E",
  },
  statusPending: {
    backgroundColor: "rgba(250,204,21,0.08)",
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.4)",
  },
  statusPendingText: {
    color: "#FACC15",
  },
  statusCancelled: {
    backgroundColor: "rgba(248,113,22,0.08)",
    borderWidth: 1,
    borderColor: "rgba(248,113,22,0.4)",
  },
  statusCancelledText: {
    color: "#F97316",
  },
  sessionBody: {
    gap: 6,
  },
  sessionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sessionLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  sessionValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  sessionValueHighlight: {
    color: "#C9B6FF",
    fontSize: 14,
    fontWeight: "700",
  },
  sessionValueSecondary: {
    color: colors.text.secondary,
    fontSize: 12,
    maxWidth: "60%",
    textAlign: "right",
  },
  sessionFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#262630",
  },
  sessionFooterLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionFooterText: {
    color: colors.text.secondary,
    fontSize: 11,
  },
  sessionActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(201,182,255,0.12)",
  },
  sessionActionText: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },
  emptySubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});

export default ChargingListBookingScreen;
