import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../../../../data/models/receipt/HandoverReceiptResponse";
import { AssignVehicleToBookingUseCase } from "../../../../../../domain/usecases/booking/AssignVehicleToBookingUseCase";
import { CreateReceiptUseCase } from "../../../../../../domain/usecases/receipt/CreateReceiptUseCase";
import Toast from "react-native-toast-message";
import { ChangeVehicleUseCase } from "../../../../../../domain/usecases/receipt/ChangeVehicleUseCase";

type PhotoTileProps = {
  uri: string | null;
  labelTop?: string;
  labelBottom?: string;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
  onPress: () => void;
  isPrimary?: boolean;
};

const PhotoTile: React.FC<PhotoTileProps> = ({
  uri,
  labelTop,
  labelBottom,
  placeholderTitle,
  placeholderSubtitle,
  onPress,
  isPrimary,
}) => {
  return (
    <TouchableOpacity
      style={[styles.tile, isPrimary && styles.tilePrimary]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.tileImage} />
          {labelBottom && (
            <View style={styles.retakeBadge}>
              <Text style={styles.retakeText}>{labelBottom}</Text>
            </View>
          )}
          {labelTop && <Text style={styles.tileTopLabel}>{labelTop}</Text>}
        </>
      ) : (
        <View style={styles.placeholderInner}>
          <AntDesign name="camera" size={26} color={colors.text.secondary} />
          {!!placeholderTitle && (
            <Text style={styles.placeholderTitle}>{placeholderTitle}</Text>
          )}
          {!!placeholderSubtitle && (
            <Text style={styles.placeholderSubtitle}>
              {placeholderSubtitle}
            </Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

type InspectionNav = StackNavigationProp<
  StaffStackParamList,
  "VehicleInspection"
>;

type VehicleInspectionScreenRouteProp = RouteProp<
  StaffStackParamList,
  "VehicleInspection"
>;

export const VehicleInspectionScreen: React.FC = () => {
  const route = useRoute<VehicleInspectionScreenRouteProp>();
  const {
    vehicleId,
    bookingId,
    currentOdometerKm,
    batteryHealthPercentage,
    isChangeVehicle,
  } = route.params || {};
  const navigation = useNavigation<InspectionNav>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>(
    {}
  );
  const [notes, setNotes] = useState("");
  const [startOdometerKm, setStartOdometerKm] = useState(
    currentOdometerKm?.toString() || ""
  );
  const [startBatteryPercentage, setStartBatteryPercentage] = useState(
    batteryHealthPercentage?.toString() || ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checklistRef = useRef<View>(null);

  const ensurePermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cam.status === "granted" && lib.status === "granted";
  };

  const openPicker = async (key: keyof typeof photos) => {
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert(
        "Permission required",
        "Please grant camera and media permissions."
      );
      return;
    }

    Alert.alert("Add photo", "Choose source", [
      {
        text: "Camera",
        onPress: async () => {
          const res = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });
          if (!res.canceled && res.assets?.[0]?.uri) {
            setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
          }
        },
      },
      {
        text: "Library",
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
            mediaTypes: ["images"],
          });
          if (!res.canceled && res.assets?.[0]?.uri) {
            setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
          }
        },
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const sections: {
    key: string;
    title: string;
    items: { label: string; key: string }[];
  }[] = [
    {
      key: "bodyPaint",
      title: "Thân xe & Sơn (10 mục)",
      items: [
        { label: "Vết xước hoặc lõm", key: "scratches_dents" },
        { label: "Tình trạng sơn", key: "paint_condition" },
        { label: "Căn chỉnh tấm", key: "panel_alignment" },
        { label: "Nhãn dán/decals", key: "stickers_decals" },
        { label: "Độ sạch tổng thể", key: "overall_cleanliness" },
      ],
    },
    {
      key: "batteryPower",
      title: "Pin & Hệ thống điện (4 mục)",
      items: [
        { label: "Pin được lắp chắc chắn", key: "battery_mounted" },
        { label: "Tình trạng cổng sạc", key: "charging_port" },
        { label: "Dây cáp nguyên vẹn", key: "cables_intact" },
      ],
    },
    {
      key: "cleanliness",
      title: "Đánh giá độ sạch (6 mục)",
      items: [
        { label: "Ghế và sàn sạch", key: "seat_floorboards" },
        { label: "Gương sạch", key: "mirrors_clean" },
        { label: "Chắn bùn sạch", key: "mudguards_clean" },
      ],
    },
    {
      key: "wheelsTires",
      title: "Bánh xe & Lốp (4 mục)",
      items: [
        { label: "Gai lốp OK", key: "tread_ok" },
        { label: "Áp suất OK", key: "pressure_ok" },
      ],
    },
    {
      key: "lights",
      title: "Đèn & Tín hiệu (6 mục)",
      items: [
        { label: "Đèn pha", key: "headlights" },
        { label: "Đèn xi nhan", key: "turn_signals" },
      ],
    },
    {
      key: "controls",
      title: "Điều khiển & Bảng điều khiển (8 mục)",
      items: [
        { label: "Còi hoạt động", key: "horn_works" },
        { label: "Đồng hồ tốc độ hoạt động", key: "speedo_works" },
      ],
    },
    {
      key: "safety",
      title: "Thiết bị an toàn (3 mục)",
      items: [
        { label: "Có mũ bảo hiểm", key: "helmet_available" },
        { label: "Có bộ dụng cụ", key: "toolkit_available" },
      ],
    },
  ];

  const toggleChecklistItem = (itemKey: string) => {
    setChecklistItems((prev) => ({
      ...prev,
      [itemKey]: !prev[itemKey],
    }));
  };

  const getCompletedCount = () => {
    return Object.values(checklistItems).filter(Boolean).length;
  };

  const getTotalCount = () => {
    return sections.reduce((total, section) => total + section.items.length, 0);
  };

  const getPhotosCount = () => {
    return Object.values(photos).filter(Boolean).length;
  };

  const getIssuesCount = () => {
    // Count unchecked items as issues
    return getTotalCount() - getCompletedCount();
  };

  const getCompletionPercentage = () => {
    const total = getTotalCount();
    return total > 0 ? Math.round((getCompletedCount() / total) * 100) : 0;
  };

  const getOverallCondition = () => {
    const percentage = getCompletionPercentage();
    if (percentage >= 90) return { text: "Tuyệt vời", color: "#67D16C" };
    if (percentage >= 70) return { text: "Tốt", color: "#FFD700" };
    if (percentage >= 50) return { text: "Trung bình", color: "#FF8C00" };
    return { text: "Cần kiểm tra", color: "#FF4444" };
  };

  const getBatteryCondition = () => {
    const battery = parseInt(startBatteryPercentage) || 0;
    if (battery >= 80)
      return { text: `${battery}% – Tuyệt vời`, color: "#67D16C" };
    if (battery >= 60) return { text: `${battery}% – Tốt`, color: "#FFD700" };
    if (battery >= 40)
      return { text: `${battery}% – Trung bình`, color: "#FF8C00" };
    return { text: `${battery}% – Thấp`, color: "#FF4444" };
  };

  const getPhotosStatus = () => {
    const photoCount = getPhotosCount();
    if (photoCount === 4) return { text: "Hoàn thành", color: "#67D16C" };
    if (photoCount >= 2) return { text: "Thiếu ảnh", color: "#FFD700" };
    return { text: "Cần chụp thêm", color: "#FF4444" };
  };

  const isReadyForHandover = () => {
    return (
      getPhotosCount() === 4 &&
      getCompletedCount() >= getTotalCount() * 0.8 &&
      startOdometerKm &&
      startBatteryPercentage
    );
  };

  const handleCompleteInspection = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!startOdometerKm || !startBatteryPercentage) {
        Alert.alert("Lỗi", "Vui lòng nhập số km và % pin bắt đầu");
        setIsSubmitting(false);
        return;
      }

      if (getPhotosCount() < 4) {
        Alert.alert(
          "Lỗi",
          "Vui lòng chụp đủ 4 ảnh xe (trước, sau, trái, phải)"
        );
        setIsSubmitting(false);
        return;
      }

      if (getCompletedCount() < getTotalCount() * 0.8) {
        Alert.alert(
          "Lỗi",
          "Vui lòng hoàn thành ít nhất 80% danh sách kiểm tra"
        );
        setIsSubmitting(false);
        return;
      }

      // Capture and add checklist file
      let checklistUri: string | null = null;
      if (checklistRef.current) {
        checklistUri = await captureRef(checklistRef.current, {
          format: "png",
          quality: 0.8,
          result: "tmpfile", // tạo file thật để upload
        });
      }

      if (isChangeVehicle) {
        const changeVehicleUseCase = new ChangeVehicleUseCase(
          sl.get("ReceiptRepository")
        );
        const changeVehicleResponse = await changeVehicleUseCase.execute({
          notes,
          startOdometerKm: parseInt(startOdometerKm),
          startBatteryPercentage: parseInt(startBatteryPercentage),
          bookingId,
          vehicleFiles: [
            photos.front,
            photos.back,
            photos.left,
            photos.right,
          ].filter(Boolean) as string[],
          checkListFile: checklistUri,
          vehicleId: vehicleId,
        });
        if (changeVehicleResponse.success) {
          Toast.show({
            text1: "Xe đã được thay đổi",
            type: "success",
          });
          navigation.reset({
            index: 0,
            routes: [{ name: "BookingDetails", params: { bookingId } }],
          });
        } else {
          Toast.show({
            text1: "Không thể thay đổi xe",
            type: "error",
          });
        }
      } else {
        const assignVehicleToBookingUseCase = new AssignVehicleToBookingUseCase(
          sl.get("BookingRepository")
        );

        await assignVehicleToBookingUseCase.execute(vehicleId, bookingId);

        const createReceiptUseCase = new CreateReceiptUseCase(
          sl.get("ReceiptRepository")
        );

        const handoverResponse = await createReceiptUseCase.execute({
          notes,
          startOdometerKm: parseInt(startOdometerKm),
          startBatteryPercentage: parseInt(startBatteryPercentage),
          bookingId,
          vehicleFiles: [
            photos.front,
            photos.back,
            photos.left,
            photos.right,
          ].filter(Boolean) as string[],
          checkListFile: checklistUri,
        });

        const receiptData: HandoverReceiptResponse =
          unwrapResponse(handoverResponse);

        Toast.show({
          text1: "Kiểm tra đã được hoàn thành và xe đã được gán cho đặt chỗ",
          type: "success",
        });

        navigation.navigate("HandoverReport", {
          receiptId: receiptData.id,
          notes: receiptData.notes,
          startOdometerKm: receiptData.startOdometerKm,
          startBatteryPercentage: receiptData.startBatteryPercentage,
          bookingId: receiptData.bookingId,
          vehicleFiles: receiptData.vehicleFiles,
          checkListFile: receiptData.checkListFile,
        });
      }
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
          title="Kiểm tra xe"
          subtitle="Chế độ kiểm tra trước"
          onBack={() => navigation.goBack()}
        />

        {/* Required Photos */}
        <View style={styles.photosCard}>
          <Text style={styles.cardHeader}>Ảnh bắt buộc</Text>
          <View style={styles.photosGrid}>
            <PhotoTile
              uri={photos.front}
              placeholderTitle="Mặt trước"
              placeholderSubtitle="Chạm để chụp"
              onPress={() => openPicker("front")}
              isPrimary
            />
            <PhotoTile
              uri={photos.back}
              placeholderTitle="Mặt sau"
              placeholderSubtitle="Chạm để chụp"
              onPress={() => openPicker("back")}
            />
            <PhotoTile
              uri={photos.left}
              placeholderTitle="Bên trái"
              placeholderSubtitle="Chạm để chụp"
              onPress={() => openPicker("left")}
            />
            <PhotoTile
              uri={photos.right}
              placeholderTitle="Bên phải"
              placeholderSubtitle="Chạm để chụp"
              onPress={() => openPicker("right")}
            />
          </View>
        </View>

        {/* Inspection Checklist - Accordions */}
        <View
          ref={checklistRef}
          style={styles.checklistContainer}
          collapsable={false}
        >
          <Text style={styles.checklistTitle}>Danh sách kiểm tra</Text>
          {sections.map((section) => {
            const isOpen = !!expanded[section.key];
            return (
              <View key={section.key} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [section.key]: !prev[section.key],
                    }))
                  }
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryTitle}>{section.title}</Text>
                  <AntDesign
                    name={isOpen ? "up" : "down"}
                    size={16}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.itemsContainer}>
                    {section.items.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.itemCard}
                        onPress={() => toggleChecklistItem(item.key)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.checkboxCircle,
                            checklistItems[item.key] && styles.checkboxChecked,
                          ]}
                        >
                          {checklistItems[item.key] && (
                            <AntDesign name="check" size={12} color="#FFFFFF" />
                          )}
                        </View>
                        <Text style={styles.itemText}>{item.label}</Text>
                      </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.addIssueRow}>
                      <AntDesign
                        name="exclamation-circle"
                        size={14}
                        color="#C9B6FF"
                      />
                      <Text style={styles.addIssueText}>Thêm vấn đề</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Inspection Inputs */}
        <View style={styles.inputCard}>
          <Text style={styles.cardHeader}>Thông tin kiểm tra</Text>

          {/* Notes Input */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Ghi chú</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Nhập ghi chú về tình trạng xe..."
              placeholderTextColor={colors.text.secondary}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Odometer Input */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Số km bắt đầu</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.numberInput}
                placeholder="Nhập số km"
                placeholderTextColor={colors.text.secondary}
                value={startOdometerKm}
                onChangeText={setStartOdometerKm}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>km</Text>
            </View>
          </View>

          {/* Battery Percentage Input */}
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Pin bắt đầu</Text>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.numberInput}
                placeholder="Nhập % pin"
                placeholderTextColor={colors.text.secondary}
                value={startBatteryPercentage}
                onChangeText={setStartBatteryPercentage}
                keyboardType="numeric"
              />
              <Text style={styles.inputUnit}>%</Text>
            </View>
          </View>
        </View>

        {/* Current Status Summary */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>
                {getCompletedCount()} / {getTotalCount()}
              </Text>
              <Text style={styles.statusCaption}>kiểm tra hoàn thành</Text>
            </View>
            <View style={styles.statusItem}>
              <Text
                style={[
                  styles.statusNumber,
                  { color: getIssuesCount() > 0 ? "#FF4444" : "#67D16C" },
                ]}
              >
                {getIssuesCount()}
              </Text>
              <Text style={styles.statusCaption}>vấn đề</Text>
            </View>
            <View style={styles.statusItem}>
              <Text
                style={[
                  styles.statusNumber,
                  { color: getPhotosCount() === 4 ? "#67D16C" : "#FFD700" },
                ]}
              >
                {getPhotosCount()}/4
              </Text>
              <Text style={styles.statusCaption}>ảnh</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.readyLabel}>
                {isReadyForHandover() ? "Sẵn sàng bàn giao" : "Chưa sẵn sàng"}
              </Text>
              <Text
                style={[
                  styles.progressPercentage,
                  { color: isReadyForHandover() ? "#67D16C" : "#FFD700" },
                ]}
              >
                {getCompletionPercentage()}%
              </Text>
            </View>
            <View style={styles.readyProgress}>
              <View
                style={[
                  styles.readyFill,
                  {
                    width: `${getCompletionPercentage()}%`,
                    backgroundColor: isReadyForHandover()
                      ? "#67D16C"
                      : "#FFD700",
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.timeRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Thời gian kiểm tra</Text>
            </View>
            <Text style={styles.timeText}>
              ~{Math.max(5, Math.round(getTotalCount() * 0.5))} phút
            </Text>
          </View>
        </View>

        {/* Inspection Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardHeader}>Tóm tắt kiểm tra</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tình trạng tổng thể</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: getOverallCondition().color },
              ]}
            >
              {getOverallCondition().text}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tình trạng pin</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: getBatteryCondition().color },
              ]}
            >
              {getBatteryCondition().text}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ảnh xe</Text>
            <Text
              style={[styles.summaryValue, { color: getPhotosStatus().color }]}
            >
              {getPhotosStatus().text}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vấn đề phát hiện</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: getIssuesCount() > 0 ? "#FF4444" : "#67D16C" },
              ]}
            >
              {getIssuesCount()} vấn đề cần xử lý
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Trạng thái bàn giao</Text>
            <View style={styles.statusBadge}>
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: isReadyForHandover() ? "#67D16C" : "#FFD700" },
                ]}
              >
                {isReadyForHandover() ? "✓ Sẵn sàng" : "⚠ Chưa sẵn sàng"}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Actions */}
        <TouchableOpacity
          style={[
            styles.primaryCta,
            (!isReadyForHandover() || isSubmitting) &&
              styles.primaryCtaDisabled,
          ]}
          onPress={handleCompleteInspection}
          disabled={!isReadyForHandover() || isSubmitting}
        >
          <Text
            style={[
              styles.primaryCtaText,
              (!isReadyForHandover() || isSubmitting) &&
                styles.primaryCtaTextDisabled,
            ]}
          >
            {isSubmitting
              ? "Đang gửi..."
              : isReadyForHandover()
              ? "Hoàn thành kiểm tra"
              : "Chưa sẵn sàng"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tertiaryCta}>
          <Text style={styles.tertiaryCtaText}>Lưu & Tiếp tục sau</Text>
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
  scrollContent: { paddingBottom: 40 },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  title: { color: colors.text.primary, fontSize: 16, fontWeight: "700" },
  subtitle: { color: colors.text.secondary, fontSize: 12, marginVertical: 8 },
  submeta: { color: colors.text.secondary, fontSize: 12 },
  titleRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8 },
  staffBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  staffText: { color: "#000", fontWeight: "700", fontSize: 12 },

  photosCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    height: 120,
    overflow: "hidden",
    position: "relative",
  },
  tilePrimary: { height: 120 },
  tileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholderInner: { flex: 1, alignItems: "center", justifyContent: "center" },
  placeholderTitle: {
    color: colors.text.secondary,
    marginTop: 10,
    textTransform: "lowercase",
  },
  placeholderSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 4,
  },
  retakeBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  retakeText: { color: "#fff", fontSize: 12 },
  tileTopLabel: {
    position: "absolute",
    bottom: 6,
    left: 8,
    color: "#fff",
    fontWeight: "600",
  },

  categoryCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 12,
    gap: 12,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.text.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: "#4CAF50",
    borderColor: "#4CAF50",
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
  },
  addIssueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 6,
    marginTop: 6,
  },
  addIssueText: { color: "#C9B6FF", fontSize: 14 },

  statusCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statusItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  statusNumber: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
  statusCaption: {
    color: colors.text.secondary,
    fontSize: 11,
    textAlign: "center",
    marginTop: 4,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  readyLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  progressPercentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  readyProgress: {
    height: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 5,
    overflow: "hidden",
  },
  readyFill: {
    height: 10,
    borderRadius: 5,
    // transition: "all 0.3s ease",
  },
  timeRow: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { color: colors.text.primary, fontSize: 12 },
  timeText: { color: colors.text.secondary, fontSize: 12 },

  summaryCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "right",
  },
  statusBadge: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  primaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCtaDisabled: {
    backgroundColor: "#3A3A3A",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryCtaText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  primaryCtaTextDisabled: {
    color: "#666666",
  },
  tertiaryCta: {
    marginHorizontal: 16,
    backgroundColor: "transparent",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#444444",
  },
  tertiaryCtaText: { color: colors.text.secondary, fontWeight: "600" },
  checklistContainer: {
    backgroundColor: "transparent",
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    marginHorizontal: 16,
  },
  inputCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputRow: {
    marginBottom: 12,
  },
  inputLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textArea: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    fontSize: 14,
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  numberInput: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 12,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    flex: 1,
  },
  inputUnit: {
    color: colors.text.secondary,
    fontSize: 14,
    marginLeft: 8,
  },
});
