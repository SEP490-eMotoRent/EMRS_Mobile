import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { RentalReturnCreateReceiptUseCase } from "../../../../../../domain/usecases/rentalReturn/CreateReceiptUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { CreateReceiptResponse } from "../../../../../../data/models/rentalReturn/CreateReceiptResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";

type AdditionalFeesScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AdditionalFees"
>;

type AdditionalFeesScreenRouteProp = RouteProp<
  StaffStackParamList,
  "AdditionalFees"
>;

interface AdditionalFeesBreakdown {
  feeType: string;
  amount: number;
  description: string;
}

export const AdditionalFeesScreen: React.FC = () => {
  const navigation = useNavigation<AdditionalFeesScreenNavigationProp>();
  const route = useRoute<AdditionalFeesScreenRouteProp>();
  const {
    bookingId,
    endOdometerKm,
    endBatteryPercentage,
    returnImageUrls,
    checkListImage,
    additionalFees,
  } = route.params || ({} as any);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFees, setCustomFees] = useState<AdditionalFeesBreakdown[]>([
    { feeType: "", amount: 0, description: "" },
  ]);
  const [openTypeIdx, setOpenTypeIdx] = useState<number | null>(null);
  const feeTypeOptions = [
    "Cleaning",
    "Late Return",
    "Cross-branch Return",
    "Damage",
    "Compensation",
    "Manual Adjustment",
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  // Values used in existing UI blocks. Keep simple defaults so the screen compiles
  // and focuses on the custom additional fees the user can add.
  const distanceFee = 0;
  const batteryFee = 0;
  const damageFee = 0;
  const otherFees: {
    id: string;
    label: string;
    checked: boolean;
    amount: number;
  }[] = [];
  const baseRentalFee = 0;
  const subtotalFees = customFees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const depositHeld = 0;
  const refundAmount = 0;
  const totalAmount = baseRentalFee + subtotalFees;

  const addFeeRow = () => {
    if (isSubmitting) return;
    setCustomFees((prev) => [
      ...prev,
      { feeType: "", amount: 0, description: "" },
    ]);
  };

  const removeFeeRow = (index: number) => {
    if (isSubmitting) return;
    setCustomFees((prev) => prev.filter((_, i) => i !== index));
  };

  const updateFeeField = (
    index: number,
    key: keyof AdditionalFeesBreakdown,
    value: string
  ) => {
    setCustomFees((prev) => {
      const next = [...prev];
      if (key === "amount") {
        const num = parseInt(value || "0", 10);
        next[index].amount = isNaN(num) ? 0 : num;
      } else if (key === "feeType") {
        next[index].feeType = value;
      } else if (key === "description") {
        next[index].description = value;
      }
      return next;
    });
  };

  const handleGenerateReport = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      const createReturnReceiptUseCase = new RentalReturnCreateReceiptUseCase(
        sl.get("RentalReturnRepository")
      );

      const returnReceiptResponse = await createReturnReceiptUseCase.execute({
        notes: "Kiểm tra thủ công",
        endOdometerKm: parseInt(endOdometerKm),
        endBatteryPercentage: parseInt(endBatteryPercentage),
        bookingId,
        returnImageUrls,
        checkListImage,
        additionalFees: customFees
          .filter((f) => (f.feeType?.trim() || "") !== "" && f.amount > 0)
          .map((f) => ({
            feeType: f.feeType,
            amount: f.amount,
            description: f.description || "",
          })),
      });

      const returnReceiptData: CreateReceiptResponse = unwrapResponse(
        returnReceiptResponse
      );

      navigation.navigate("ReturnReport", {
        bookingId,
        rentalReceiptId: returnReceiptData.rentalReceiptId,
        settlement: returnReceiptData.settlement,
      });
    } catch (error) {
      Alert.alert("Lỗi", `Không thể gửi kiểm tra: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Additional Fees"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={4} totalSteps={4} />

        {/* Odometer & Distance Card (Fee only, based on settlement) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Odometer & Distance</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Excess KM Fee</Text>
            <Text style={styles.feeValue}>+ {formatCurrency(distanceFee)}</Text>
          </View>
        </View>

        {/* Battery Charge Fee Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Battery Charge Fee</Text>
          <View style={styles.feeRow}>
            <Text style={styles.feeLabel}>Charging Fee</Text>
            <Text style={styles.feeValue}>+ {formatCurrency(batteryFee)}</Text>
          </View>
        </View>

        {/* Damage Fees Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Damage Fees</Text>
          <View style={styles.damageRow}>
            <Text style={styles.damageDescription}>Damage total</Text>
            <Text style={styles.damageAmount}>{formatCurrency(damageFee)}</Text>
          </View>
        </View>

        {/* Additional Fees Header */}
        <View style={styles.additionalFeesHeader}>
          <View style={styles.additionalFeesIcon}>
            <AntDesign name="plus" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.additionalFeesTitle}>Additional Fees</Text>
        </View>

        {/* Other Fees Card (display-only from settlement) */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Other Fees</Text>
          {otherFees.map((fee) => (
            <View key={fee.id} style={styles.otherFeeRow}>
              <View
                style={[styles.checkbox, fee.checked && styles.checkboxChecked]}
              >
                {fee.checked && (
                  <AntDesign name="check" size={12} color="#FFFFFF" />
                )}
              </View>
              <View style={styles.otherFeeContent}>
                <Text style={styles.otherFeeLabel}>{fee.label}</Text>
              </View>
              <Text style={styles.otherFeeAmount}>
                {formatCurrency(fee.amount)}
              </Text>
            </View>
          ))}
        </View>

        {/* Custom Additional Fees (user input) */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Add Additional Fees</Text>
             <TouchableOpacity style={[styles.iconBtn, isSubmitting && styles.disabled]} onPress={addFeeRow} disabled={isSubmitting}>
              <AntDesign name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </View>

          {customFees.map((fee, index) => (
            <View key={index} style={styles.feeInputRow}>
              <View style={styles.feeColWide}>
                <Text style={styles.inputLabel}>Type</Text>
                 <TouchableOpacity
                   style={[styles.selectBox, isSubmitting && styles.disabled]}
                   activeOpacity={0.8}
                   disabled={isSubmitting}
                   onPress={() =>
                    setOpenTypeIdx(openTypeIdx === index ? null : index)
                  }
                >
                  <Text style={styles.selectText}>
                    {fee.feeType || "Select type"}
                  </Text>
                  <AntDesign
                    name={openTypeIdx === index ? "up" : "down"}
                    size={14}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
                {openTypeIdx === index && (
                  <View style={styles.dropdown}>
                    {feeTypeOptions.map((opt) => (
                      <TouchableOpacity
                        key={opt}
                        style={styles.dropdownItem}
                        onPress={() => {
                          updateFeeField(index, "feeType", opt);
                          setOpenTypeIdx(null);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>{opt}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
              <View style={styles.feeColNarrow}>
                <Text style={styles.inputLabel}>Amount</Text>
                 <TextInput
                   style={styles.input}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  keyboardType="numeric"
                  value={String(fee.amount || 0)}
                  onChangeText={(t) => updateFeeField(index, "amount", t)}
                   editable={!isSubmitting}
                />
              </View>
               <TouchableOpacity
                 style={[styles.removeBtn, isSubmitting && styles.disabled]}
                 onPress={() => removeFeeRow(index)}
                 disabled={isSubmitting}
               >
                <AntDesign name="delete" size={16} color="#FF6B35" />
              </TouchableOpacity>
              <View style={styles.feeColFull}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                 <TextInput
                   style={styles.input}
                  placeholder="Short note"
                  placeholderTextColor={colors.text.secondary}
                  value={fee.description}
                  onChangeText={(t) => updateFeeField(index, "description", t)}
                   editable={!isSubmitting}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Base Rental Fee</Text>
            <Text style={styles.summaryValue}>{formatCurrency(0)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Additional + Charging</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(subtotalFees)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Deposit Held</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(depositHeld)}
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.refundLabel}>Refund Amount</Text>
            <Text
              style={[
                styles.refundValue,
                { color: refundAmount >= 0 ? "#4CAF50" : "#FF6B35" },
              ]}
            >
              {formatCurrency(refundAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
        </View>

        {/* Generate Report Button */}
        <TouchableOpacity
          style={[styles.generateButton, isSubmitting && styles.disabled]}
          onPress={handleGenerateReport}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator size="small" color="#000" style={{ marginRight: 8 }} />
              <Text style={styles.generateButtonText}>Generating...</Text>
            </>
          ) : (
            <Text style={styles.generateButtonText}>Generate Return Report</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal while submitting */}
      <Modal transparent visible={isSubmitting} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang tạo báo cáo</Text>
          </View>
        </View>
      </Modal>
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
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#444444",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "right",
  },
  detailValueWarning: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FF6B35",
    textAlign: "right",
  },
  feeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#444444",
  },
  feeLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  feeValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  peakHoursBadge: {
    backgroundColor: "#D97706",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  peakHoursText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  damageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  damageDescription: {
    fontSize: 14,
    color: colors.text.primary,
    flex: 1,
  },
  damageAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "right",
  },
  additionalFeesHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  additionalFeesIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  additionalFeesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  otherFeeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#1E90FF",
    borderColor: "#1E90FF",
  },
  otherFeeContent: {
    flex: 1,
  },
  otherFeeLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 2,
  },
  otherFeeSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  otherFeeAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  summaryCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#444444",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#444444",
    marginVertical: 12,
  },
  refundLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
  },
  refundValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  generateButton: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  generateButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.6,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  iconBtn: {
    backgroundColor: "#C9B6FF",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  feeInputRow: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#444444",
    padding: 12,
    marginBottom: 12,
  },
  feeColWide: {
    marginBottom: 8,
  },
  feeColNarrow: {
    marginBottom: 8,
  },
  feeColFull: {
    marginTop: 4,
  },
  inputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#111",
    color: colors.text.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#2F2F2F",
  },
  removeBtn: {
    position: "absolute",
    right: 8,
    top: 8,
    padding: 6,
  },
  selectBox: {
    backgroundColor: "#111",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F2F2F",
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  dropdown: {
    backgroundColor: "#0F0F0F",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#2F2F2F",
    marginTop: 8,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1E1E1E",
  },
  dropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: 280,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#222",
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
