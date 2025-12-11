import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Animated,
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
import { UpdateHandoverReceiptUseCase } from "../../../../../../domain/usecases/receipt/UpdateHandoverReceiptUseCase";
import { useGetLastReceipt } from "../../../return/ui/hooks/useGetLastReceipt";

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
    isUpdateReceipt,
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
  const [errors, setErrors] = useState<{
    photos?: string;
    odometer?: string;
    battery?: string;
    checklist?: string;
  }>({});
  const checklistRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const photosCardRef = useRef<View>(null);
  const inputCardRef = useRef<View>(null);
  const checklistContainerRef = useRef<View>(null);
  const photosShakeAnim = useRef(new Animated.Value(0)).current;
  const odometerShakeAnim = useRef(new Animated.Value(0)).current;
  const batteryShakeAnim = useRef(new Animated.Value(0)).current;
  const checklistShakeAnim = useRef(new Animated.Value(0)).current;
  const [photosCardY, setPhotosCardY] = useState<number>(0);
  const [inputCardY, setInputCardY] = useState<number>(0);
  const [checklistContainerY, setChecklistContainerY] = useState<number>(0);
  const [hasFilledData, setHasFilledData] = useState(false);
  const { getLastReceipt } = useGetLastReceipt({ bookingId });

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
    const photosCount = getPhotosCount();
    if (photosCount < 4) {
      newErrors.photos = "Vui lòng chụp đủ 4 ảnh xe (trước, sau, trái, phải)";
      isValid = false;
      shakeError(photosShakeAnim);
    }
    // Validate odometer
    if (!startOdometerKm || startOdometerKm.trim() === "") {
      newErrors.odometer = "Vui lòng nhập số km bắt đầu";
      isValid = false;
      shakeError(odometerShakeAnim);
    } else {
      const odometerNum = parseInt(startOdometerKm);
      if (isNaN(odometerNum) || odometerNum < 0) {
        newErrors.odometer = "Số km phải là số hợp lệ (≥ 0)";
        isValid = false;
        shakeError(odometerShakeAnim);
      } else if (
        currentOdometerKm !== undefined &&
        odometerNum < currentOdometerKm
      ) {
        newErrors.odometer = `Số km bắt đầu phải lớn hơn hoặc bằng số km hiện tại (${currentOdometerKm} km)`;
        isValid = false;
        shakeError(odometerShakeAnim);
      }
    }

    // Validate battery
    if (!startBatteryPercentage || startBatteryPercentage.trim() === "") {
      newErrors.battery = "Vui lòng nhập % pin bắt đầu";
      isValid = false;
      shakeError(batteryShakeAnim);
    } else {
      const batteryNum = parseInt(startBatteryPercentage);
      if (isNaN(batteryNum) || batteryNum < 0 || batteryNum > 100) {
        newErrors.battery = "Pin phải là số từ 0 đến 100";
        isValid = false;
        shakeError(batteryShakeAnim);
      }
    }

    // Validate checklist
    const totalChecklist = getTotalCount();
    const completedChecklist = getCompletedCount();
    if (completedChecklist < totalChecklist * 0.8) {
      newErrors.checklist =
        "Vui lòng hoàn thành ít nhất 80% danh sách kiểm tra";
      isValid = false;
      shakeError(checklistShakeAnim);
    }

    setErrors(newErrors);

    // Scroll to first error
    if (!isValid && scrollViewRef.current) {
      setTimeout(() => {
        if (newErrors.photos && photosCardY > 0) {
          scrollViewRef.current?.scrollTo({
            y: photosCardY - 20,
            animated: true,
          });
        } else if (
          (newErrors.odometer || newErrors.battery) &&
          inputCardY > 0
        ) {
          scrollViewRef.current?.scrollTo({
            y: inputCardY - 20,
            animated: true,
          });
        } else if (newErrors.checklist && checklistContainerY > 0) {
          scrollViewRef.current?.scrollTo({
            y: checklistContainerY - 20,
            animated: true,
          });
        }
      }, 100);
    }

    return isValid;
  };

  // Auto-clear errors when conditions are met
  useEffect(() => {
    // Clear photos error when 4 photos are uploaded
    const photosCount = getPhotosCount();
    if (photosCount === 4 && errors.photos) {
      setErrors((prev) => ({ ...prev, photos: undefined }));
    }
  }, [photos, errors.photos]);

  useEffect(() => {
    // Clear checklist error when 80% is completed
    const totalChecklist = getTotalCount();
    const completedChecklist = getCompletedCount();
    if (
      totalChecklist > 0 &&
      completedChecklist >= totalChecklist * 0.8 &&
      errors.checklist
    ) {
      setErrors((prev) => ({ ...prev, checklist: undefined }));
    }
  }, [checklistItems, errors.checklist]);

  useEffect(() => {
    // Clear odometer error when value is valid
    if (startOdometerKm && errors.odometer) {
      const odometerNum = parseInt(startOdometerKm);
      const isValid = !isNaN(odometerNum) && odometerNum >= 0;
      const isGreaterThanCurrent =
        currentOdometerKm === undefined || odometerNum >= currentOdometerKm;

      if (isValid && isGreaterThanCurrent) {
        setErrors((prev) => ({ ...prev, odometer: undefined }));
      }
    }
  }, [startOdometerKm, currentOdometerKm, errors.odometer]);

  useEffect(() => {
    // Clear battery error when value is valid
    if (startBatteryPercentage && errors.battery) {
      const batteryNum = parseInt(startBatteryPercentage);
      const isValid =
        !isNaN(batteryNum) && batteryNum >= 0 && batteryNum <= 100;

      if (isValid) {
        setErrors((prev) => ({ ...prev, battery: undefined }));
      }
    }
  }, [startBatteryPercentage, errors.battery]);

  // Auto-fill data from last receipt when updating
  useEffect(() => {
    if (isUpdateReceipt && !hasFilledData) {
      const lastReceipt = getLastReceipt();
      if (lastReceipt) {
        // Fill photos from handOverVehicleImageFiles
        const vehicleFiles = lastReceipt.handOverVehicleImageFiles || [];
        if (vehicleFiles.length > 0) {
          setPhotos({
            front: vehicleFiles[0] || null,
            back: vehicleFiles[1] || null,
            left: vehicleFiles[2] || null,
            right: vehicleFiles[3] || null,
          });
        }

        // Fill odometer
        if (lastReceipt.startOdometerKm !== undefined) {
          setStartOdometerKm(lastReceipt.startOdometerKm.toString());
        }

        // Fill battery percentage
        if (lastReceipt.startBatteryPercentage !== undefined) {
          setStartBatteryPercentage(
            lastReceipt.startBatteryPercentage.toString()
          );
        }

        // Fill notes
        if (lastReceipt.notes) {
          setNotes(lastReceipt.notes);
        }

        setHasFilledData(true);
      }
    }
  }, [isUpdateReceipt, hasFilledData, getLastReceipt]);

  const handleCompleteInspection = async () => {
    // Prevent multiple submissions
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);

      // Validate all fields
      if (!validate()) {
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

      if (isUpdateReceipt) {
        const updateHandoverReceiptUseCase = new UpdateHandoverReceiptUseCase(
          sl.get("ReceiptRepository")
        );
        const updateHandoverReceiptResponse =
          await updateHandoverReceiptUseCase.execute({
            notes,
            startOdometerKm: parseInt(startOdometerKm),
            startBatteryPercentage: parseInt(startBatteryPercentage),
            id: getLastReceipt()?.id,
            vehicleFiles: [
              photos.front,
              photos.back,
              photos.left,
              photos.right,
            ].filter(Boolean) as string[],
            checkListFile: checklistUri,
          });
        console.log(
          "updateHandoverReceiptResponse",
          updateHandoverReceiptResponse
        );
        if (updateHandoverReceiptResponse.success) {
          Toast.show({
            text1: "Cập nhật thông tin bàn giao thành công",
            type: "success",
          });
          navigation.navigate("HandoverReport", {
            bookingId,
          });
        } else {
          Toast.show({
            text1: updateHandoverReceiptResponse.message,
            type: "error",
          });
        }
      } else {
        const assignVehicleToBookingUseCase = new AssignVehicleToBookingUseCase(
          sl.get("BookingRepository")
        );

        const assignVehicleResponse =
          await assignVehicleToBookingUseCase.execute(vehicleId, bookingId);
        if (!assignVehicleResponse.success) {
          Toast.show({
            text1: assignVehicleResponse.message,
            type: "error",
          });
          return;
        }

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
          bookingId,
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
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          title="Kiểm tra xe"
          subtitle="Chế độ kiểm tra trước"
          onBack={() => navigation.goBack()}
        />

        {/* Required Photos */}
        <Animated.View
          ref={photosCardRef}
          style={[
            styles.photosCard,
            { transform: [{ translateX: photosShakeAnim }] },
          ]}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setPhotosCardY(y);
          }}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="camera" size={18} color="#7CFFCB" />
              </View>
              <View>
                <Text style={styles.cardHeaderTitle}>Ảnh bắt buộc</Text>
                <Text style={styles.cardHeaderSubtitle}>
                  {getPhotosCount()}/4 ảnh đã chụp
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.photoStatusBadge,
                getPhotosCount() === 4
                  ? styles.photoStatusBadgeComplete
                  : styles.photoStatusBadgeIncomplete,
              ]}
            >
              <AntDesign
                name={getPhotosCount() === 4 ? "check-circle" : "clock-circle"}
                size={12}
                color={getPhotosCount() === 4 ? "#FFFFFF" : "#FFD700"}
              />
              <Text
                style={[
                  styles.photoStatusText,
                  getPhotosCount() === 4 && styles.photoStatusTextComplete,
                ]}
              >
                {getPhotosCount() === 4 ? "Hoàn thành" : "Thiếu ảnh"}
              </Text>
            </View>
          </View>
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
          {errors.photos && (
            <View style={styles.errorContainer}>
              <AntDesign name="exclamation-circle" size={14} color="#FF6B6B" />
              <Text style={styles.errorText}>{errors.photos}</Text>
            </View>
          )}
        </Animated.View>

        {/* Inspection Inputs */}
        <View
          ref={inputCardRef}
          style={styles.inputCard}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setInputCardY(y);
          }}
        >
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="file-text" size={18} color="#FFD666" />
              </View>
              <Text style={styles.cardHeaderTitle}>Thông tin kiểm tra</Text>
            </View>
          </View>

          {/* Notes Input */}
          <View style={styles.inputRow}>
            <View style={styles.inputLabelRow}>
              <AntDesign name="edit" size={14} color="#7CFFCB" />
              <Text style={styles.inputLabel}>Ghi chú</Text>
            </View>
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

          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Odometer Input */}
            <View style={styles.metricInput}>
              <View style={styles.inputLabelRow}>
                <AntDesign name="dashboard" size={14} color="#7DB3FF" />
                <Text style={styles.inputLabel}>Số km</Text>
              </View>
              <Animated.View
                style={[
                  styles.inputWithUnit,
                  { transform: [{ translateX: odometerShakeAnim }] },
                ]}
              >
                <TextInput
                  style={[
                    styles.numberInput,
                    errors.odometer && styles.numberInputError,
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  value={startOdometerKm}
                  onChangeText={(text) => {
                    setStartOdometerKm(text);
                    if (errors.odometer) {
                      // Error clearing handled by useEffect
                    }
                  }}
                  keyboardType="numeric"
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.inputUnit}>km</Text>
                </View>
              </Animated.View>
              {errors.odometer && (
                <View style={styles.errorContainer}>
                  <AntDesign
                    name="exclamation-circle"
                    size={14}
                    color="#FF6B6B"
                  />
                  <Text style={styles.errorText}>{errors.odometer}</Text>
                </View>
              )}
            </View>

            {/* Battery Percentage Input */}
            <View style={styles.metricInput}>
              <View style={styles.inputLabelRow}>
                <AntDesign
                  name="thunderbolt"
                  size={14}
                  color={getBatteryCondition().color}
                />
                <Text style={styles.inputLabel}>Pin</Text>
              </View>
              <Animated.View
                style={[
                  styles.inputWithUnit,
                  { transform: [{ translateX: batteryShakeAnim }] },
                ]}
              >
                <TextInput
                  style={[
                    styles.numberInput,
                    errors.battery && styles.numberInputError,
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  value={startBatteryPercentage}
                  onChangeText={(text) => {
                    setStartBatteryPercentage(text);
                    if (errors.battery) {
                      // Error clearing handled by useEffect
                    }
                  }}
                  keyboardType="numeric"
                />
                <View
                  style={[
                    styles.unitBadge,
                    {
                      backgroundColor:
                        getBatteryCondition().color === "#67D16C"
                          ? "rgba(103,209,108,0.15)"
                          : getBatteryCondition().color === "#FFD700"
                          ? "rgba(255,211,102,0.15)"
                          : "rgba(255,68,68,0.15)",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.inputUnit,
                      { color: getBatteryCondition().color },
                    ]}
                  >
                    %
                  </Text>
                </View>
              </Animated.View>
              {errors.battery && (
                <View style={styles.errorContainer}>
                  <AntDesign
                    name="exclamation-circle"
                    size={14}
                    color="#FF6B6B"
                  />
                  <Text style={styles.errorText}>{errors.battery}</Text>
                </View>
              )}
            </View>
          </View>
        </View>
        {/* Inspection Checklist - Accordions */}
        <Animated.View
          ref={checklistContainerRef}
          style={[{ transform: [{ translateX: checklistShakeAnim }] }]}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setChecklistContainerY(y);
          }}
        >
          <View
            ref={checklistRef}
            style={styles.checklistContainer}
            collapsable={false}
          >
            <View style={styles.checklistHeaderRow}>
              <View style={styles.checklistHeaderLeft}>
                <View style={styles.checklistHeaderIcon}>
                  <AntDesign name="check-square" size={18} color="#C9B6FF" />
                </View>
                <View>
                  <Text style={styles.checklistTitle}>Danh sách kiểm tra</Text>
                  <Text style={styles.checklistSubtitle}>
                    {getCompletedCount()}/{getTotalCount()} mục đã hoàn thành
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.completionBadge,
                  {
                    backgroundColor:
                      getCompletionPercentage() >= 80
                        ? "rgba(103,209,108,0.15)"
                        : "rgba(255,211,102,0.15)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.completionPercentage,
                    {
                      color:
                        getCompletionPercentage() >= 80 ? "#67D16C" : "#FFD700",
                    },
                  ]}
                >
                  {getCompletionPercentage()}%
                </Text>
              </View>
            </View>
            {sections.map((section) => {
              const isOpen = !!expanded[section.key];
              const sectionCompleted = section.items.filter(
                (item) => checklistItems[item.key]
              ).length;
              const sectionTotal = section.items.length;
              const sectionProgress =
                sectionTotal > 0
                  ? Math.round((sectionCompleted / sectionTotal) * 100)
                  : 0;

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
                    <View style={styles.categoryHeaderLeft}>
                      <View
                        style={[
                          styles.categoryIcon,
                          {
                            backgroundColor:
                              sectionProgress === 100
                                ? "rgba(103,209,108,0.15)"
                                : "rgba(201,182,255,0.15)",
                          },
                        ]}
                      >
                        <AntDesign
                          name={
                            sectionProgress === 100
                              ? "check-circle"
                              : "file-text"
                          }
                          size={16}
                          color={
                            sectionProgress === 100 ? "#67D16C" : "#C9B6FF"
                          }
                        />
                      </View>
                      <View style={styles.categoryTitleContainer}>
                        <Text style={styles.categoryTitle}>
                          {section.title}
                        </Text>
                        <Text style={styles.categoryProgress}>
                          {sectionCompleted}/{sectionTotal} hoàn thành
                        </Text>
                      </View>
                    </View>
                    <View style={styles.categoryHeaderRight}>
                      <View style={[styles.categoryProgressBar, { width: 60 }]}>
                        <View
                          style={[
                            styles.categoryProgressFill,
                            {
                              width: `${sectionProgress}%`,
                              backgroundColor:
                                sectionProgress === 100 ? "#67D16C" : "#C9B6FF",
                            },
                          ]}
                        />
                      </View>
                      <AntDesign
                        name={isOpen ? "up" : "down"}
                        size={16}
                        color={colors.text.secondary}
                      />
                    </View>
                  </TouchableOpacity>

                  {isOpen && (
                    <View style={styles.itemsContainer}>
                      {section.items.map((item, idx) => (
                        <TouchableOpacity
                          key={idx}
                          style={[
                            styles.itemCard,
                            checklistItems[item.key] && styles.itemCardChecked,
                          ]}
                          onPress={() => toggleChecklistItem(item.key)}
                          activeOpacity={0.8}
                        >
                          <View
                            style={[
                              styles.checkboxCircle,
                              checklistItems[item.key] &&
                                styles.checkboxChecked,
                            ]}
                          >
                            {checklistItems[item.key] && (
                              <AntDesign
                                name="check"
                                size={14}
                                color="#FFFFFF"
                              />
                            )}
                          </View>
                          <Text
                            style={[
                              styles.itemText,
                              checklistItems[item.key] &&
                                styles.itemTextChecked,
                            ]}
                          >
                            {item.label}
                          </Text>
                          {checklistItems[item.key] && (
                            <AntDesign
                              name="check-circle"
                              size={16}
                              color="#67D16C"
                            />
                          )}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
            {errors.checklist && (
              <View style={[styles.errorContainer, { marginHorizontal: 16 }]}>
                <AntDesign
                  name="exclamation-circle"
                  size={14}
                  color="#FF6B6B"
                />
                <Text style={styles.errorText}>{errors.checklist}</Text>
              </View>
            )}
          </View>
        </Animated.View>

        {/* Current Status Summary */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIconContainer,
                  { backgroundColor: "rgba(103,209,108,0.15)" },
                ]}
              >
                <AntDesign name="check-circle" size={20} color="#67D16C" />
              </View>
              <Text style={styles.statusNumber}>
                {getCompletedCount()} / {getTotalCount()}
              </Text>
              <Text style={styles.statusCaption}>Kiểm tra hoàn thành</Text>
            </View>
            <View style={styles.statusItem}>
              <View
                style={[
                  styles.statusIconContainer,
                  {
                    backgroundColor:
                      getPhotosCount() === 4
                        ? "rgba(103,209,108,0.15)"
                        : "rgba(255,211,102,0.15)",
                  },
                ]}
              >
                <AntDesign
                  name={
                    getPhotosCount() === 4 ? "check-circle" : "clock-circle"
                  }
                  size={20}
                  color={getPhotosCount() === 4 ? "#67D16C" : "#FFD700"}
                />
              </View>
              <Text
                style={[
                  styles.statusNumber,
                  { color: getPhotosCount() === 4 ? "#67D16C" : "#FFD700" },
                ]}
              >
                {getPhotosCount()}/4
              </Text>
              <Text style={styles.statusCaption}>Ảnh</Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <View style={styles.readyLabelContainer}>
                <AntDesign
                  name={isReadyForHandover() ? "check-circle" : "clock-circle"}
                  size={16}
                  color={isReadyForHandover() ? "#67D16C" : "#FFD700"}
                />
                <Text
                  style={[
                    styles.readyLabel,
                    { color: isReadyForHandover() ? "#67D16C" : "#FFD700" },
                  ]}
                >
                  {isReadyForHandover() ? "Sẵn sàng bàn giao" : "Chưa sẵn sàng"}
                </Text>
              </View>
              <View
                style={[
                  styles.progressBadge,
                  {
                    backgroundColor: isReadyForHandover()
                      ? "rgba(103,209,108,0.15)"
                      : "rgba(255,211,102,0.15)",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.progressPercentage,
                    { color: isReadyForHandover() ? "#67D16C" : "#FFD700" },
                  ]}
                >
                  {getCompletionPercentage()}%
                </Text>
              </View>
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
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="profile" size={18} color="#7CFFCB" />
              </View>
              <Text style={styles.cardHeaderTitle}>Tóm tắt kiểm tra</Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <AntDesign name="star" size={14} color="#FFD666" />
              <Text style={styles.summaryLabel}>Tình trạng tổng thể</Text>
            </View>
            <View
              style={[
                styles.summaryValueBadge,
                { backgroundColor: `${getOverallCondition().color}15` },
              ]}
            >
              <Text
                style={[
                  styles.summaryValue,
                  { color: getOverallCondition().color },
                ]}
              >
                {getOverallCondition().text}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <AntDesign
                name="thunderbolt"
                size={14}
                color={getBatteryCondition().color}
              />
              <Text style={styles.summaryLabel}>Tình trạng pin</Text>
            </View>
            <View
              style={[
                styles.summaryValueBadge,
                { backgroundColor: `${getBatteryCondition().color}15` },
              ]}
            >
              <Text
                style={[
                  styles.summaryValue,
                  { color: getBatteryCondition().color },
                ]}
              >
                {getBatteryCondition().text}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <AntDesign
                name="camera"
                size={14}
                color={getPhotosStatus().color}
              />
              <Text style={styles.summaryLabel}>Ảnh xe</Text>
            </View>
            <View
              style={[
                styles.summaryValueBadge,
                { backgroundColor: `${getPhotosStatus().color}15` },
              ]}
            >
              <Text
                style={[
                  styles.summaryValue,
                  { color: getPhotosStatus().color },
                ]}
              >
                {getPhotosStatus().text}
              </Text>
            </View>
          </View>

          <View style={styles.summaryRow}>
            <View style={styles.summaryLabelContainer}>
              <AntDesign
                name="exclamation-circle"
                size={14}
                color={getIssuesCount() > 0 ? "#FF4444" : "#67D16C"}
              />
              <Text style={styles.summaryLabel}>Vấn đề phát hiện</Text>
            </View>
            <View
              style={[
                styles.summaryValueBadge,
                {
                  backgroundColor:
                    getIssuesCount() > 0
                      ? "rgba(255,68,68,0.15)"
                      : "rgba(103,209,108,0.15)",
                },
              ]}
            >
              <Text
                style={[
                  styles.summaryValue,
                  { color: getIssuesCount() > 0 ? "#FF4444" : "#67D16C" },
                ]}
              >
                {getIssuesCount()} vấn đề
              </Text>
            </View>
          </View>

          <View style={[styles.summaryRow, styles.summaryRowLast]}>
            <View style={styles.summaryLabelContainer}>
              <AntDesign
                name={isReadyForHandover() ? "check-circle" : "clock-circle"}
                size={14}
                color={isReadyForHandover() ? "#67D16C" : "#FFD700"}
              />
              <Text style={styles.summaryLabel}>Trạng thái bàn giao</Text>
            </View>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: isReadyForHandover()
                    ? "rgba(103,209,108,0.15)"
                    : "rgba(255,211,102,0.15)",
                },
              ]}
            >
              <AntDesign
                name={isReadyForHandover() ? "check" : "clock-circle"}
                size={12}
                color={isReadyForHandover() ? "#67D16C" : "#FFD700"}
              />
              <Text
                style={[
                  styles.statusBadgeText,
                  { color: isReadyForHandover() ? "#67D16C" : "#FFD700" },
                ]}
              >
                {isReadyForHandover() ? "Sẵn sàng" : "Chưa sẵn sàng"}
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
          <View style={styles.primaryCtaContent}>
            {isSubmitting ? (
              <>
                <AntDesign name="loading" size={18} color="#0B0B0F" />
                <Text style={styles.primaryCtaText}>Đang gửi...</Text>
              </>
            ) : isReadyForHandover() ? (
              <>
                <AntDesign name="check-circle" size={18} color="#0B0B0F" />
                <Text style={styles.primaryCtaText}>Hoàn thành kiểm tra</Text>
              </>
            ) : (
              <>
                <AntDesign name="clock-circle" size={18} color="#9CA3AF" />
                <Text style={styles.primaryCtaTextDisabled}>Chưa sẵn sàng</Text>
              </>
            )}
          </View>
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
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cardHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(124,255,203,0.15)",
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  photoStatusBadgeComplete: {
    backgroundColor: "rgba(103,209,108,0.15)",
  },
  photoStatusBadgeIncomplete: {
    backgroundColor: "rgba(255,211,102,0.15)",
  },
  photoStatusText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "700",
  },
  photoStatusTextComplete: {
    color: "#FFFFFF",
  },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
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
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  placeholderSubtitle: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
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
    backgroundColor: "#11131A",
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  categoryHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryTitleContainer: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  categoryProgress: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  categoryHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  categoryProgressBar: {
    height: 4,
    backgroundColor: "#1B1F2A",
    borderRadius: 2,
    overflow: "hidden",
  },
  categoryProgressFill: {
    height: 4,
    borderRadius: 2,
  },
  itemsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: "#232838",
  },
  itemCardChecked: {
    backgroundColor: "rgba(103,209,108,0.1)",
    borderColor: "rgba(103,209,108,0.3)",
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
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
  itemText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
  },
  itemTextChecked: {
    color: "#67D16C",
    fontWeight: "600",
  },
  addIssueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 8,
    backgroundColor: "rgba(201,182,255,0.1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.2)",
  },
  addIssueIcon: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: "rgba(201,182,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  addIssueText: {
    color: "#C9B6FF",
    fontSize: 14,
    fontWeight: "600",
  },

  statusCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 8,
  },
  statusItem: {
    backgroundColor: "#1B1F2A",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderColor: "#232838",
    gap: 8,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  readyLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  readyLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
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
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1F2430",
  },
  summaryRowLast: {
    borderBottomWidth: 0,
  },
  summaryLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  summaryValueBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "700",
  },

  primaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
  },
  primaryCtaDisabled: {
    backgroundColor: "#2F3545",
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryCtaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  primaryCtaText: {
    color: "#0B0B0F",
    fontWeight: "700",
    fontSize: 16,
  },
  primaryCtaTextDisabled: {
    color: "#9CA3AF",
  },
  tertiaryCta: {
    marginHorizontal: 16,
    backgroundColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#232838",
  },
  tertiaryCtaText: {
    color: colors.text.secondary,
    fontWeight: "600",
    fontSize: 14,
  },
  checklistContainer: {
    backgroundColor: "transparent",
    marginTop: 12,
  },
  checklistHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    marginHorizontal: 16,
  },
  checklistHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  checklistHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  checklistTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  checklistSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  completionPercentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  inputCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  inputRow: {
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
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricInput: {
    flex: 1,
  },
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  textArea: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 14,
    minHeight: 100,
    borderWidth: 1,
    borderColor: "#232838",
  },
  numberInput: {
    backgroundColor: "#1B1F2A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#232838",
    flex: 1,
  },
  unitBadge: {
    backgroundColor: "rgba(124,255,203,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    minWidth: 40,
    alignItems: "center",
  },
  inputUnit: {
    color: "#7CFFCB",
    fontSize: 14,
    fontWeight: "700",
  },
  numberInputError: {
    borderColor: "#FF6B6B",
    borderWidth: 2,
    backgroundColor: "rgba(255,107,107,0.05)",
  },
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
});
