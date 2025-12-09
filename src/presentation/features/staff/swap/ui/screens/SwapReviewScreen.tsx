import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Dimensions,
  StatusBar,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../../common/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { vehicleSwapDraftStore } from "../store/vehicleSwapDraftStore";
import { ChangeVehicleUseCase } from "../../../../../../domain/usecases/receipt/ChangeVehicleUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import Toast from "react-native-toast-message";
import { SwapVehicleReturnUseCase } from "../../../../../../domain/usecases/rentalReturn/SwapVehicleReturnUseCase";

type Nav = StackNavigationProp<StaffStackParamList, "SwapReview">;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const SwapReviewScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const [submitting, setSubmitting] = useState(false);
  const draft = vehicleSwapDraftStore.getDraft();
  const [checklistImageUri, setChecklistImageUri] = useState<string | null>(
    null
  );

  const handleConfirm = async () => {
    if (!draft.bookingId || !draft.newVehicle.vehicleId) {
      Toast.show({
        type: "error",
        text1: "Thiếu thông tin booking hoặc xe mới",
      });
      return;
    }
    setSubmitting(true);
    try {
      const swapVehicleReturnUseCase = new SwapVehicleReturnUseCase(
        sl.get("RentalReturnRepository")
      );
      const res = await swapVehicleReturnUseCase.execute({
        bookingId: draft.bookingId,
        returnReceiptId: draft.returnReceiptId,
        endOdometerKm: parseInt(draft.oldVehicle.odometer || "0") || 0,
        endBatteryPercentage: parseInt(draft.oldVehicle.battery || "0") || 0,
        notes: draft.oldVehicle.conditionNote || "",
        returnImageUrls: Object.values(draft.oldVehicle.photos).filter(
          Boolean
        ) as string[],
        checkListImage: draft.oldVehicle.checklistUri || "",
      });
      if (!res.success) {
        Toast.show({ type: "error", text1: res.message });
        return;
      }
      const changeVehicleUseCase = new ChangeVehicleUseCase(
        sl.get("ReceiptRepository")
      );
      const changeVehicleRes = await changeVehicleUseCase.execute({
        notes: draft.newVehicle.conditionNote || "Đổi xe",
        startOdometerKm: parseInt(draft.newVehicle.odometer || "0") || 0,
        startBatteryPercentage: parseInt(draft.newVehicle.battery || "0") || 0,
        bookingId: draft.bookingId,
        vehicleFiles: Object.values(draft.newVehicle.photos).filter(
          Boolean
        ) as string[],
        checkListFile: draft.newVehicle.checklistUri,
        vehicleId: draft.newVehicle.vehicleId,
      });

      if (changeVehicleRes.success) {
        Toast.show({ type: "success", text1: "Đã đổi xe thành công" });
        vehicleSwapDraftStore.clear();
        navigation.reset({
          index: 1,
          routes: [
            { name: "Rental" },
            { name: "BookingDetails", params: { bookingId: draft.bookingId } },
          ],
        });
      } else {
        Toast.show({ type: "error", text1: "Không thể đổi xe" });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error?.message || "Thử lại sau",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const renderVehicleCard = (
    vehicle: typeof draft.oldVehicle | typeof draft.newVehicle,
    isOld: boolean
  ) => {
    const theme = isOld
      ? {
          accent: "#FFB300",
          accentLight: "rgba(255,179,0,0.15)",
          accentBorder: "rgba(255,179,0,0.3)",
          iconBg: "rgba(255,179,0,0.15)",
          iconColor: "#FFB300",
        }
      : {
          accent: "#67D16C",
          accentLight: "rgba(103,209,108,0.15)",
          accentBorder: "rgba(103,209,108,0.3)",
          iconBg: "rgba(103,209,108,0.15)",
          iconColor: "#67D16C",
        };

    const photoEntries = Object.entries(vehicle.photos || {}).filter(
      ([, uri]) => !!uri
    );
    const photoLabels: Record<string, string> = {
      front: "Trước",
      back: "Sau",
      left: "Trái",
      right: "Phải",
    };

    return (
      <View style={[styles.vehicleCard, { borderColor: theme.accentBorder }]}>
        <View style={styles.vehicleCardHeader}>
          <View style={styles.vehicleCardHeaderLeft}>
            <View
              style={[
                styles.vehicleIconBadge,
                { backgroundColor: theme.iconBg },
              ]}
            >
              <AntDesign
                name={isOld ? "close-circle" : "check-circle"}
                size={20}
                color={theme.iconColor}
              />
            </View>
            <View>
              <Text style={styles.vehicleCardTitle}>
                {isOld ? "Xe cũ" : "Xe mới"}
              </Text>
              <Text style={styles.vehicleCardSubtitle}>
                {vehicle.licensePlate || "Chưa có biển"} ·{" "}
                {vehicle.modelName || "N/A"}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: theme.accentLight }]}
          >
            <Text style={[styles.statusBadgeText, { color: theme.accent }]}>
              {isOld ? "Thay thế" : "Mới"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <View style={styles.infoItemIcon}>
              <AntDesign name="dashboard" size={14} color="#7DB3FF" />
            </View>
            <View style={styles.infoItemContent}>
              <Text style={styles.infoItemLabel}>Số km</Text>
              <Text style={styles.infoItemValue}>
                {vehicle.odometer || "-"}
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <View style={styles.infoItemIcon}>
              <AntDesign name="thunderbolt" size={14} color="#FFD666" />
            </View>
            <View style={styles.infoItemContent}>
              <Text style={styles.infoItemLabel}>Pin/xăng</Text>
              <Text style={styles.infoItemValue}>
                {vehicle.battery || "-"}%
              </Text>
            </View>
          </View>
        </View>

        {vehicle.conditionNote && (
          <>
            <View style={styles.divider} />
            <View style={styles.noteSection}>
              <View style={styles.noteHeader}>
                <AntDesign
                  name="file-text"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.noteLabel}>Ghi chú</Text>
              </View>
              <Text style={styles.noteText}>{vehicle.conditionNote}</Text>
            </View>
          </>
        )}

        {photoEntries.length > 0 && (
          <>
            <View style={styles.divider} />
            <View style={styles.photosSection}>
              <View style={styles.photosHeader}>
                <AntDesign name="camera" size={14} color={theme.iconColor} />
                <Text style={styles.photosTitle}>
                  Ảnh ({photoEntries.length}/4)
                </Text>
              </View>
              <View style={styles.photoGrid}>
                {photoEntries.map(([key, uri]) => (
                  <View key={key} style={styles.photoItem}>
                    <Image source={{ uri }} style={styles.photoImage} />
                    <View
                      style={[
                        styles.photoLabelBadge,
                        { backgroundColor: theme.accentLight },
                      ]}
                    >
                      <Text
                        style={[styles.photoLabelText, { color: theme.accent }]}
                      >
                        {photoLabels[key] || key}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {vehicle.checklistUri && (
          <>
            <View style={styles.divider} />
            <View style={styles.checklistSection}>
              <View style={styles.checklistHeader}>
                <AntDesign
                  name="check-square"
                  size={14}
                  color={theme.iconColor}
                />
                <Text style={styles.checklistTitle}>Checklist kiểm tra</Text>
              </View>
              <TouchableOpacity
                style={styles.checklistImageContainer}
                onPress={() =>
                  setChecklistImageUri(vehicle.checklistUri || null)
                }
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: vehicle.checklistUri }}
                  style={styles.checklistImage}
                />
                <View style={styles.checklistOverlay}>
                  <View
                    style={[
                      styles.checklistViewBadge,
                      {
                        backgroundColor: theme.accent,
                        borderWidth: 2,
                        borderColor: "#FFFFFF",
                      },
                    ]}
                  >
                    <AntDesign name="eye" size={18} color="#FFFFFF" />
                    <Text
                      style={[styles.checklistViewText, { color: "#FFFFFF" }]}
                    >
                      Xem checklist
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenHeader
          title="Tổng hợp & Xác nhận"
          subtitle="Bước 4/4"
          onBack={() => navigation.goBack()}
        />

        {/* Swap Arrow Indicator */}
        <View style={styles.swapIndicator}>
          {renderVehicleCard(draft.oldVehicle, true)}
          <View style={styles.swapArrowContainer}>
            <View style={styles.swapArrowLine} />
            <View style={styles.swapArrowIcon}>
              <AntDesign name="swap" size={24} color="#C9B6FF" />
            </View>
            <View style={styles.swapArrowLine} />
          </View>
          {renderVehicleCard(draft.newVehicle, false)}
        </View>

        {/* License Plate Comparison */}
        <View style={styles.comparisonCard}>
          <View style={styles.comparisonHeader}>
            <View
              style={[
                styles.comparisonIconBadge,
                { backgroundColor: "rgba(201,182,255,0.15)" },
              ]}
            >
              <AntDesign name="idcard" size={18} color="#C9B6FF" />
            </View>
            <Text style={styles.comparisonTitle}>Thay đổi biển số</Text>
          </View>
          <View style={styles.comparisonContent}>
            <View style={styles.plateComparison}>
              <View style={[styles.plateBox, styles.plateBoxOld]}>
                <Text style={styles.plateValue}>
                  {draft.oldVehicle.licensePlate || "-"}
                </Text>
              </View>
              <AntDesign name="arrow-right" size={20} color="#C9B6FF" />
              <View style={[styles.plateBox, styles.plateBoxNew]}>
                <Text style={styles.plateValue}>
                  {draft.newVehicle.licensePlate || "-"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[styles.primary, submitting && styles.primaryDisabled]}
          onPress={handleConfirm}
          disabled={submitting}
          activeOpacity={0.8}
        >
          <View style={styles.primaryIconBadge}>
            <AntDesign name="check-circle" size={20} color="#0B0B0F" />
          </View>
          <Text style={styles.primaryText}>
            {submitting ? "Đang xử lý..." : "Xác nhận đổi xe"}
          </Text>
          {!submitting && (
            <AntDesign name="arrow-right" size={18} color="#0B0B0F" />
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Checklist Image Modal */}
      <Modal
        visible={!!checklistImageUri}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setChecklistImageUri(null)}
        statusBarTranslucent
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(0,0,0,0.95)"
        />
        <View style={styles.modalContainer}>
          <SafeAreaView style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalTitle}>Checklist kiểm tra</Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setChecklistImageUri(null)}
                activeOpacity={0.7}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          <ScrollView
            style={styles.modalImageScroll}
            maximumZoomScale={3}
            minimumZoomScale={1}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.modalImageContentContainer}
          >
            {checklistImageUri && (
              <Image
                source={{ uri: checklistImageUri }}
                style={styles.modalImage}
                resizeMode="contain"
              />
            )}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  swapIndicator: {
    marginHorizontal: 16,
    marginTop: 12,
    gap: 12,
  },
  vehicleCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  vehicleCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  vehicleCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  vehicleIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleCardTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  vehicleCardSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#1F2430",
    marginVertical: 16,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#232838",
  },
  infoItemIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "rgba(125,179,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  infoItemContent: {
    flex: 1,
  },
  infoItemLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    marginBottom: 2,
  },
  infoItemValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  noteSection: {
    gap: 8,
  },
  noteHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  noteLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "600",
  },
  noteText: {
    color: colors.text.primary,
    fontSize: 14,
    lineHeight: 20,
  },
  photosSection: {
    gap: 12,
  },
  photosHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  photosTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoItem: {
    width: "48%",
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#232838",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  photoLabelBadge: {
    position: "absolute",
    bottom: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  photoLabelText: {
    fontSize: 11,
    fontWeight: "700",
  },
  swapArrowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: -6,
  },
  swapArrowLine: {
    flex: 1,
    height: 2,
    backgroundColor: "#C9B6FF",
  },
  swapArrowIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1B1F2A",
    borderWidth: 2,
    borderColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  comparisonCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  comparisonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  comparisonIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  comparisonTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  comparisonContent: {
    marginTop: 8,
  },
  plateComparison: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  plateBox: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    alignItems: "center",
    gap: 8,
  },
  plateBoxOld: {
    backgroundColor: "rgba(255,179,0,0.08)",
    borderColor: "rgba(255,179,0,0.3)",
  },
  plateBoxNew: {
    backgroundColor: "rgba(103,209,108,0.08)",
    borderColor: "rgba(103,209,108,0.3)",
  },
  plateLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  plateValue: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 1,
  },
  detailsCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  detailsCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  detailsIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  detailsTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  inputSection: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  inputLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: "#232838",
    fontSize: 14,
    minHeight: 80,
  },
  priceInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  priceInput: {
    flex: 1,
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: "#232838",
    fontSize: 16,
    fontWeight: "600",
  },
  priceUnitBadge: {
    backgroundColor: "rgba(255,214,102,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 60,
    alignItems: "center",
  },
  priceUnitText: {
    color: "#FFD666",
    fontSize: 12,
    fontWeight: "700",
  },
  priceHint: {
    color: "#FFD666",
    fontSize: 13,
    fontWeight: "600",
    marginTop: 8,
  },
  primary: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryDisabled: {
    opacity: 0.6,
  },
  primaryIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(11,11,15,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#0B0B0F",
    fontWeight: "700",
    fontSize: 16,
  },
  checklistSection: {
    gap: 12,
  },
  checklistHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checklistTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  checklistImageContainer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    borderWidth: 1,
    borderColor: "#232838",
  },
  checklistImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  checklistOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  checklistViewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checklistViewText: {
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.95)",
  },
  modalHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalImageScroll: {
    flex: 1,
  },
  modalImageContentContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.8,
  },
});
