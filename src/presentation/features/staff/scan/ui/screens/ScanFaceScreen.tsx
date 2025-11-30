import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
  Platform,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, CameraView } from "expo-camera";
import Toast from "react-native-toast-message";
import { GetByCitizenIdUseCase } from "../../../../../../domain/usecases/account/GetByCitizenIdUseCase";
import sl from "../../../../../../core/di/InjectionContainer";

type ScanFaceScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ScanFace"
>;

export const ScanFaceScreen: React.FC = () => {
  const navigation = useNavigation<ScanFaceScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const [loaded, setLoaded] = useState(false);

  // const handleStartFacialScan = async () => {
  //   try {
  //     const { status } = await ImagePicker.requestCameraPermissionsAsync();
  //     if (status !== "granted") {
  //       console.warn("Camera permission not granted");
  //       return;
  //     }

  //     const capture = await ImagePicker.launchCameraAsync({
  //       cameraType: ImagePicker.CameraType.front,
  //       allowsEditing: true,
  //       quality: 0.7,
  //     });
  //     if (capture.canceled || !capture.assets?.[0]?.uri) {
  //       return;
  //     }

  //     const imageUri = capture.assets[0].uri;

  //     // Fix mirror image from front camera by flipping horizontally
  //     const flipped = await manipulateAsync(
  //       imageUri,
  //       [{ flip: FlipType.Horizontal }],
  //       { compress: 0.8, format: SaveFormat.JPEG }
  //     );

  //     setLoading(true);
  //     const scanFaceUseCase = new ScanFaceUseCase(sl.get("RenterRepository"));
  //     const response = await scanFaceUseCase.execute({
  //       image: flipped.uri,
  //     });

  //     if (response.success) {
  //       navigation.navigate("ScanResult", { renter: response.data });
  //     }
  //   } catch (error) {
  //     console.error("Error scanning face:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleStartFacialScan = () => {
    navigation.navigate("FaceScanCamera");
  };

  const manualOptions = [
    {
      id: "id",
      title: "Quét giấy tờ tuỳ thân",
      subtitle: "CMND/CCCD rõ nét, không bị che khuất",
      icon: "idcard",
      accent: "#7C5DFA",
      action: () => setShowScanner(true),
    },
  ] as const;

  const guidanceItems = [
    { id: "light", icon: "bulb", text: "Ánh sáng đều, không ngược sáng" },
    { id: "mask", icon: "close-circle", text: "Tháo khẩu trang và kính râm" },
  ];

  const handleBarCodeScanned = async ({ type, data }) => {
    try {
      setScanned(true);
      // Parse QR code data
      const citizenId = parseQRCodeData(data);
      setShowScanner(false);

      const getByCitizenIdUseCase = new GetByCitizenIdUseCase(
        sl.get("RenterRepository")
      );
      const response = await getByCitizenIdUseCase.execute(citizenId);
      if (response.success) {
        navigation.navigate("ScanCitizenResult", { renter: response.data });
      }
      // navigation.navigate("ScanResult", { idCardData });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Có lỗi xảy ra khi xử lý mã QR",
        text2: error.message,
      });
      setScanned(false);
    }
  };

  const parseQRCodeData = (qrData) => {
    try {
      // Example QR format: số CCCD|Họ tên|Ngày sinh|Giới tính|Địa chỉ
      const [idCard, idNumberOld, fullName, yob, sex, address] =
        qrData.split("|");

      return idCard;
    } catch (error) {
      console.error("Error parsing QR data:", error);
      throw new Error("Invalid QR code format");
    }
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === "torch" ? "off" : "torch");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.scanCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <Text style={styles.cardTitle}>Quét khuôn mặt trực tiếp</Text>
              <Text style={styles.cardSubtitle}>
                Đưa khuôn mặt vào khung, giữ thẳng và nhìn trực diện.
              </Text>
            </View>
          </View>
          <View style={styles.scanFrame}>
            <Image
              source={{
                uri: "https://cdn-icons-gif.flaticon.com/7920/7920844.gif",
              }}
              style={styles.cameraIconContainer}
              onLoad={() => setLoaded(true)}
            />
            {!loaded && (
              <ActivityIndicator
                style={[styles.cameraIconContainer, { position: "absolute" }]}
                size="small"
                color="#999"
              />
            )}
          </View>
          <View style={styles.guidelineRow}>
            {guidanceItems.map((item) => (
              <View key={item.id} style={styles.guidelineItem}>
                <View style={styles.guidelineIcon}>
                  <AntDesign
                    name={item.icon as any}
                    size={16}
                    color="#7CFFCB"
                  />
                </View>
                <Text style={styles.guidelineText}>{item.text}</Text>
              </View>
            ))}
          </View>
          <PrimaryButton
            title="Bắt đầu quét khuôn mặt"
            onPress={handleStartFacialScan}
            style={styles.scanButton}
          />
          <Text style={styles.scanHint}>
            Dữ liệu được mã hoá & lưu trữ an toàn.
          </Text>
        </View>

        <View style={styles.manualCard}>
          <View style={styles.cardHeaderRow}>
            <View>
              <View style={styles.cardTitleContainer}>
                <Text style={styles.cardTitle}>Phương án thủ công</Text>
                <AntDesign name="tool" size={20} color="#FFAA5B" />
              </View>
              <Text style={styles.cardSubtitle}>
                Thực hiện khi khách không thể quét khuôn mặt.
              </Text>
            </View>
          </View>
          {manualOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.manualOption}
              onPress={option.action}
            >
              <View
                style={[
                  styles.optionIconWrap,
                  { backgroundColor: option.accent },
                ]}
              >
                <AntDesign
                  name={option.icon as any}
                  size={18}
                  color="#0B0B0F"
                />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>{option.title}</Text>
                <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
              </View>
              <AntDesign name="right" size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
          <PrimaryButton
            title="Quát khuôn mặt"
            onPress={() =>
              navigation.navigate("ScanCitizenResult", {
                renter: {
                  id: "019ad54c-7180-726b-b212-488d91de195d",
                  email: "john.doe@example.com",
                  phone: "1234567890",
                  address: "123 Main St, Anytown, USA",
                  dateOfBirth: "1990-01-01",
                  avatarUrl: "https://example.com/avatar.jpg",
                  faceScanUrl: "https://example.com/face-scan.jpg",
                  account: {
                    id: "1",
                    username: "john.doe",
                    role: "user",
                    fullname: "John Doe",
                  },
                },
              })
            }
          />
        </View>
      </ScrollView>

      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang quét khuôn mặt</Text>
          </View>
        </View>
      </Modal>

      {/* QR Scanner Modal */}
      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <SafeAreaView style={styles.scannerContainer}>
          <View style={styles.scannerHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setShowScanner(false)}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.scannerTitle}>Quét mã QR CCCD</Text>
            <TouchableOpacity style={styles.flashButton} onPress={toggleFlash}>
              <MaterialIcons
                name={flashMode === "torch" ? "flash-on" : "flash-off"}
                size={24}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>

          {hasPermission === null ? (
            <Text style={styles.guideText}>
              Đang yêu cầu quyền truy cập camera...
            </Text>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Text style={styles.guideText}>
                Không có quyền truy cập camera
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => setShowScanner(false)}
              >
                <Text style={styles.buttonText}>Quay lại</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scannerContainer}>
              <CameraView
                style={StyleSheet.absoluteFillObject}
                enableTorch={flashMode === "torch"}
                barcodeScannerSettings={{
                  barcodeTypes: ["qr"],
                }}
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
              />
              <View style={styles.overlay}>
                <View style={styles.scanArea} />
              </View>

              <View style={styles.guideContainer}>
                <Text style={styles.guideText}>
                  Đặt mã QR trên CCCD vào khung hình
                </Text>
              </View>

              {scanned && (
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={() => setScanned(false)}
                >
                  <MaterialIcons name="refresh" size={24} color="#FFFFFF" />
                  <Text style={styles.rescanText}>Quét lại</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 20,
  },
  scanCard: {
    backgroundColor: "#11131A",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
    gap: 16,
    marginTop: 10,
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  cardSubtitle: {
    color: colors.text.secondary,
    marginTop: 4,
  },
  scanFrame: {
    width: "100%",
    height: 360,
    maxWidth: 360,
    borderWidth: 2,
    borderColor: colors.text.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
    overflow: "hidden",
  },
  cameraIconContainer: {
    width: "100%",
    height: "100%",
  },
  guidelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
  },
  guidelineItem: {
    flex: 1,
    minWidth: 100,
    backgroundColor: "#1B1F2A",
    borderRadius: 14,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#232838",
  },
  guidelineIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  guidelineText: {
    color: colors.text.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  scanButton: {
    backgroundColor: "#C9B6FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  scanHint: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
  },
  manualCard: {
    backgroundColor: "#11131A",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#1F2430",
    gap: 14,
  },
  manualOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#171B26",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  optionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCopy: {
    flex: 1,
  },
  optionTitle: {
    color: colors.text.primary,
    fontWeight: "600",
    fontSize: 15,
  },
  optionSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 4,
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
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: Platform.OS === "ios" ? 20 : 40,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  flashButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: "#FF6B6B",
    backgroundColor: "transparent",
  },
  guideContainer: {
    position: "absolute",
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  guideText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  rescanButton: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  rescanText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
