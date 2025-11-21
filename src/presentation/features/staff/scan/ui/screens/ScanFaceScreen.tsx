import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScanFaceUseCase } from "../../../../../../domain/usecases/account/ScanFaceUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import * as ImagePicker from "expo-image-picker";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";

type ScanFaceScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "ScanFace"
>;

export const ScanFaceScreen: React.FC = () => {
  const navigation = useNavigation<ScanFaceScreenNavigationProp>();
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const handleStartFacialScan = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== "granted") {
        console.warn("Camera permission not granted");
        return;
      }

      const capture = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.front,
        allowsEditing: true,
        quality: 0.7,
      });
      if (capture.canceled || !capture.assets?.[0]?.uri) {
        return;
      }

      const imageUri = capture.assets[0].uri;

      // Fix mirror image from front camera by flipping horizontally
      const flipped = await manipulateAsync(
        imageUri,
        [{ flip: FlipType.Horizontal }],
        { compress: 0.8, format: SaveFormat.JPEG }
      );

      setLoading(true);
      const scanFaceUseCase = new ScanFaceUseCase(sl.get("RenterRepository"));
      const response = await scanFaceUseCase.execute({
        image: flipped.uri,
      });

      if (response.success) {
        navigation.navigate("ScanResult", { renter: response.data });
      }
    } catch (error) {
      console.error("Error scanning face:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScanID = () => {
    console.log("Scan ID Document");
  };

  const handleEnterOTP = () => {
    console.log("Enter OTP sent to customer");
  };

  const handleCallManager = () => {
    navigation.navigate("ScanResult", {
      renter: {
        id: "019a9afd-4826-7221-9342-cfdb46a9153d",
        email: "test@test.com",
        phone: "1234567890",
        address: "1234567890",
        dateOfBirth: "1234567890",
        avatarUrl: "https://via.placeholder.com/150",
        faceScanUrl: "https://via.placeholder.com/150",
        account: {
          id: "019a7d00-e789-738a-93db-af9acccb4acf",
          username: "test",
          role: "test",
          fullname: "test",
        },
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Xác minh danh tính khách hàng</Text>
        </View>

        {/* Facial Scan Interface */}
        <View style={styles.scanInterfaceSection}>
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
          <Text style={styles.scanInstruction}>Đặt khuôn mặt trong khung</Text>

          <PrimaryButton
            title="Bắt đầu quét khuôn mặt"
            onPress={handleStartFacialScan}
            style={styles.scanButton}
          />
        </View>

        {/* Manual Verification Options */}
        <View style={styles.manualVerificationSection}>
          <Text style={styles.sectionTitle}>Manual Verification Options</Text>

          <TouchableOpacity style={styles.optionButton} onPress={handleScanID}>
            <AntDesign name="idcard" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Scan ID Document</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleEnterOTP}
          >
            <AntDesign name="message" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Enter OTP sent to customer</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleCallManager}
          >
            <AntDesign name="phone" size={16} color={colors.text.primary} />
            <Text style={styles.optionText}>Call Manager for override</Text>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Loading Modal while scanning */}
      <Modal transparent visible={loading} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang quét khuôn mặt</Text>
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
    paddingHorizontal: 16,
    paddingBottom: 100, // Space for bottom navigation
  },
  appHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  menuButton: {
    padding: 8,
  },
  header: {
    paddingVertical: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  bookingId: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: colors.text.primary,
    fontWeight: "600",
  },
  customerInfoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 16,
  },
  customerCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  customerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#444444",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 20,
  },
  avatarText: {
    fontSize: 32,
  },
  customerDetails: {
    flex: 1,
  },
  customerNameLarge: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 4,
  },
  customerStatus: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  customerPhone: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  customerVehicle: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  pickupTime: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  scanInterfaceSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  scanFrame: {
    width: 350,
    height: 400,
    borderWidth: 2,
    borderColor: colors.text.primary,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
    overflow: "hidden",
  },
  scanFrameInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cameraIconContainer: {
    width: "100%",
    height: "100%",
  },
  scanInstruction: {
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  scanButton: {
    backgroundColor: "#C9B6FF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: "center",
  },
  scanButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  manualVerificationSection: {
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    color: colors.text.primary,
    fontSize: 16,
    marginLeft: 12,
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
