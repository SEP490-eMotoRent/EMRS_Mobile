import React, { useEffect, useState } from "react";
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
import Toast from "react-native-toast-message";
import { DamageType } from "../../../../../../data/models/additionalFee/DamageTypesResponse";
import { GetDamageTypesUseCase } from "../../../../../../domain/usecases/additionalFee/GetDamageTypesUseCase";

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

interface DamageFee {
  damageType: string;
  amount: number;
  additionalNotes: string;
}

export const AdditionalFeesScreen: React.FC = () => {
  const navigation = useNavigation<AdditionalFeesScreenNavigationProp>();
  const route = useRoute<AdditionalFeesScreenRouteProp>();
  const { bookingId } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFees, setCustomFees] = useState<AdditionalFeesBreakdown[]>([]);
  const [damageFees, setDamageFees] = useState<DamageFee[]>([]);
  const [openTypeIdx, setOpenTypeIdx] = useState<number | null>(null);
  const [openDamageIdx, setOpenDamageIdx] = useState<number | null>(null);
  const [damageTypeOptions, setDamageTypeOptions] = useState<DamageType[]>([]);

  useEffect(() => {
    const getDamageTypesUseCase = new GetDamageTypesUseCase(sl.get("AdditionalFeeRepository"));
    getDamageTypesUseCase.execute().then((options) => {
      setDamageTypeOptions(options);
    });
  }, []);

  const feeTypeOptions = [
    { value: "CLEANING", label: "Phí vệ sinh", icon: "clear", color: "#7CFFCB" },
    { value: "LATE_RETURN", label: "Phí trả muộn", icon: "clock-circle", color: "#FFD666" },
    { value: "CROSS_BRANCH", label: "Phí trả khác chi nhánh", icon: "swap", color: "#7DB3FF" },
    { value: "EXCESS_KM", label: "Phí vượt km", icon: "dashboard", color: "#C9B6FF" },
  ];

  const getFeeTypeInfo = (feeType: string) => {
    return feeTypeOptions.find((opt) => opt.value === feeType) || {
      value: feeType,
      label: feeType,
      icon: "file-text",
      color: "#9CA3AF",
    };
  };

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
  const subtotalCustomFees = customFees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const subtotalDamageFees = damageFees.reduce((sum, f) => sum + (f.amount || 0), 0);
  const subtotalFees = subtotalCustomFees + subtotalDamageFees;
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

  const addDamageRow = () => {
    if (isSubmitting) return;
    setDamageFees((prev) => [
      ...prev,
      { damageType: "", amount: 0, additionalNotes: "" },
    ]);
  };

  const removeDamageRow = (index: number) => {
    if (isSubmitting) return;
    setDamageFees((prev) => prev.filter((_, i) => i !== index));
  };

  const updateDamageField = (
    index: number,
    key: keyof DamageFee,
    value: string
  ) => {
    setDamageFees((prev) => {
      const next = [...prev];
      if (key === "amount") {
        const num = parseInt(value || "0", 10);
        next[index].amount = isNaN(num) ? 0 : num;
      } else if (key === "damageType") {
        next[index].damageType = value;
      } else if (key === "additionalNotes") {
        next[index].additionalNotes = value;
      }
      return next;
    });
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Phí bổ sung"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={4} totalSteps={4} />

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.heroIcon}>
              <AntDesign name="wallet" size={24} color="#14121F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Phí bổ sung</Text>
              <Text style={styles.heroSubtitle}>
                Thêm các loại phí phát sinh trong quá trình thuê xe
              </Text>
            </View>
          </View>
        </View>

        {/* Damage Fees Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIconContainer}>
              <AntDesign name="warning" size={18} color="#FF6B6B" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Phí hư hỏng</Text>
              <Text style={styles.sectionSubtitle}>
                {damageFees.length} {damageFees.length === 1 ? "hư hỏng" : "hư hỏng"} đã thêm
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabled]}
            onPress={addDamageRow}
            disabled={isSubmitting}
          >
            <AntDesign name="plus" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {damageFees.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <AntDesign name="warning" size={32} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>Chưa có hư hỏng nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Nhấn nút + để thêm hư hỏng
            </Text>
          </View>
        ) : (
          damageFees.map((damage, index) => (
            <View key={index} style={styles.damageCard}>
              <View style={styles.damageCardHeader}>
                <View style={styles.damageCardHeaderLeft}>
                  <View style={styles.damageBadge}>
                    <AntDesign name="warning" size={14} color="#FF6B6B" />
                    <Text style={styles.damageBadgeText}>
                      Hư hỏng #{index + 1}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeDamageBtn}
                  onPress={() => removeDamageRow(index)}
                  disabled={isSubmitting}
                >
                  <AntDesign name="close-circle" size={20} color="#FF6B6B" />
                </TouchableOpacity>
              </View>

              <View style={styles.damageForm}>
                <View style={styles.damageFormRow}>
                  <Text style={styles.damageInputLabel}>Loại hư hỏng</Text>
                  <TouchableOpacity
                    style={[styles.damageSelectBox, isSubmitting && styles.disabled]}
                    activeOpacity={0.8}
                    disabled={isSubmitting}
                    onPress={() =>
                      setOpenDamageIdx(openDamageIdx === index ? null : index)
                    }
                  >
                    <Text style={styles.damageSelectText}>
                      {damage.damageType || "Chọn loại hư hỏng"}
                    </Text>
                    <AntDesign
                      name={openDamageIdx === index ? "up" : "down"}
                      size={14}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                  {openDamageIdx === index && (
                    <View style={styles.damageDropdown}>
                      <ScrollView
                        style={styles.damageDropdownScroll}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                      >
                        {damageTypeOptions.map((opt) => (
                          <TouchableOpacity
                            key={opt.damageType}
                            style={styles.damageDropdownItem}
                            onPress={() => {
                              updateDamageField(index, "damageType", opt.damageType);
                              setOpenDamageIdx(null);
                            }}
                          >
                            <Text style={styles.damageDropdownItemText}>
                              {opt.displayText}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={styles.damageFormRow}>
                  <Text style={styles.damageInputLabel}>Số tiền (VND)</Text>
                  <View style={styles.damageAmountInputContainer}>
                    <TextInput
                      style={styles.damageAmountInput}
                      placeholder="0"
                      placeholderTextColor={colors.text.secondary}
                      keyboardType="numeric"
                      value={String(damage.amount || 0)}
                      onChangeText={(t) => updateDamageField(index, "amount", t)}
                      editable={!isSubmitting}
                    />
                    <View style={styles.damageAmountBadge}>
                      <Text style={styles.damageAmountBadgeText}>VND</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.damageFormRow}>
                  <Text style={styles.damageInputLabel}>Ghi chú bổ sung</Text>
                  <TextInput
                    style={[styles.damageNotesInput, styles.damageTextArea]}
                    placeholder="Mô tả chi tiết về hư hỏng..."
                    placeholderTextColor={colors.text.secondary}
                    value={damage.additionalNotes}
                    onChangeText={(t) =>
                      updateDamageField(index, "additionalNotes", t)
                    }
                    editable={!isSubmitting}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </View>
            </View>
          ))
        )}

        {/* Additional Fees Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionIconContainer, { backgroundColor: "rgba(201,182,255,0.15)" }]}>
              <AntDesign name="plus-circle" size={18} color="#C9B6FF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Phí bổ sung khác</Text>
              <Text style={styles.sectionSubtitle}>
                {customFees.length} {customFees.length === 1 ? "phí" : "phí"} đã thêm
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabled]}
            onPress={addFeeRow}
            disabled={isSubmitting}
          >
            <AntDesign name="plus" size={16} color="#C9B6FF" />
          </TouchableOpacity>
        </View>

        {customFees.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <AntDesign name="file-text" size={32} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>Chưa có phí bổ sung nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Nhấn nút + để thêm phí bổ sung
            </Text>
          </View>
        ) : (
          customFees.map((fee, index) => {
            const feeInfo = getFeeTypeInfo(fee.feeType);
            return (
              <View key={index} style={styles.feeCard}>
                <View style={styles.feeCardHeader}>
                  <View style={styles.feeCardHeaderLeft}>
                    <View
                      style={[
                        styles.feeIconContainer,
                        { backgroundColor: `${feeInfo.color}20` },
                      ]}
                    >
                      <AntDesign
                        name={feeInfo.icon as any}
                        size={18}
                        color={feeInfo.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.feeCardTitle}>
                        {fee.feeType ? feeInfo.label : "Chọn loại phí"}
                      </Text>
                      {fee.amount > 0 && (
                        <Text style={styles.feeCardAmount}>
                          {formatCurrency(fee.amount)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.removeFeeBtn}
                    onPress={() => removeFeeRow(index)}
                    disabled={isSubmitting}
                  >
                    <AntDesign name="close-circle" size={20} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>

                <View style={styles.feeCardBody}>
                  <View style={styles.feeFormRow}>
                    <Text style={styles.feeInputLabel}>Loại phí</Text>
                    <TouchableOpacity
                      style={[styles.feeSelectBox, isSubmitting && styles.disabled]}
                      activeOpacity={0.8}
                      disabled={isSubmitting}
                      onPress={() =>
                        setOpenTypeIdx(openTypeIdx === index ? null : index)
                      }
                    >
                      <Text style={styles.feeSelectText}>
                        {fee.feeType || "Chọn loại phí"}
                      </Text>
                      <AntDesign
                        name={openTypeIdx === index ? "up" : "down"}
                        size={14}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    {openTypeIdx === index && (
                      <View style={styles.feeDropdown}>
                        {feeTypeOptions.map((opt) => (
                          <TouchableOpacity
                            key={opt.value}
                            style={styles.feeDropdownItem}
                            onPress={() => {
                              updateFeeField(index, "feeType", opt.value);
                              setOpenTypeIdx(null);
                            }}
                          >
                            <View style={styles.feeDropdownItemLeft}>
                              <View
                                style={[
                                  styles.feeDropdownIcon,
                                  { backgroundColor: `${opt.color}20` },
                                ]}
                              >
                                <AntDesign
                                  name={opt.icon as any}
                                  size={14}
                                  color={opt.color}
                                />
                              </View>
                              <Text style={styles.feeDropdownItemText}>
                                {opt.label}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>

                  <View style={styles.feeFormRow}>
                    <Text style={styles.feeInputLabel}>Số tiền (VND)</Text>
                    <View style={styles.feeAmountInputContainer}>
                      <TextInput
                        style={styles.feeAmountInput}
                        placeholder="0"
                        placeholderTextColor={colors.text.secondary}
                        keyboardType="numeric"
                        value={String(fee.amount || 0)}
                        onChangeText={(t) => updateFeeField(index, "amount", t)}
                        editable={!isSubmitting}
                      />
                      <View style={styles.feeAmountBadge}>
                        <Text style={styles.feeAmountBadgeText}>VND</Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.feeFormRow}>
                    <Text style={styles.feeInputLabel}>Mô tả (tùy chọn)</Text>
                    <TextInput
                      style={[styles.feeNotesInput, styles.feeTextArea]}
                      placeholder="Ghi chú ngắn về phí này..."
                      placeholderTextColor={colors.text.secondary}
                      value={fee.description}
                      onChangeText={(t) =>
                        updateFeeField(index, "description", t)
                      }
                      editable={!isSubmitting}
                      multiline
                      numberOfLines={2}
                    />
                  </View>
                </View>
              </View>
            );
          })
        )}

        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <View style={styles.summaryHeaderIcon}>
              <AntDesign name="calculator" size={20} color="#C9B6FF" />
            </View>
            <Text style={styles.summaryHeaderTitle}>Tổng kết</Text>
          </View>

          {damageFees.length > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryRowLeft}>
                <AntDesign name="warning" size={14} color="#FF6B6B" />
                <Text style={styles.summaryLabel}>Tổng phí hư hỏng</Text>
              </View>
              <Text style={[styles.summaryValue, { color: "#FF6B6B" }]}>
                {formatCurrency(subtotalDamageFees)}
              </Text>
            </View>
          )}

          {customFees.length > 0 && (
            <View style={styles.summaryRow}>
              <View style={styles.summaryRowLeft}>
                <AntDesign name="plus-circle" size={14} color="#C9B6FF" />
                <Text style={styles.summaryLabel}>Tổng phí bổ sung</Text>
              </View>
              <Text style={[styles.summaryValue, { color: "#C9B6FF" }]}>
                {formatCurrency(subtotalCustomFees)}
              </Text>
            </View>
          )}

          <View style={styles.summaryDivider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Tổng phí bổ sung</Text>
            <Text style={styles.summaryTotalValue}>
              {formatCurrency(subtotalFees)}
            </Text>
          </View>
        </View>

        {/* Generate Report Button */}
        <TouchableOpacity
          style={[styles.generateButton, isSubmitting && styles.disabled]}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.generateButtonText}>Đang tạo...</Text>
            </>
          ) : (
            <Text style={styles.generateButtonText}>Thêm phí phát sinh</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal while submitting */}
      <Modal transparent visible={isSubmitting} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang thêm phí phát sinh</Text>
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
    gap: 12,
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD666",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,107,107,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  emptyStateCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2D36",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  damageCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  damageCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  damageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageBadgeText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  removeDamageBtn: {
    padding: 4,
  },
  damageForm: {
    gap: 12,
  },
  damageFormRow: {
    marginBottom: 4,
  },
  damageInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: "600",
  },
  damageSelectBox: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  damageSelectText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  damageDropdown: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    marginTop: 8,
    maxHeight: 200,
    overflow: "hidden",
  },
  damageDropdownScroll: {
    maxHeight: 200,
  },
  damageDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D36",
  },
  damageDropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  damageAmountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  damageAmountInput: {
    flex: 1,
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#2A2D36",
  },
  damageAmountBadge: {
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageAmountBadgeText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "700",
  },
  damageNotesInput: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2D36",
    minHeight: 80,
    textAlignVertical: "top",
  },
  damageTextArea: {
    minHeight: 80,
  },
  feeCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
  },
  feeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  feeCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  feeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  feeCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  feeCardAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9B6FF",
  },
  removeFeeBtn: {
    padding: 4,
  },
  feeCardBody: {
    gap: 12,
  },
  feeFormRow: {
    marginBottom: 4,
  },
  feeInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: "600",
  },
  feeSelectBox: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeSelectText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  feeDropdown: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    marginTop: 8,
    overflow: "hidden",
  },
  feeDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D36",
  },
  feeDropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feeDropdownIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  feeDropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  feeAmountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feeAmountInput: {
    flex: 1,
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#2A2D36",
  },
  feeAmountBadge: {
    backgroundColor: "rgba(201,182,255,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  feeAmountBadgeText: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "700",
  },
  feeNotesInput: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2D36",
    minHeight: 60,
    textAlignVertical: "top",
  },
  feeTextArea: {
    minHeight: 60,
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
    backgroundColor: "#1A1D26",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  summaryHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#2A2D36",
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#C9B6FF",
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
