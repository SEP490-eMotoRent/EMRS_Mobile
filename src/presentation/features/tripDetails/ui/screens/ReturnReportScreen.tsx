import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { SummaryResponse } from "../../../../../data/models/rentalReturn/SummaryResponse";
import { RentalReturnSummaryUseCase } from "../../../../../domain/usecases/rentalReturn/SummaryReceiptUseCase";
import sl from "../../../../../core/di/InjectionContainer";
import { unwrapResponse } from "../../../../../core/network/APIResponse";
import { RentalReturnFinalizeUseCase } from "../../../../../domain/usecases/rentalReturn/RentalReturnFinalizeUseCase";
import { FinalizeReturnResponse } from "../../../../../data/models/rentalReturn/FinalizeReturnResponse";

type NavProp = StackNavigationProp<TripStackParamList, "ReturnReport">;
type RouteP = RouteProp<TripStackParamList, "ReturnReport">;

export const ReturnReportScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  const { bookingId } = route.params;

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummaryReceipt();
  }, [bookingId]);

  const fetchSummaryReceipt = async () => {
    try {
      setLoading(true);

      const getBookingByIdUseCase = new RentalReturnSummaryUseCase(
        sl.get("RentalReturnRepository")
      );
      const summaryResponse = await getBookingByIdUseCase.execute(bookingId);
      const summaryData: SummaryResponse = unwrapResponse(summaryResponse);
      setSummary(summaryData);
    } catch (error) {
      Alert.alert("Error", `Không thể lấy tổng tiền: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " VND";

  const handleFinalizeReturn = async () => {
    try {
      setLoading(true);
      const finalizeReturnUseCase = new RentalReturnFinalizeUseCase(
        sl.get("RentalReturnRepository")
      );
      const finalizeReturnResponse = await finalizeReturnUseCase.execute({
        bookingId,
        renterConfirmed: true,
      });
      const finalizeReturnData: FinalizeReturnResponse = unwrapResponse(
        finalizeReturnResponse
      );

      // Navigate to Return Complete screen
      navigation.navigate("ReturnComplete");
    } catch (error: any) {
      Alert.alert("Error", `Không thể kết thúc trả xe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    console.log("handleApprove");
    handleFinalizeReturn();
  };

  const handleRequestRecheck = () => {
    navigation.navigate("ReturnComplete");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <ScreenHeader
          title="Return Report"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        {/* Orange actionable banner */}
        <View style={styles.banner}>
          <AntDesign name="exclamation-circle" size={14} color="#FFEDD5" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>
              Action Required: Review your return report
            </Text>
            <Text style={styles.bannerSub}>
              Submitted on {new Date().toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Vehicle card */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.vehicleTitle}>VinFast Evo200</Text>
              <Text style={styles.vehicleMeta}>59X1-12345</Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>Awaiting Approval</Text>
            </View>
          </View>
        </View>

        {/* Photos */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Vehicle Condition Photos</Text>
          <View style={styles.photoRow}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.photoItem}>
                <Image
                  source={{ uri: "https://picsum.photos/200?random=" + i }}
                  style={styles.photoImg}
                />
              </View>
            ))}
          </View>
          <TouchableOpacity style={styles.successBtn}>
            <AntDesign name="check-circle" size={14} color="#16A34A" />
            <Text style={styles.successBtnText}>
              Identity & vehicle verified
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkRow}>
            <Text style={styles.linkText}>View AI Report</Text>
            <AntDesign name="right" size={12} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>

        {/* Odometer & Usage */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Odometer & Usage</Text>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Start Odometer</Text>
            <Text style={styles.kvVal}>1,234 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>End Odometer</Text>
            <Text style={styles.kvVal}>1,390 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Distance Traveled</Text>
            <Text style={styles.kvVal}>156 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Excess KM</Text>
            <Text style={[styles.kvVal, { color: "#F59E0B" }]}>56 km</Text>
          </View>
        </View>

        {/* Charges Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Charges Summary</Text>

          <View style={styles.kvRow}>
            <Text style={styles.kvDim}>Total Additional Fees</Text>
            <Text style={styles.kvStrong}>
              {formatVnd(summary?.totalAmount || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Distance Fee</Text>
            <Text style={styles.kvVal}>
              {formatVnd(summary?.feesBreakdown.excessKmFee || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Battery Fee</Text>
            <Text style={styles.kvVal}>
              {formatVnd(summary?.totalChargingFee || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Damage Fee</Text>
            <Text style={styles.kvVal}>
              {formatVnd(summary?.feesBreakdown.damageFee || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Late Return</Text>
            <Text style={styles.kvVal}>
              {formatVnd(summary?.feesBreakdown.lateReturnFee || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Deposit</Text>
            <Text style={styles.kvVal}>
              {formatVnd(summary?.depositAmount || 0)}
            </Text>
          </View>

          <View style={[styles.kvRow, styles.topLine]}>
            <Text style={styles.kvStrong}>Refund Amount</Text>
            <Text
              style={[
                styles.kvStrong,
                {
                  color:
                    (summary?.refundAmount || 0) >= 0 ? "#22C55E" : "#F97316",
                },
              ]}
            >
              {formatVnd(summary?.refundAmount || 0)}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <TouchableOpacity style={styles.primaryCta} onPress={handleApprove}>
          <Text style={styles.primaryCtaText}>Approve & Make Payment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryCta}
          onPress={handleRequestRecheck}
        >
          <Text style={styles.secondaryCtaText}>Request Recheck</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  headerTitle: { color: colors.text.primary, fontWeight: "700" },

  banner: {
    marginHorizontal: 16,
    backgroundColor: "#7C3E1D",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  bannerTitle: { color: "#FFEDD5", fontWeight: "700", fontSize: 12 },
  bannerSub: { color: "#FED7AA", fontSize: 11 },

  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  cardHeader: {
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleTitle: { color: colors.text.primary, fontWeight: "700" },
  vehicleMeta: { color: colors.text.secondary, fontSize: 12 },
  statusPill: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: { color: "#7C2D12", fontWeight: "700", fontSize: 12 },

  photoRow: { flexDirection: "row", gap: 8 },
  photoItem: {
    flex: 1,
    height: 70,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
  },
  photoImg: { width: "100%", height: "100%" },
  successBtn: {
    marginTop: 10,
    backgroundColor: "#052e1a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  successBtnText: { color: "#22C55E", fontWeight: "700", fontSize: 12 },
  linkRow: { marginTop: 8, flexDirection: "row", alignItems: "center", gap: 6 },
  linkText: { color: colors.text.secondary, fontSize: 12 },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  kvKey: { color: colors.text.secondary, fontSize: 12 },
  kvVal: { color: colors.text.primary, fontSize: 12 },
  kvDim: { color: colors.text.secondary, fontSize: 12 },
  kvStrong: { color: colors.text.primary, fontWeight: "700" },
  topLine: {
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    paddingTop: 8,
    marginTop: 6,
  },

  primaryCta: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryCtaText: { color: "#000", fontWeight: "700" },
  secondaryCta: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  secondaryCtaText: { color: colors.text.primary, fontWeight: "700" },
});
