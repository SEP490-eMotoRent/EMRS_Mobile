import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  Animated,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../../../../common/theme/colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { vehicleSwapDraftStore, SwapPhotoMap } from "../store/vehicleSwapDraftStore";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
type Nav = StackNavigationProp<StaffStackParamList, "SwapOldVehicle">;
type Route = RouteProp<StaffStackParamList, "SwapOldVehicle">;

const photoKeys: Array<keyof SwapPhotoMap> = ["front", "back", "left", "right"];

type ChecklistSection = {
  key: string;
  title: string;
  items: { key: string; label: string }[];
};

type PhotoTileProps = {
  uri: string | null;
  title: string;
  subtitle?: string;
  onPress: () => void;
  isPrimary?: boolean;
};

const PhotoTile: React.FC<PhotoTileProps> = ({
  uri,
  title,
  subtitle,
  onPress,
  isPrimary,
}) => {
  return (
    <TouchableOpacity
      style={[styles.tile, isPrimary && styles.tilePrimary]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.tileImage} />
          <View style={styles.retakeBadge}>
            <AntDesign name="camera" size={12} color="#fff" />
            <Text style={styles.retakeText}>Chạm để chụp lại</Text>
          </View>
          <Text style={styles.tileLabel}>{title}</Text>
        </>
      ) : (
        <View style={styles.placeholderInner}>
          <AntDesign name="camera" size={22} color={colors.text.secondary} />
          <Text style={styles.placeholderTitle}>{title}</Text>
          {!!subtitle && (
            <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

export const SwapOldVehicleScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const draft = vehicleSwapDraftStore.getDraft();
  const { startOldVehicleOdometerKm, newVehicleOdometerKm, newVehicleBatteryPercentage } = route.params;
  const [odometer, setOdometer] = useState(startOldVehicleOdometerKm?.toString() || "");
  const [battery, setBattery] = useState(draft.oldVehicle.battery || "");
  const [note, setNote] = useState(draft.oldVehicle.conditionNote || "");
  const [photos, setPhotos] = useState<SwapPhotoMap>(draft.oldVehicle.photos || {});
  const [checklistItems, setChecklistItems] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<{
    photos?: string;
    odometer?: string;
    battery?: string;
    checklist?: string;
  }>({});
  const checklistRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const photosShakeAnim = useRef(new Animated.Value(0)).current;
  const odometerShakeAnim = useRef(new Animated.Value(0)).current;
  const batteryShakeAnim = useRef(new Animated.Value(0)).current;
  const checklistShakeAnim = useRef(new Animated.Value(0)).current;

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

  const shakeError = (animValue: Animated.Value) => {
    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};
    let isValid = true;

    // Validate photos
    const photosCount = Object.values(photos).filter(Boolean).length;
    if (photosCount < 4) {
      newErrors.photos = "Vui lòng chụp đủ 4 ảnh xe (trước, sau, trái, phải)";
      isValid = false;
      shakeError(photosShakeAnim);
    }

    // Validate odometer
    if (!odometer || odometer.trim() === "") {
      newErrors.odometer = "Vui lòng nhập số km hiện tại";
      isValid = false;
      shakeError(odometerShakeAnim);
    } else {
      const odometerNum = parseInt(odometer);
      if (isNaN(odometerNum) || odometerNum < 0) {
        newErrors.odometer = "Số km phải là số hợp lệ (≥ 0)";
        isValid = false;
        shakeError(odometerShakeAnim);
      } else if (startOldVehicleOdometerKm !== undefined && odometerNum < startOldVehicleOdometerKm) {
        newErrors.odometer = `Số km phải lớn hơn hoặc bằng số km đầu (${startOldVehicleOdometerKm} km)`;
        isValid = false;
        shakeError(odometerShakeAnim);
      }
    }

    // Validate battery
    if (!battery || battery.trim() === "") {
      newErrors.battery = "Vui lòng nhập % pin";
      isValid = false;
      shakeError(batteryShakeAnim);
    } else {
      const batteryNum = parseInt(battery);
      if (isNaN(batteryNum) || batteryNum < 0 || batteryNum > 100) {
        newErrors.battery = "Pin phải là số từ 0 đến 100";
        isValid = false;
        shakeError(batteryShakeAnim);
      }
    }

    // Validate checklist
    const totalChecklist = checklistSections.reduce(
      (sum, sec) => sum + sec.items.length,
      0
    );
    const completedChecklist = Object.values(checklistItems).filter(Boolean).length;
    if (completedChecklist < totalChecklist * 0.8) {
      newErrors.checklist = "Vui lòng hoàn thành ít nhất 80% danh sách kiểm tra";
      isValid = false;
      shakeError(checklistShakeAnim);
    }

    setErrors(newErrors);

    // Scroll to first error
    if (!isValid && scrollViewRef.current) {
      setTimeout(() => {
        if (newErrors.photos) {
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        } else if (newErrors.odometer || newErrors.battery) {
          scrollViewRef.current?.scrollTo({ y: 300, animated: true });
        } else if (newErrors.checklist) {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }
      }, 100);
    }

    return isValid;
  };

  const handleNext = () => {
    if (!validate()) {
      return;
    }

    const captureChecklist = async () => {
      if (!checklistRef.current) return null;
      try {
        const uri = await captureRef(checklistRef.current, {
          format: "png",
          quality: 0.8,
          result: "tmpfile",
        });
        return uri;
      } catch {
        return null;
      }
    };

    captureChecklist().then((checklistUri) => {
      vehicleSwapDraftStore.setOldVehicleInfo({
        odometer,
        battery,
        conditionNote: note,
        photos,
        checklistUri,
      });
      navigation.navigate("SwapNewVehicle", { newVehicleOdometerKm, newVehicleBatteryPercentage });
    });
  };

  const photosCount = Object.values(photos).filter(Boolean).length;

  const checklistSections: ChecklistSection[] = [
    {
      key: "exterior",
      title: "Ngoại thất",
      items: [
        { key: "scratch_dent", label: "Không trầy xước, móp méo" },
        { key: "paint_ok", label: "Sơn không bong tróc" },
        { key: "lights_ok", label: "Đèn pha/xi-nhan hoạt động" },
      ],
    },
    {
      key: "tires",
      title: "Lốp & Thắng",
      items: [
        { key: "tire_ok", label: "Lốp còn gai, không phù" },
        { key: "brake_ok", label: "Phanh hoạt động bình thường" },
      ],
    },
    {
      key: "battery",
      title: "Pin & Điện",
      items: [
        { key: "battery_mount", label: "Pin lắp chắc chắn" },
        { key: "charging_port", label: "Cổng sạc không hỏng" },
        { key: "cable_intact", label: "Dây sạc nguyên vẹn" },
      ],
    },
  ];

  const toggleChecklistItem = (key: string) => {
    setChecklistItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleSection = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const totalChecklist = checklistSections.reduce(
    (sum, sec) => sum + sec.items.length,
    0
  );
  const completedChecklist = Object.values(checklistItems).filter(Boolean).length;

  // Xóa lỗi khi điều kiện được thỏa mãn
  useEffect(() => {
    // Xóa photos error khi chụp đủ 4 ảnh
    if (photosCount === 4 && errors.photos) {
      setErrors((prev) => ({ ...prev, photos: undefined }));
    }
  }, [photosCount]);

  useEffect(() => {
    // Xóa checklist error khi hoàn thành 80%
    if (totalChecklist > 0 && completedChecklist >= totalChecklist * 0.8 && errors.checklist) {
      setErrors((prev) => ({ ...prev, checklist: undefined }));
    }
  }, [completedChecklist, totalChecklist]);

  useEffect(() => {
    // Xóa odometer error khi số km hợp lệ và >= startOdometerKm
    if (odometer && errors.odometer) {
      const odometerNum = parseInt(odometer);
      if (!isNaN(odometerNum) && odometerNum >= 0) {
        if (startOldVehicleOdometerKm === undefined || odometerNum >= startOldVehicleOdometerKm) {
          setErrors((prev) => ({ ...prev, odometer: undefined }));
        }
      }
    }
  }, [odometer, startOldVehicleOdometerKm]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView ref={scrollViewRef} contentContainerStyle={styles.content}>
        <ScreenHeader title="Xe cũ" subtitle="Bước 2/4 · Nhập thông tin xe cũ" onBack={() => navigation.goBack()} />

        <Animated.View style={[styles.photosCard, { transform: [{ translateX: photosShakeAnim }] }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="camera" size={18} color="#7CFFCB" />
              </View>
              <View>
                <Text style={styles.cardHeaderTitle}>Ảnh xe cũ</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  {photosCount}/4 ảnh đã chụp
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.photoStatusBadge,
                photosCount === 4
                  ? styles.photoStatusBadgeComplete
                  : styles.photoStatusBadgeIncomplete,
              ]}
            >
              <AntDesign
                name={photosCount === 4 ? "check-circle" : "clock-circle"}
                size={12}
                color={photosCount === 4 ? "#FFFFFF" : "#FFD700"}
              />
              <Text
                style={[
                  styles.photoStatusText,
                  photosCount === 4 && styles.photoStatusTextComplete,
                ]}
              >
                {photosCount === 4 ? "Hoàn thành" : "Thiếu ảnh"}
              </Text>
            </View>
          </View>

          <View style={styles.photoGrid}>
            <PhotoTile
              uri={photos.front}
              title="Mặt trước"
              subtitle="Chạm để chụp"
              onPress={() => openPicker("front")}
              isPrimary
            />
            <PhotoTile
              uri={photos.back}
              title="Mặt sau"
              subtitle="Chạm để chụp"
              onPress={() => openPicker("back")}
            />
            <PhotoTile
              uri={photos.left}
              title="Bên trái"
              subtitle="Chạm để chụp"
              onPress={() => openPicker("left")}
            />
            <PhotoTile
              uri={photos.right}
              title="Bên phải"
              subtitle="Chạm để chụp"
              onPress={() => openPicker("right")}
            />
          </View>
          {errors.photos && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamation-circle" size={14} color="#FF6B6B" />
              <Text style={styles.errorText}>{errors.photos}</Text>
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.card, { transform: [{ translateX: odometerShakeAnim }] }]}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIconInfo}>
                <AntDesign name="file-text" size={16} color="#FFD666" />
              </View>
              <Text style={styles.sectionTitle}>Thông tin xe cũ</Text>
            </View>
          </View>

          <Text style={styles.label}>Số km hiện tại</Text>
          <TextInput
            style={[styles.input, errors.odometer && styles.inputError]}
            keyboardType="numeric"
            placeholder="Nhập số km"
            placeholderTextColor={colors.text.secondary}
            value={odometer}
            onChangeText={(text) => {
              setOdometer(text);
              if (errors.odometer) {
                setErrors((prev) => ({ ...prev, odometer: undefined }));
              }
            }}
          />
          {errors.odometer && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamation-circle" size={14} color="#FF6B6B" />
              <Text style={styles.errorText}>{errors.odometer}</Text>
            </View>
          )}
          <Text style={styles.label}>Mức pin</Text>
          <Animated.View style={{ transform: [{ translateX: batteryShakeAnim }] }}>
            <TextInput
              style={[styles.input, errors.battery && styles.inputError]}
              keyboardType="numeric"
              placeholder="Nhập % pin"
              placeholderTextColor={colors.text.secondary}
              value={battery}
              onChangeText={(text) => {
                setBattery(text);
                if (errors.battery) {
                  setErrors((prev) => ({ ...prev, battery: undefined }));
                }
              }}
            />
            {errors.battery && (
              <View style={styles.errorContainer}>
                <AntDesign name="exclamation-circle" size={14} color="#FF6B6B" />
                <Text style={styles.errorText}>{errors.battery}</Text>
              </View>
            )}
          </Animated.View>
          <Text style={styles.label}>Ghi chú tình trạng</Text>
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Ví dụ: trầy nhẹ chắn bùn trái..."
            placeholderTextColor={colors.text.secondary}
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
        </Animated.View>

        <Animated.View style={[{ transform: [{ translateX: checklistShakeAnim }] }]} ref={checklistRef} collapsable={false}>
          <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIconInfo}>
                <AntDesign name="check-square" size={16} color="#C9B6FF" />
              </View>
              <Text style={styles.sectionTitle}>Checklist xe cũ</Text>
            </View>
            <View style={styles.progressBadge}>
              <Text style={styles.progressText}>
                {completedChecklist}/{totalChecklist}
              </Text>
            </View>
          </View>

          {checklistSections.map((section) => {
            const isOpen = !!expanded[section.key];
            const done = section.items.filter((i) => checklistItems[i.key]).length;
            return (
              <View key={section.key} style={styles.sectionCard}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleSection(section.key)}
                  activeOpacity={0.8}
                >
                  <View style={styles.sectionHeaderLeft}>
                    <AntDesign
                      name={done === section.items.length ? "check-circle" : "right-circle"}
                      size={14}
                      color={done === section.items.length ? "#67D16C" : colors.text.secondary}
                    />
                    <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
                    <Text style={styles.sectionHeaderMeta}>
                      {done}/{section.items.length}
                    </Text>
                  </View>
                  <AntDesign
                    name={isOpen ? "up" : "down"}
                    size={14}
                    color={colors.text.secondary}
                  />
                </TouchableOpacity>
                {isOpen && (
                  <View style={styles.itemsContainer}>
                    {section.items.map((item) => {
                      const checked = !!checklistItems[item.key];
                      return (
                        <TouchableOpacity
                          key={item.key}
                          style={[styles.itemRow, checked && styles.itemRowChecked]}
                          onPress={() => toggleChecklistItem(item.key)}
                          activeOpacity={0.8}
                        >
                          <View
                            style={[
                              styles.checkbox,
                              checked && styles.checkboxChecked,
                            ]}
                          >
                            {checked && <AntDesign name="check" size={12} color="#FFFFFF" />}
                          </View>
                          <Text
                            style={[
                              styles.itemText,
                              checked && styles.itemTextChecked,
                            ]}
                          >
                            {item.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
          {errors.checklist && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamation-circle" size={14} color="#FF6B6B" />
              <Text style={styles.errorText}>{errors.checklist}</Text>
            </View>
          )}
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.primary} onPress={handleNext}>
          <Text style={styles.primaryText}>Lưu xe cũ & Tiếp tục</Text>
          <AntDesign name="arrow-right" size={16} color="#000" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 32 },
  card: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#11131A",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    gap: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  photosCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderIconInfo: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "rgba(255,214,102,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  cardHeaderTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
  },
  cardHeaderSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  photoStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  photoStatusBadgeComplete: { backgroundColor: "rgba(103,209,108,0.15)" },
  photoStatusBadgeIncomplete: { backgroundColor: "rgba(255,211,102,0.15)" },
  photoStatusText: { color: "#FFD700", fontSize: 12, fontWeight: "700" },
  photoStatusTextComplete: { color: "#FFFFFF" },
  label: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  input: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 12,
    color: colors.text.primary,
    borderWidth: 1,
    borderColor: "#232838",
  },
  textarea: { minHeight: 80, textAlignVertical: "top" },
  sectionTitle: { color: colors.text.primary, fontWeight: "700", marginBottom: 8 },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: {
    width: "48%",
    backgroundColor: "#1B1F2A",
    borderRadius: 16,
    height: 140,
    overflow: "hidden",
    position: "relative",
    borderWidth: 2,
    borderColor: "#232838",
    borderStyle: "dashed",
  },
  tilePrimary: {
    height: 140,
    borderColor: "#7CFFCB",
    borderStyle: "solid",
  },
  tileImage: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholderInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderTitle: {
    color: colors.text.primary,
    marginTop: 4,
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderSubtitle: { color: colors.text.secondary, fontSize: 11 },
  retakeBadge: {
    position: "absolute",
    top: 6,
    left: 6,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  retakeText: { color: "#fff", fontSize: 12 },
  tileLabel: {
    position: "absolute",
    bottom: 6,
    left: 8,
    color: "#fff",
    fontWeight: "700",
  },
  primary: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: "#C9B6FF",
    borderRadius: 14,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryText: { color: "#000", fontWeight: "700" },
  progressBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
  },
  progressText: {
    color: "#C9B6FF",
    fontWeight: "700",
    fontSize: 12,
  },
  sectionCard: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#232838",
    marginBottom: 10,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  sectionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionHeaderTitle: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 14,
  },
  sectionHeaderMeta: { color: colors.text.secondary, fontSize: 12 },
  itemsContainer: { paddingHorizontal: 12, paddingBottom: 12, gap: 8 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#1B1F2A",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#232838",
  },
  itemRowChecked: {
    backgroundColor: "rgba(103,209,108,0.08)",
    borderColor: "rgba(103,209,108,0.3)",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#3A3A3A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1B1F2A",
  },
  checkboxChecked: {
    backgroundColor: "#67D16C",
    borderColor: "#67D16C",
  },
  itemText: { color: colors.text.primary, flex: 1, fontSize: 13, fontWeight: "500" },
  itemTextChecked: { color: "#67D16C", fontWeight: "700" },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,107,107,0.1)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  errorText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
    flex: 1,
  },
  inputError: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
    backgroundColor: "rgba(255,107,107,0.05)",
  },
});

