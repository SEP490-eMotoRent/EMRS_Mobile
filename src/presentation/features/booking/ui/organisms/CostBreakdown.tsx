import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { CostRow } from "../atoms/text/CostRow";

interface CostBreakdownProps {
  rentalFee: string;
  insuranceFee: string;
  securityDeposit: string;
  total: string; // Chỉ để đồng bộ với backend, không dùng để tính
}

export const CostBreakdown: React.FC<CostBreakdownProps> = ({
  rentalFee,
  insuranceFee,
  securityDeposit,
}) => {
  const parsePrice = (price: string): number => {
    return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
  };

  const rental = parsePrice(rentalFee);
  const insurance = parsePrice(insuranceFee);
  const deposit = parsePrice(securityDeposit);

  // Tổng tiền phải trả NGAY = Thuê + Bảo hiểm + Cọc
  const immediatePayment = rental + insurance + deposit;

  const format = (num: number) => num.toLocaleString("vi-VN") + "đ";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chi tiết thanh toán</Text>
      <View style={styles.content}>
        <CostRow label="Phí Thuê Xe" value={format(rental)} />
        <CostRow label="Bảo Hiểm" value={format(insurance)} highlight />
        <CostRow label="Đặt Cọc" value={format(deposit)} highlight />
        {/* <CostRow
          label="Tổng cộng"
          value={format(immediatePayment)}
          isTotal
          highlightValue
        /> */}
      </View>

      <View style={styles.immediateSection}>
        <View style={styles.immediateRow}>
          <Text style={styles.immediateLabel}>Tổng cộng</Text>
          <Text style={styles.immediateValue}>{format(immediatePayment)}</Text>
        </View>
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