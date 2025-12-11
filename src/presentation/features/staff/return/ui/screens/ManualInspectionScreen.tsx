import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  Animated,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import { captureRef } from "react-native-view-shot";
import Toast from "react-native-toast-message";
import { RentalReturnCreateReceiptUseCase } from "../../../../../../domain/usecases/rentalReturn/CreateReceiptUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { CreateReceiptResponse } from "../../../../../../data/models/rentalReturn/CreateReceiptResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { useGetLastReceipt } from "../hooks/useGetLastReceipt";
import * as ImagePicker from "expo-image-picker";
import { UpdateReturnReceiptUseCase } from "../../../../../../domain/usecases/rentalReturn/UpdateReturnReceiptUseCase";
import { UpdateReturnReceiptResponse } from "../../../../../../data/models/rentalReturn/UpdateReturnReceiptResponse";

type ManualInspectionScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ManualInspection"
>;

type ManualInspectionScreenRouteProp = RouteProp<
  StaffStackParamList,
  "ManualInspection"
>;

interface InspectionItem {
  id: string;
  label: string;
  checked: boolean;
}

interface InspectionCategory {
  id: string;
  title: string;
  items: InspectionItem[];
  expanded: boolean;
}

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

export const ManualInspectionScreen: React.FC = () => {
  const navigation = useNavigation<ManualInspectionScreenNavigationProp>();
  const route = useRoute<ManualInspectionScreenRouteProp>();
  const { bookingId, photos, isUpdateReceipt } = route.params || {};

  const [endOdometerKm, setEndOdometerKm] = useState("");
  const [endBatteryPercentage, setEndBatteryPercentage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [returnReceiptData, setReturnReceiptData] =
    useState<CreateReceiptResponse | null>(null);
  const [updateReturnReceiptData, setUpdateReturnReceiptData] =
    useState<UpdateReturnReceiptResponse | null>(null);
  const [checklistUri, setChecklistUri] = useState<string | null>(null);
  const [returnPhotos, setReturnPhotos] = useState<{
    front: string | null;
    back: string | null;
    left: string | null;
    right: string | null;
  }>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [odometerError, setOdometerError] = useState<string | null>(null);
  const [batteryError, setBatteryError] = useState<string | null>(null);
  const odometerShakeAnim = useRef(new Animated.Value(0)).current;
  const batteryShakeAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const statusInputsCardRef = useRef<View>(null);
  const [statusInputsCardY, setStatusInputsCardY] = useState<number>(0);
  const [hasFilledData, setHasFilledData] = useState(false);
  const [categories, setCategories] = useState<InspectionCategory[]>([
    {
      id: "body-paint",
      title: "Thân xe & Sơn",
      expanded: true,
      items: [
        { id: "1", label: "Đèn hậu hoạt động tốt", checked: false },
        { id: "2", label: "Gương chiếu hậu nguyên vẹn", checked: false },
        { id: "3", label: "Phanh trước/sau hoạt động", checked: false },
        { id: "4", label: "Không có vết xước trên thân xe", checked: false },
        { id: "5", label: "Bề mặt sơn không bị bong tróc", checked: false },
        { id: "6", label: "Cửa xe đóng mở bình thường", checked: false },
        { id: "7", label: "Kính chắn gió không vỡ", checked: false },
        { id: "8", label: "Logo và nhãn hiệu còn nguyên", checked: false },
      ],
    },
    {
      id: "wheels-tires",
      title: "Bánh xe & Lốp",
      expanded: false,
      items: [
        { id: "9", label: "Lốp không bị mòn quá mức", checked: false },
        { id: "10", label: "Vành xe không bị cong", checked: false },
        { id: "11", label: "Áp suất lốp đúng tiêu chuẩn", checked: false },
        { id: "12", label: "Không có vết nứt trên lốp", checked: false },
      ],
    },
    {
      id: "lights-signals",
      title: "Đèn & Tín hiệu",
      expanded: false,
      items: [
        { id: "13", label: "Đèn pha hoạt động", checked: false },
        { id: "14", label: "Đèn xi-nhan hoạt động", checked: false },
        { id: "15", label: "Đèn phanh hoạt động", checked: false },
        { id: "16", label: "Đèn báo rẽ hoạt động", checked: false },
        { id: "17", label: "Đèn cảnh báo hoạt động", checked: false },
        { id: "18", label: "Đèn nội thất hoạt động", checked: false },
      ],
    },
    {
      id: "interior-features",
      title: "Nội thất & Tính năng",
      expanded: false,
      items: [
        { id: "19", label: "Ghế ngồi không bị rách", checked: false },
        { id: "20", label: "Tay lái hoạt động tốt", checked: false },
        { id: "21", label: "Công tắc và nút bấm hoạt động", checked: false },
        { id: "22", label: "Màn hình hiển thị hoạt động", checked: false },
        { id: "23", label: "Hệ thống điều hòa hoạt động", checked: false },
        { id: "24", label: "Ổ cắm sạc hoạt động", checked: false },
      ],
    },
    {
      id: "safety-equipment",
      title: "Thiết bị an toàn",
      expanded: false,
      items: [
        { id: "25", label: "Mũ bảo hiểm có sẵn", checked: false },
        { id: "26", label: "Áo phản quang có sẵn", checked: false },
        { id: "27", label: "Bộ cứu thương có sẵn", checked: false },
        { id: "28", label: "Còi xe hoạt động", checked: false },
      ],
    },
  ]);
  const checklistRef = useRef<View>(null);

  const { getLastReceipt, booking } = useGetLastReceipt({ bookingId });

  const ensurePermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cam.status === "granted" && lib.status === "granted";
  };

  const openPicker = async (key: keyof typeof returnPhotos) => {
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert(
        "Permission required",
        "Please grant camera and media permissions."
      );
      return;
    }

    Alert.alert("Thêm ảnh", "Chọn nguồn ảnh", [
      {
        text: "Camera",
        onPress: async () => {
          const res = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 0.7,
          });
          if (!res.canceled && res.assets?.[0]?.uri) {
            setReturnPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
          }
        },
      },
      {
        text: "Thư viện",
        onPress: async () => {
          const res = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            quality: 0.7,
            mediaTypes: ["images"],
          });
          if (!res.canceled && res.assets?.[0]?.uri) {
            setReturnPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
          }
        },
      },
      { text: "Hủy", style: "cancel" },
    ]);
  };

  // Set default odometer value from startOdometerKm
  useEffect(() => {
    const lastReceipt = getLastReceipt();
    if (lastReceipt?.startOdometerKm && !endOdometerKm) {
      setEndOdometerKm(lastReceipt.startOdometerKm.toString());
    }
  }, [booking, getLastReceipt]);

  // Auto-clear odometer error when value becomes valid
  useEffect(() => {
    if (odometerError && endOdometerKm) {
      const lastReceipt = getLastReceipt();
      const endOdometerNum = parseInt(endOdometerKm);
      const isValid = !isNaN(endOdometerNum) && endOdometerNum >= 0;
      const isGreaterThanStart =
        lastReceipt?.startOdometerKm === undefined ||
        endOdometerNum > lastReceipt.startOdometerKm;

      if (isValid && isGreaterThanStart) {
        setOdometerError(null);
      }
    }
  }, [endOdometerKm, odometerError, getLastReceipt]);

  // Auto-clear battery error when value becomes valid
  useEffect(() => {
    if (batteryError && endBatteryPercentage) {
      const endBatteryNum = parseInt(endBatteryPercentage);
      const isValid =
        !isNaN(endBatteryNum) && endBatteryNum >= 0 && endBatteryNum <= 100;

      if (isValid) {
        setBatteryError(null);
      }
    }
  }, [endBatteryPercentage, batteryError]);

  useEffect(() => {
    if (isUpdateReceipt && !hasFilledData) {
      const lastReceipt = getLastReceipt();
      if (lastReceipt) {
        setEndOdometerKm(lastReceipt.endOdometerKm.toString());
        setEndBatteryPercentage(lastReceipt.endBatteryPercentage.toString());
        const returnFiles = lastReceipt.returnVehicleImageFiles || [];
        if (returnFiles.length > 0) {
          setReturnPhotos({
            front: returnFiles[0] || null,
            back: returnFiles[1] || null,
            left: returnFiles[2] || null,
            right: returnFiles[3] || null,
          });
        }
        setHasFilledData(true);
      }
    }
  }, [isUpdateReceipt, getLastReceipt]);

  // Init photos from route param (if provided)
  useEffect(() => {
    if (photos && Array.isArray(photos)) {
      setReturnPhotos({
        front: photos[0] || null,
        back: photos[1] || null,
        left: photos[2] || null,
        right: photos[3] || null,
      });
    } else if (photos && typeof photos === "object") {
      setReturnPhotos((prev) => ({
        ...prev,
        ...photos,
      }));
    }
  }, [photos]);

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

  const toggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, expanded: !cat.expanded } : cat
      )
    );
  };

  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : cat
      )
    );
  };

  const getTotalItems = () => {
    return categories.reduce((total, cat) => total + cat.items.length, 0);
  };

  const getCheckedItems = () => {
    return categories.reduce(
      (total, cat) => total + cat.items.filter((item) => item.checked).length,
      0
    );
  };

  const getCategoryCheckedCount = (category: InspectionCategory) => {
    return category.items.filter((item) => item.checked).length;
  };

  const validate = (): boolean => {
    const newErrors: { odometer?: string; battery?: string } = {};
    let isValid = true;

    // Validate odometer
    if (!endOdometerKm || endOdometerKm.trim() === "") {
      newErrors.odometer = "Vui lòng nhập số km cuối";
      isValid = false;
      shakeError(odometerShakeAnim);
    } else {
      const lastReceipt = getLastReceipt();
      const endOdometerNum = parseInt(endOdometerKm);
      if (isNaN(endOdometerNum) || endOdometerNum < 0) {
        newErrors.odometer = "Số km phải là số hợp lệ (≥ 0)";
        isValid = false;
        shakeError(odometerShakeAnim);
      } else if (
        lastReceipt?.startOdometerKm !== undefined &&
        endOdometerNum < lastReceipt.startOdometerKm
      ) {
        newErrors.odometer = `Số km cuối phải lớn hơn hoặc bằng số km đầu (${lastReceipt.startOdometerKm} km)`;
        isValid = false;
        shakeError(odometerShakeAnim);
      }
    }

    // Validate battery
    if (!endBatteryPercentage || endBatteryPercentage.trim() === "") {
      newErrors.battery = "Vui lòng nhập % pin cuối";
      isValid = false;
      shakeError(batteryShakeAnim);
    } else {
      const endBatteryNum = parseInt(endBatteryPercentage);
      if (isNaN(endBatteryNum) || endBatteryNum < 0 || endBatteryNum > 100) {
        newErrors.battery = "Pin phải là số từ 0 đến 100";
        isValid = false;
        shakeError(batteryShakeAnim);
      }
    }

    // Set all errors at once
    setOdometerError(newErrors.odometer || null);
    setBatteryError(newErrors.battery || null);

    // Scroll to first error
    if (!isValid && scrollViewRef.current) {
      setTimeout(() => {
        if (statusInputsCardY > 0) {
          scrollViewRef.current?.scrollTo({
            y: statusInputsCardY - 20,
            animated: true,
          });
        }
      }, 100);
    }

    return isValid;
  };

  const getPhotosCount = () => {
    return Object.values(returnPhotos).filter(Boolean).length;
  };

  const handleCompleteInspection = async () => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);

      // Validate all fields
      if (!validate()) {
        setIsSubmitting(false);
        return;
      }

      const lastReceipt = getLastReceipt();

      let capturedChecklistUri: string | null = null;
      if (checklistRef.current) {
        capturedChecklistUri = await captureRef(checklistRef.current, {
          format: "png",
          quality: 0.8,
          result: "tmpfile", // tạo file thật để upload
        });
        setChecklistUri(capturedChecklistUri);
      }

      if (isUpdateReceipt) {
        const updateReturnReceiptUseCase = new UpdateReturnReceiptUseCase(
          sl.get("RentalReturnRepository")
        );
        const updateReturnReceiptResponse =
          await updateReturnReceiptUseCase.execute({
            bookingId,
            notes: "Kiểm tra thủ công",
            rentalReceiptId: lastReceipt?.id,
            actualReturnDatetime: new Date().toISOString(),
            endOdometerKm: parseInt(endOdometerKm),
            endBatteryPercentage: parseInt(endBatteryPercentage),
            returnImageUrls: photos,
            checkListImage: capturedChecklistUri,
          });
        if (updateReturnReceiptResponse.success) {
          const updateReturnReceiptData: UpdateReturnReceiptResponse =
            unwrapResponse(updateReturnReceiptResponse);
          setUpdateReturnReceiptData(updateReturnReceiptData);
          Toast.show({
            text1: "Cập nhật thông tin trả xe thành công",
            type: "success",
          });
          setInspectionCompleted(true);
        } else {
          Toast.show({
            text1: updateReturnReceiptResponse.message,
            type: "error",
          });
        }
      } else {
        const createReturnReceiptUseCase = new RentalReturnCreateReceiptUseCase(
          sl.get("RentalReturnRepository")
        );

        const returnReceiptResponse = await createReturnReceiptUseCase.execute({
          notes: "Kiểm tra thủ công",
          returnReceiptId: lastReceipt?.id,
          actualReturnDatetime: new Date().toISOString(),
          endOdometerKm: parseInt(endOdometerKm),
          endBatteryPercentage: parseInt(endBatteryPercentage),
          bookingId,
          returnImageUrls: photos,
          checkListImage: capturedChecklistUri,
        });

        const receiptData: CreateReceiptResponse = unwrapResponse(
          returnReceiptResponse
        );

        setReturnReceiptData(receiptData);
        setInspectionCompleted(true);

        Toast.show({
          text1: "Kiểm tra đã hoàn thành",
          text2: "Chọn bước tiếp theo",
          type: "success",
        });
      }
    } catch (error) {
      // Alert.alert("Lỗi", `Không thể gửi kiểm tra: ${error.message}`);
      Toast.show({
        text1: "Không thể gửi kiểm tra",
        text2: error.message,
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = getTotalItems();
  const checkedItems = getCheckedItems();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollContent}
      >
        <ScreenHeader
          title="Kiểm tra thủ công"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={3} totalSteps={4} />

        {/* Required Photos (only when updating) */}
        {isUpdateReceipt && (
          <View style={styles.photosCard}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.cardHeaderLeft}>
                <View style={styles.cardHeaderIcon}>
                  <AntDesign name="camera" size={18} color="#7CFFCB" />
                </View>
                <View>
                  <Text style={styles.cardHeaderTitle}>Ảnh 4 góc xe</Text>
                  <Text style={styles.cardHeaderSubtitle}>
                    {getPhotosCount()}/4 ảnh đã có
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.photosGrid}>
              <PhotoTile
                uri={returnPhotos.front}
                placeholderTitle="Mặt trước"
                placeholderSubtitle="Chạm để chọn"
                onPress={() => openPicker("front")}
                isPrimary
              />
              <PhotoTile
                uri={returnPhotos.back}
                placeholderTitle="Mặt sau"
                placeholderSubtitle="Chạm để chọn"
                onPress={() => openPicker("back")}
              />
              <PhotoTile
                uri={returnPhotos.left}
                placeholderTitle="Bên trái"
                placeholderSubtitle="Chạm để chọn"
                onPress={() => openPicker("left")}
              />
              <PhotoTile
                uri={returnPhotos.right}
                placeholderTitle="Bên phải"
                placeholderSubtitle="Chạm để chọn"
                onPress={() => openPicker("right")}
              />
            </View>
          </View>
        )}

        {/* Vehicle Status Inputs */}
        <View
          ref={statusInputsCardRef}
          style={styles.statusInputsCard}
          onLayout={(event) => {
            const { y } = event.nativeEvent.layout;
            setStatusInputsCardY(y);
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

          {/* Metrics Row */}
          <View style={styles.metricsRow}>
            {/* Battery Percentage Input */}
            <View style={styles.metricInput}>
              <View style={styles.inputLabelRow}>
                <AntDesign name="thunderbolt" size={14} color="#67D16C" />
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
                    batteryError && styles.numberInputError,
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  value={endBatteryPercentage}
                  onChangeText={(text) => {
                    setEndBatteryPercentage(text);
                    if (batteryError) {
                      setBatteryError(null);
                    }
                  }}
                  keyboardType="numeric"
                />
                <View
                  style={[
                    styles.unitBadge,
                    { backgroundColor: "rgba(103,209,108,0.15)" },
                  ]}
                >
                  <Text style={[styles.inputUnit, { color: "#67D16C" }]}>
                    %
                  </Text>
                </View>
              </Animated.View>
              {batteryError && (
                <View style={styles.errorContainer}>
                  <AntDesign
                    name="exclamation-circle"
                    size={14}
                    color="#FF6B6B"
                  />
                  <Text style={styles.errorText}>{batteryError}</Text>
                </View>
              )}
            </View>

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
                    odometerError && styles.numberInputError,
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.text.secondary}
                  value={endOdometerKm}
                  onChangeText={(text) => {
                    setEndOdometerKm(text);
                    if (odometerError) {
                      setOdometerError(null);
                    }
                  }}
                  keyboardType="numeric"
                />
                <View style={styles.unitBadge}>
                  <Text style={styles.inputUnit}>km</Text>
                </View>
              </Animated.View>
              {odometerError && (
                <View style={styles.errorContainer}>
                  <AntDesign
                    name="exclamation-circle"
                    size={14}
                    color="#FF6B6B"
                  />
                  <Text style={styles.errorText}>{odometerError}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Overall Progress */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <View style={styles.progressHeaderLeft}>
              <View style={styles.progressHeaderIcon}>
                <AntDesign name="check-square" size={18} color="#C9B6FF" />
              </View>
              <View>
                <Text style={styles.progressLabel}>Tiến độ kiểm tra</Text>
                <Text style={styles.progressSubtitle}>
                  {checkedItems}/{totalItems} mục đã hoàn thành
                </Text>
              </View>
            </View>
            <View
              style={[
                styles.completionBadge,
                {
                  backgroundColor:
                    checkedItems === totalItems
                      ? "rgba(103,209,108,0.15)"
                      : "rgba(255,211,102,0.15)",
                },
              ]}
            >
              <Text
                style={[
                  styles.completionPercentage,
                  {
                    color: checkedItems === totalItems ? "#67D16C" : "#FFD700",
                  },
                ]}
              >
                {totalItems > 0
                  ? Math.round((checkedItems / totalItems) * 100)
                  : 0}
                %
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    totalItems > 0 ? (checkedItems / totalItems) * 100 : 0
                  }%`,
                  backgroundColor:
                    checkedItems === totalItems ? "#67D16C" : "#C9B6FF",
                },
              ]}
            />
          </View>
        </View>
        {/* Inspection Categories */}
        <View
          ref={checklistRef}
          style={styles.checklistContainer}
          collapsable={false}
        >
          {categories.map((category) => {
            const categoryChecked = getCategoryCheckedCount(category);
            const categoryTotal = category.items.length;
            const categoryProgress =
              categoryTotal > 0
                ? Math.round((categoryChecked / categoryTotal) * 100)
                : 0;

            return (
              <View key={category.id} style={styles.categoryCard}>
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <View
                      style={[
                        styles.categoryIcon,
                        {
                          backgroundColor:
                            categoryProgress === 100
                              ? "rgba(103,209,108,0.15)"
                              : "rgba(201,182,255,0.15)",
                        },
                      ]}
                    >
                      <AntDesign
                        name={
                          categoryProgress === 100
                            ? "check-circle"
                            : "file-text"
                        }
                        size={16}
                        color={categoryProgress === 100 ? "#67D16C" : "#C9B6FF"}
                      />
                    </View>
                    <View style={styles.categoryTitleContainer}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryProgress}>
                        {categoryChecked}/{categoryTotal} hoàn thành
                      </Text>
                    </View>
                  </View>
                  <View style={styles.categoryHeaderRight}>
                    <View style={[styles.categoryProgressBar, { width: 60 }]}>
                      <View
                        style={[
                          styles.categoryProgressFill,
                          {
                            width: `${categoryProgress}%`,
                            backgroundColor:
                              categoryProgress === 100 ? "#67D16C" : "#C9B6FF",
                          },
                        ]}
                      />
                    </View>
                    <AntDesign
                      name={category.expanded ? "up" : "down"}
                      size={16}
                      color={colors.text.secondary}
                    />
                  </View>
                </TouchableOpacity>

                {category.expanded && (
                  <View style={styles.itemsContainer}>
                    {category.items.map((item) => (
                      <TouchableOpacity
                        key={item.id}
                        style={[
                          styles.itemCard,
                          item.checked && styles.itemCardChecked,
                        ]}
                        onPress={() => toggleItem(category.id, item.id)}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            styles.checkboxCircle,
                            item.checked && styles.checkboxChecked,
                          ]}
                        >
                          {item.checked && (
                            <AntDesign name="check" size={14} color="#FFFFFF" />
                          )}
                        </View>
                        <Text
                          style={[
                            styles.itemText,
                            item.checked && styles.itemTextChecked,
                          ]}
                        >
                          {item.label}
                        </Text>
                        {item.checked && (
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
        </View>

        {/* Action Buttons */}
        {inspectionCompleted ? (
          <View style={styles.actionButtonsContainer}>
            {/* Additional Fees Button */}
            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={() => {
                navigation.navigate("AdditionalFees", {
                  bookingId: bookingId,
                });
              }}
              activeOpacity={0.8}
            >
              <View style={styles.secondaryCtaContent}>
                <AntDesign name="plus-circle" size={18} color="#FFD666" />
                <Text style={styles.secondaryCtaText}>Thêm phí phát sinh</Text>
                <AntDesign name="right" size={16} color="#FFD666" />
              </View>
            </TouchableOpacity>

            {/* View Report Button */}
            <TouchableOpacity
              style={styles.primaryCta}
              onPress={() => {
                if (returnReceiptData) {
                  navigation.navigate("ReturnReport", {
                    bookingId: bookingId,
                    rentalReceiptId: returnReceiptData.rentalReceiptId,
                  });
                } else if (updateReturnReceiptData) {
                  navigation.navigate("ReturnReport", {
                    bookingId: bookingId,
                    rentalReceiptId: updateReturnReceiptData.rentalReceiptId,
                  });
                }
              }}
              activeOpacity={0.8}
            >
              <View style={styles.primaryCtaContent}>
                <AntDesign name="file-text" size={18} color="#0B0B0F" />
                <Text style={styles.primaryCtaText}>Xem báo cáo trả xe</Text>
                <AntDesign name="arrow-right" size={16} color="#0B0B0F" />
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.primaryCta,
              (checkedItems !== totalItems || isSubmitting) &&
                styles.primaryCtaDisabled,
            ]}
            onPress={handleCompleteInspection}
            disabled={checkedItems !== totalItems || isSubmitting}
          >
            <View style={styles.primaryCtaContent}>
              {isSubmitting ? (
                <>
                  <AntDesign name="loading" size={18} color="#0B0B0F" />
                  <Text style={styles.primaryCtaText}>Đang gửi...</Text>
                </>
              ) : checkedItems === totalItems &&
                booking.bookingStatus === "Renting" ? (
                <>
                  <AntDesign name="check-circle" size={18} color="#0B0B0F" />
                  <Text style={styles.primaryCtaText}>Hoàn thành kiểm tra</Text>
                </>
              ) : checkedItems === totalItems &&
                booking.bookingStatus === "Returned" ? (
                <>
                  <AntDesign name="check-circle" size={18} color="#0B0B0F" />
                  <Text style={styles.primaryCtaText}>
                    Cập nhật thông tin trả xe
                  </Text>
                </>
              ) : (
                <>
                  <AntDesign name="clock-circle" size={18} color="#9CA3AF" />
                  <Text style={styles.primaryCtaTextDisabled}>
                    Chưa hoàn thành
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>
        )}
        {booking.bookingStatus === "Returned" && (
          <TouchableOpacity
            style={[styles.primaryCta, {marginTop: 8}]}
            onPress={() => {
              navigation.navigate("ReturnReport", {
                bookingId: bookingId,
                rentalReceiptId: getLastReceipt()?.id,
              });
            }}
          >
            <View style={styles.primaryCtaContent}>
              <AntDesign name="file-text" size={18} color="#0B0B0F" />
              <Text style={styles.primaryCtaText}>Xem trạng thái trả xe</Text>
            </View>
          </TouchableOpacity>
        )}
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
  progressSection: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  progressHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  progressHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  progressSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
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
  photosGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
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
  completionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  completionPercentage: {
    fontSize: 16,
    fontWeight: "700",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#3A3A3A",
    borderRadius: 5,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 5,
  },
  statusInputsCard: {
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
  metricsRow: {
    flexDirection: "row",
    gap: 12,
  },
  metricInput: {
    flex: 1,
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
  inputWithUnit: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
  checklistContainer: {
    backgroundColor: "transparent",
    marginTop: 12,
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
  primaryCta: {
    backgroundColor: "#C9B6FF",
    borderRadius: 16,
    marginTop: 8,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: "hidden",
    marginHorizontal: 16,
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
  actionButtonsContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    gap: 12,
  },
  secondaryCta: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#FFD666",
    shadowColor: "#FFD666",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
    marginHorizontal: 16,
  },
  secondaryCtaContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  secondaryCtaText: {
    color: "#FFD666",
    fontWeight: "700",
    fontSize: 16,
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
