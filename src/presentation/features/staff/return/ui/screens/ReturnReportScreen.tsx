import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepProgressBar } from "../atoms";

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

  const formatCurrency = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " VND";

  const distanceFee = settlement.feesBreakdown.excessKmFee || 0;
  const chargingFee = settlement.totalChargingFee || 0;
  const damageFee = settlement.feesBreakdown.damageFee || 0;
  const lateReturnFee = settlement.feesBreakdown.lateReturnFee || 0;
  const cleaningFee = settlement.feesBreakdown.cleaningFee || 0;

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    // TODO: call API to refresh status if available
    navigation.navigate("Rental");
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Awaiting Customer Approval"
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
          <Text style={styles.centerTitle}>Report sent to customer</Text>
          <Text style={styles.centerSub}>Waiting for approval...</Text>
        </View>

        {/* Report Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Report Summary</Text>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Vehicle</Text>
            <Text style={styles.summaryValueRight}>VinFast Evo200 (59X1-12345)</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Return Time</Text>
            <Text style={styles.summaryValueRight}>{new Date().toLocaleTimeString("vi-VN")}</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Odometer</Text>
            <Text style={styles.summaryValueRight}>—</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Battery</Text>
            <Text style={styles.summaryValueRight}>—</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Condition</Text>
            <Text style={[styles.summaryValueRight, { color: "#F59E0B" }]}>Minor damage detected</Text>
          </View>
          <View style={styles.summaryRow}> 
            <Text style={styles.summaryLabel}>Photos</Text>
            <Text style={styles.summaryValueRight}>4 angles captured</Text>
          </View>
        </View>

        {/* Financial Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Financial Summary</Text>
          <View style={styles.totalLine}>
            <Text style={styles.totalTitle}>Total Additional Fees</Text>
            <Text style={styles.totalValue}>{formatCurrency((settlement.totalAdditionalFees || 0) + chargingFee)}</Text>
          </View>

          <View style={styles.feeRow}> 
            <Text style={styles.feeLabel}>Distance Fee</Text>
            <Text style={styles.feeAmount}>{formatCurrency(distanceFee)}</Text>
          </View>
          <View style={styles.feeRow}> 
            <Text style={styles.feeLabel}>Battery Fee</Text>
            <Text style={styles.feeAmount}>{formatCurrency(chargingFee)}</Text>
          </View>
          <View style={styles.feeRow}> 
            <Text style={styles.feeLabel}>Damage Fee</Text>
            <Text style={styles.feeAmount}>{formatCurrency(damageFee)}</Text>
          </View>
          <View style={styles.feeRow}> 
            <Text style={styles.feeLabel}>Late Return</Text>
            <Text style={styles.feeAmount}>{formatCurrency(lateReturnFee)}</Text>
          </View>
          <View style={styles.feeRow}> 
            <Text style={styles.feeLabel}>Cleaning</Text>
            <Text style={styles.feeAmount}>{formatCurrency(cleaningFee)}</Text>
          </View>

          <View style={styles.depositRow}> 
            <Text style={styles.depositLabel}>Deposit</Text>
            <Text style={styles.depositValue}>{formatCurrency(settlement.depositAmount || 0)}</Text>
          </View>

          <View style={styles.refundRow}> 
            <Text style={styles.refundLabel}>Refund Amount</Text>
            <Text style={[styles.refundValue, { color: (settlement.refundAmount || 0) >= 0 ? "#4CAF50" : "#FF6B35" }]}>
              {formatCurrency(settlement.refundAmount || 0)}
            </Text>
          </View>
        </View>

        {/* Hint box */}
        <View style={styles.hintCard}>
          <Text style={styles.hintText}>If customer doesn't respond in 15 mins, you can force complete</Text>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} disabled={isRefreshing}>
          <AntDesign name="reload" size={16} color="#C9B6FF" />
          <Text style={styles.refreshText}>{isRefreshing ? "Refreshing..." : "Refresh Status"}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.waitingBtn} disabled>
          <Text style={styles.waitingText}>Waiting for Customer...</Text>
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
  refundRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#444444",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
 });
