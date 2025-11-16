import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepProgressBar } from "../atoms";
import { SummaryResponse } from "../../../../../../data/models/rentalReturn/SummaryResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { RentalReturnSummaryUseCase } from "../../../../../../domain/usecases/rentalReturn/SummaryReceiptUseCase";
import sl from "../../../../../../core/di/InjectionContainer";

type ReturnReportNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ReturnReport"
>;

type ReturnReportRouteProp = RouteProp<StaffStackParamList, "ReturnReport">;

export const ReturnReportScreen: React.FC = () => {
  const navigation = useNavigation<ReturnReportNavigationProp>();
  const route = useRoute<ReturnReportRouteProp>();
  const { bookingId, rentalReceiptId, settlement } = route.params;
  const [isRefreshing, setIsRefreshing] = useState(false);

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " VND";

  // const distanceFee = settlement.feesBreakdown.excessKmFee || 0;
  // const chargingFee = settlement.totalChargingFee || 0;
  // const damageFee = settlement.feesBreakdown.damageFee || 0;
  // const lateReturnFee = settlement.feesBreakdown.lateReturnFee || 0;
  // const cleaningFee = settlement.feesBreakdown.cleaningFee || 0;
  const [summary, setSummary] = useState<SummaryResponse | null>(null);

  useEffect(() => {
    fetchSummary();
  }, [bookingId]);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // TODO: call API to refresh status if available
    navigation.navigate("Rental");
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const fetchSummary = async () => {
    try {
      const getSummaryUseCase = new RentalReturnSummaryUseCase(
        sl.get("RentalReturnRepository")
      );
      const summaryResponse = await getSummaryUseCase.execute(bookingId);
      const summaryData: SummaryResponse = unwrapResponse(summaryResponse);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Đang chờ phê duyệt khách hàng"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={4} totalSteps={4} />

        {/* Sent to customer status */}
        <View style={styles.centerStatusWrap}>
          <View style={styles.iconCircleOuter}>
            <View style={styles.iconCircleInner}>
              <AntDesign name="file-text" size={20} color="#C9B6FF" />
            </View>
          </View>
          <Text style={styles.centerTitle}>Báo cáo đã gửi cho khách hàng</Text>
          <Text style={styles.centerSub}>Đang chờ phê duyệt...</Text>
        </View>

        {/* Report Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tóm tắt báo cáo</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Xe</Text>
            <Text style={styles.summaryValueRight}>
              VinFast Evo200 (59X1-12345)
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Thời gian trả</Text>
            <Text style={styles.summaryValueRight}>
              {new Date().toLocaleTimeString("vi-VN")}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số km</Text>
            <Text style={styles.summaryValueRight}>—</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Pin</Text>
            <Text style={styles.summaryValueRight}>—</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tình trạng</Text>
            <Text style={[styles.summaryValueRight, { color: "#F59E0B" }]}>
              Phát hiện hư hỏng nhỏ
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ảnh</Text>
            <Text style={styles.summaryValueRight}>Đã chụp 4 góc</Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tóm tắt tài chính</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Phí thuê xe</Text>
            <Text style={styles.feeAmount}>
              {formatCurrency(summary?.baseRentalFee || 0)}
            </Text>
          </View>
          {summary?.feesBreakdown.excessKmFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí quãng đường</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.excessKmFee || 0)}
              </Text>
            </View>
          )}
          {summary?.totalChargingFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí sạc pin</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.totalChargingFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.damageFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí hư hỏng</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.damageFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.cleaningFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí vệ sinh</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.cleaningFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.crossBranchFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí chuyển chi nhánh</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.crossBranchFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.excessKmFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Phí quá quãng đường</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.excessKmFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.lateReturnFee !== 0 && (
            <View style={styles.feeRow}>
              <Text style={styles.feeLabel}>Trả muộn</Text>
              <Text style={styles.feeAmount}>
                {formatCurrency(summary?.feesBreakdown.lateReturnFee || 0)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Tổng phụ phí</Text>
            <Text style={styles.feeAmount}>
              {formatCurrency(summary?.totalAmount || 0)}
            </Text>
          </View>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Tiền cọc</Text>
            <Text style={styles.feeAmount}>
              {formatCurrency(summary?.depositAmount || 0)}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.refundRow}>
            <Text style={styles.refundLabel}>
              {(summary?.refundAmount || 0) >= 0
                ? "Số tiền hoàn lại"
                : "Số tiền cần thanh toán thêm"}
            </Text>

            <Text
              style={[
                styles.refundValue,
                {
                  color:
                    (summary?.refundAmount || 0) >= 0 ? "#4CAF50" : "#FF6B35",
                },
              ]}
            >
              {formatCurrency(Math.abs(summary?.refundAmount || 0))}
            </Text>
          </View>
        </View>

        {/* Hint box */}
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>
            Nếu khách hàng không phản hồi trong 15 phút, bạn có thể buộc hoàn tất
          </Text>
        </View>

        {/* Actions */}
        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <AntDesign name="reload" size={16} color="#C9B6FF" />
          <Text style={styles.refreshText}>
            {isRefreshing ? "Đang làm mới..." : "Làm mới trạng thái"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waitingBtn} disabled>
          <Text style={styles.waitingText}>Đang chờ khách hàng...</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate("Rental")}
        >
          <AntDesign name="home" size={16} color="#000" />
          <Text style={styles.homeText}>Về trang chủ</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  centerStatusWrap: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  iconCircleOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  iconCircleInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1F2937",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#C9B6FF",
  },
  centerTitle: {
    color: colors.text.primary,
    fontWeight: "600",
    marginTop: 4,
  },
  centerSub: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444444",
  },
  cardHeader: {
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
  },
  summaryValueRight: {
    color: colors.text.primary,
    fontSize: 12,
    textAlign: "right",
    flex: 1,
  },
  totalLine: {
    backgroundColor: "#1F2937",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalTitle: { color: colors.text.secondary, fontSize: 12 },
  totalValue: { color: colors.text.primary, fontWeight: "700" },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  feeLabel: { color: colors.text.secondary, fontSize: 12 },
  feeAmount: { color: colors.text.primary, fontSize: 12 },
  depositRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  depositLabel: { color: colors.text.secondary, fontSize: 12 },
  depositValue: { color: colors.text.primary, fontSize: 12 },
  divider: {
    height: 1,
    backgroundColor: "#dedede",
    marginVertical: 4,
    marginBottom: 8,
  },
  refundRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  refundLabel: { color: colors.text.primary, fontWeight: "700" },
  refundValue: { fontWeight: "800", fontSize: 18 },
  hintCard: {
    backgroundColor: "#111827",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  hintText: { color: colors.text.secondary, textAlign: "center", fontSize: 12 },
  refreshBtn: {
    backgroundColor: "#111827",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#1F2937",
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  refreshText: { color: "#C9B6FF", fontWeight: "700" },
  waitingBtn: {
    backgroundColor: "#1F2937",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    alignItems: "center",
  },
  waitingText: { color: colors.text.secondary, fontWeight: "600" },
  homeBtn: {
    backgroundColor: "#C9B6FF",
    borderRadius: 10,
    paddingVertical: 14,
    marginTop: 16,
    marginHorizontal: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  homeText: { color: "#000", fontWeight: "700" },
});
