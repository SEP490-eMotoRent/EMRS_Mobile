import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CostRow } from "../atoms/text/CostRow";

interface CostBreakdownProps {
  rentalFee: string;
  insuranceFee: string;
  securityDeposit: string;
  total: string;
  holidaySurcharge?: number;
  holidayDayCount?: number;
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  rentalFee,
  insuranceFee,
  securityDeposit,
  holidaySurcharge = 0,
  holidayDayCount = 0,
}) => {
  const parsePrice = (price: string): number => {
    return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const rental = parsePrice(rentalFee);
  const insurance = parsePrice(insuranceFee);
  const deposit = parsePrice(securityDeposit);

  const immediatePayment = rental + insurance + deposit;

  const format = (num: number) => num.toLocaleString("vi-VN") + "đ";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết thanh toán</Text>
      <View style={styles.content}>
        <CostRow label="Phí Thuê Xe" value={format(rental)} />
        
        {/* ✅ Holiday Surcharge - shown as sub-item if applicable */}
        {holidaySurcharge > 0 && (
          <View style={styles.holidayRow}>
            <Text style={styles.holidayLabel}>
              ↳ Bao gồm phụ thu lễ ({holidayDayCount} ngày)
            </Text>
            <Text style={styles.holidayValue}>
              +{format(holidaySurcharge)}
            </Text>
          </View>
        )}
        
        <CostRow label="Bảo Hiểm" value={format(insurance)} highlight />
        <CostRow label="Đặt Cọc" value={format(deposit)} highlight />
      </View>

      <View style={styles.immediateSection}>
        <View style={styles.immediateRow}>
          <Text style={styles.immediateLabel}>Tổng cộng</Text>
          <Text style={styles.immediateValue}>{format(immediatePayment)}</Text>
        </View>
        
        {/* ✅ Holiday notice */}
        {holidaySurcharge > 0 && (
          <Text style={styles.holidayNotice}>
            * Giá đã bao gồm phụ thu ngày lễ
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  content: {
    gap: 4,
    marginBottom: 16,
  },
  // ✅ Holiday Surcharge Styles
  holidayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 12,
    paddingVertical: 4,
    marginTop: -4,
    marginBottom: 4,
  },
  holidayLabel: {
    color: "#fca5a5",
    fontSize: 12,
    flex: 1,
  },
  holidayValue: {
    color: "#fca5a5",
    fontSize: 12,
    fontWeight: "500",
  },
  holidayNotice: {
    color: "#fca5a5",
    fontSize: 11,
    marginTop: 8,
    textAlign: "right",
  },
  immediateSection: {
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 12,
  },
  immediateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  immediateLabel: {
    color: "#00ff00",
    fontSize: 16,
    fontWeight: "600",
  },
  immediateValue: {
    color: "#00ff00",
    fontSize: 18,
    fontWeight: "700",
  },
});