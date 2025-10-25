import React, { useState, useRef } from "react";
import * as MediaLibrary from "expo-media-library";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { captureRef } from "react-native-view-shot";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

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

export const VehicleInspectionScreen: React.FC = () => {
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
  const [isCapturing, setIsCapturing] = useState(false);
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
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
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

  const captureChecklistScreenshot = async () => {
    try {
      setIsCapturing(true);

      // Wait a bit to ensure the view is fully rendered
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!checklistRef.current) {
        Alert.alert("Lỗi", "Không thể chụp ảnh checklist - ref không tồn tại");
        return;
      }

      console.log("Attempting to capture checklist...");

      const uri = await captureRef(checklistRef.current, {
        format: "png",
        quality: 0.8,
        result: "tmpfile",
      });

      console.log("Checklist screenshot captured:", uri);

      // 🔹 Copy ảnh từ temp sang thư viện
      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Checklists", asset, false);
      console.log("✅ Ảnh đã lưu vào thư viện:", asset.uri);

      Alert.alert(
        "Thành công",
        "Ảnh checklist đã được lưu vào thư viện của bạn 🎉",
        [{ text: "Đóng", style: "cancel" }]
      );

      // Save to database via API
      // await saveChecklistToDatabase(uri, checklistItems);
    } catch (error) {
      console.error("Error capturing checklist:", error);
      Alert.alert("Lỗi", `Không thể chụp ảnh checklist: ${error.message}`);
    } finally {
      setIsCapturing(false);
    }
  };

  const saveChecklistToDatabase = async (
    screenshotUri: string,
    checklistData: Record<string, boolean>
  ) => {
    try {
      // Prepare data for API
      const inspectionData = {
        vehicleId: "VEHICLE_001", // This should come from props or context
        staffId: "STAFF_001", // This should come from auth context
        inspectionDate: new Date().toISOString(),
        completedItems: getCompletedCount(),
        totalItems: getTotalCount(),
        completionPercentage: Math.round(
          (getCompletedCount() / getTotalCount()) * 100
        ),
        checklistData: checklistData,
        screenshotUri: screenshotUri,
        photos: {
          front: photos.front,
          back: photos.back,
          left: photos.left,
          right: photos.right,
        },
      };

      console.log("Saving inspection data to API:", inspectionData);

      // TODO: Replace with actual API endpoint
      const response = await fetch("https://api.emotorent.com/inspections", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer YOUR_TOKEN_HERE", // Get from auth context
        },
        body: JSON.stringify(inspectionData),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Inspection saved successfully:", result);
    } catch (error) {
      console.error("Error saving to database:", error);
      throw error;
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
              <View key={section.key} style={styles.accordion}>
                <TouchableOpacity
                  style={styles.accordionHeader}
                  onPress={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [section.key]: !prev[section.key],
                    }))
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.accordionTitle}>{section.title}</Text>
                  <AntDesign
                    name={isOpen ? "up" : "down"}
                    size={14}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>

                {isOpen && (
                  <View style={styles.checklistWrap}>
                    {section.items.map((item, idx) => (
                      <TouchableOpacity
                        key={idx}
                        style={styles.checkItemRow}
                        onPress={() => toggleChecklistItem(item.key)}
                      >
                        <Text style={styles.checkItemText}>{item.label}</Text>
                        {checklistItems[item.key] ? (
                          <AntDesign
                            name="check-circle"
                            size={18}
                            color="#67D16C"
                          />
                        ) : (
                          <View style={styles.pendingCircle} />
                        )}
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
              <Text style={styles.statusNumber}>0</Text>
              <Text style={styles.statusCaption}>vấn đề</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>0</Text>
              <Text style={styles.statusCaption}>tạm giữ</Text>
            </View>
          </View>
          <Text style={styles.readyLabel}>Sẵn sàng bàn giao</Text>
          <View style={styles.readyProgress}>
            <View
              style={[
                styles.readyFill,
                { width: `${(getCompletedCount() / getTotalCount()) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.timeRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Thời gian kiểm tra</Text>
            </View>
            <Text style={styles.timeText}>12 phút</Text>
          </View>
        </View>

        {/* Inspection Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardHeader}>Tóm tắt kiểm tra</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tình trạng tổng thể</Text>
            <Text style={styles.okText}>Tuyệt vời</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tình trạng pin</Text>
            <Text style={styles.okText}>92% – Tuyệt vời</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Ảnh</Text>
            <Text style={styles.okText}>Sẵn sàng bàn giao</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Vấn đề phát hiện</Text>
            <Text style={styles.summaryValue}>0 nghiêm trọng, 0 nhỏ</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => navigation.navigate("HandoverReport")}
        >
          <Text style={styles.primaryCtaText}>Hoàn thành kiểm tra</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.secondaryCta, isCapturing && styles.disabledButton]}
          onPress={captureChecklistScreenshot}
          disabled={isCapturing}
        >
          <Text style={styles.secondaryCtaText}>
            {isCapturing ? "Đang chụp ảnh..." : "Chụp ảnh checklist"}
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
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
    marginTop: 10,
  },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  statusItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
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

  accordion: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  checklistWrap: { marginTop: 10 },
  checkItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  checkItemText: { color: colors.text.primary, fontSize: 14 },
  pendingCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#3A3A3A",
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
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusNumber: {
    color: colors.text.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  statusCaption: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  readyLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  readyProgress: { height: 8, backgroundColor: "#3A3A3A", borderRadius: 4 },
  readyFill: { height: 8, backgroundColor: "#67D16C", borderRadius: 4 },
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
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { color: colors.text.secondary, fontSize: 12 },
  okText: { color: "#67D16C", fontWeight: "600" },
  summaryValue: { color: colors.text.primary },

  primaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  primaryCtaText: { color: "#000", fontWeight: "700" },
  secondaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  secondaryCtaText: { color: colors.text.primary, fontWeight: "600" },
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
    paddingHorizontal: 16,
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  disabledButton: {
    opacity: 0.6,
  },
});
