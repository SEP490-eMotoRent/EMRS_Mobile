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
  Modal,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { StepProgressBar } from "../atoms";
import sl from "../../../../../../core/di/InjectionContainer";
import { AiAnalyzeUseCase } from "../../../../../../domain/usecases/rentalReturn/AiAnalyzeUseCase";
import { AnalyzeReturnResponse } from "../../../../../../data/models/rentalReturn/AnalyzeReturnResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import Toast from "react-native-toast-message";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";

const customerAvatar = require("../../../../../../../assets/images/avatar2.png");

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

type ReturnInspectionScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ReturnInspection"
>;

type ReturnInspectionScreenRouteProp = RouteProp<
  StaffStackParamList,
  "ReturnInspection"
>;

export const ReturnInspectionScreen: React.FC = () => {
  const route = useRoute<ReturnInspectionScreenRouteProp>();
  const { bookingId } = route.params || {};
  const navigation = useNavigation<ReturnInspectionScreenNavigationProp>();

  const [photos, setPhotos] = useState<Record<string, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const ensurePermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cam.status === "granted" && lib.status === "granted";
  };

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);


  const fetchBooking = async () => {
    try {
      setLoading(true);
      const getBookingByIdUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const booking = await getBookingByIdUseCase.execute(bookingId);
      setBooking(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPhotosCount = () => {
    return Object.values(photos).filter(Boolean).length;
  };

  const handleContinue = async () => {
    try {
      if (!bookingId) {
        Alert.alert("Lỗi", "Vui lòng chọn booking");
        return;
      }

      if (getPhotosCount() < 4) {
        Alert.alert(
          "Lỗi",
          "Vui lòng chụp đủ 4 ảnh xe (trước, sau, trái, phải)"
        );
        setLoading(false);
        return;
      }

      setLoading(true);
      const analyzeReturnUseCase = new AiAnalyzeUseCase(
        sl.get("RentalReturnRepository")
      );

      const analyzeReturnResponse = await analyzeReturnUseCase.execute({
        bookingId,
        returnImages: [
          photos.front,
          photos.back,
          photos.left,
          photos.right,
        ].filter(Boolean) as string[],
      });

      const analyzeReturnData: AnalyzeReturnResponse = unwrapResponse(
        analyzeReturnResponse
      );

      Toast.show({
        text1: "Phân tích đã được hoàn thành",
        type: "success",
      });

      navigation.navigate("AIAnalysis", {
        bookingId,
        analyzeReturnData,
      });
    } catch (error) {
      Alert.alert("Lỗi", `Không thể gửi kiểm tra: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const openPicker = async (key: keyof typeof photos) => {
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert(
        "Yêu cầu quyền truy cập",
        "Vui lòng cấp quyền truy cập camera và phương tiện."
      );
      return;
    }

    Alert.alert("Thêm ảnh", "Chọn nguồn", [
      {
        text: "Máy ảnh",
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
        text: "Thư viện",
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
      { text: "Hủy", style: "cancel" },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Kiểm tra trả xe"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />
        <StepProgressBar currentStep={1} totalSteps={4} />

        {/* User and Vehicle Information Card */}
        <View style={styles.infoCard}>
          <View style={styles.userInfo}>
            <Image source={{ uri: booking?.renter?.avatarUrl }} style={styles.userAvatar} />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{booking?.renter?.fullName()}</Text>
              <Text style={styles.userPhone}>Số điện thoại: {booking?.renter?.phone}</Text>
              <Text style={styles.userBranch}>
                Mã đặt chỗ: {bookingId ? `#${bookingId.slice(-10)}` : "N/A"}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Trạng thái</Text>
              <View style={styles.statusBadge}>
                <AntDesign name="car" size={12} color="#FFC107" />
                <Text style={styles.statusBadgeText}>Đang kiểm tra</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Thời gian kiểm tra</Text>
              <Text style={styles.infoValue}>
                {new Date().toLocaleTimeString("vi-VN")}
              </Text>
            </View>
          </View>
        </View>

        {/* Capture Vehicle Photos Section */}
        <View style={styles.photoSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chụp ảnh xe (Yêu cầu 4 góc)</Text>
            <View style={styles.photoCountBadge}>
              <Text style={styles.photoCountText}>{getPhotosCount()}/4</Text>
            </View>
          </View>
          <View style={styles.photoGrid}>
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

        {/* Continue Button */}
        <TouchableOpacity
          style={[
            styles.continueButton,
            loading && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.continueButtonText}>Đang phân tích...</Text>
            </>
          ) : (
            <Text style={styles.continueButtonText}>Tiếp tục</Text>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity
          style={styles.continueButton}
          onPress={() => navigation.navigate("AIAnalysis", { bookingId, analyzeReturnData: null })}
        >
          <Text style={styles.continueButtonText}>Tiếp tục</Text>
        </TouchableOpacity> */}
      </ScrollView>
      {/* Loading Modal while scanning */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang phân tích</Text>
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
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 28,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: "#444444",
    marginTop: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  userBranch: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  vehicleInfo: {
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text.primary,
    textAlign: "right",
  },
  photoSection: {
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    flex: 1,
  },
  photoCountBadge: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  photoCountText: {
    color: "#000",
    fontSize: 12,
    fontWeight: "700",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  photoCard: {
    width: "48%",
    height: "100%",
    aspectRatio: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  photoLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text.primary,
    marginTop: 8,
    marginBottom: 4,
  },
  photoSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 193, 7, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusBadgeText: {
    color: "#FFC107",
    fontSize: 12,
    fontWeight: "600",
  },
  continueButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    shadowColor: "#1E3A8A",
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  continueButtonDisabled: {
    opacity: 0.6,
  },
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
