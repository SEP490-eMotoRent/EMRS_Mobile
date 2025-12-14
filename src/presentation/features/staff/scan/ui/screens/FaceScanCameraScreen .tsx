import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  TouchableOpacity,
} from "react-native";
import {
  Camera as VisionCamera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import type { Camera as VisionCameraType } from "react-native-vision-camera";
import {
  Camera as DetectorCamera,
  Face,
  FaceDetectionOptions,
} from "react-native-vision-camera-face-detector";
import { ScanFaceUseCase } from "../../../../../../domain/usecases/account/ScanFaceUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import Toast from "react-native-toast-message";
import * as MediaLibrary from "expo-media-library";
import { FlipType, ImageManipulator, manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as FileSystem from "expo-file-system/legacy";
type FaceStatus = {
  yaw: "Left" | "Right" | "Center";
  pitch: "Up" | "Down" | "Center";
  eye: "Open" | "Close";
};

type ScanFaceScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "FaceScanCamera"
>;

export const FaceScanCameraScreen = () => {
  const navigation = useNavigation<ScanFaceScreenNavigationProp>();
  const { hasPermission } = useCameraPermission();
  const { width, height } = useWindowDimensions();
  const [faceStatus, setFaceStatus] = useState<FaceStatus | null>(null);
  const stableTimer = useRef<NodeJS.Timeout | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraPosition, setCameraPosition] = useState<"front" | "back">(
    "front"
  );
  const device = useCameraDevice(cameraPosition);
  const cameraRef = useRef<VisionCameraType>(null);

  useEffect(() => {
    (async () => {
      const status = await VisionCamera.requestCameraPermission();
      console.log(`Camera permission: ${status}`);

      // Request media library permission for saving photos
      const mediaStatus = await MediaLibrary.requestPermissionsAsync();
      console.log(`Media library permission: ${mediaStatus.status}`);
    })();
  }, [device]);

  // Cleanup: Close camera when component unmounts
  useEffect(() => {
    return () => {
      setIsCameraActive(false);
      if (stableTimer.current) {
        clearTimeout(stableTimer.current);
      }
    };
  }, []);

  const readableStatus = useMemo(() => {
    if (!faceStatus) {
      return {
        yaw: "Đang tìm khuôn mặt...",
        pitch: "Giữ mắt nhìn thẳng",
        eye: "Mở cả hai mắt",
      };
    }

    const yawMap = {
      Left: "Xoay nhẹ sang trái",
      Right: "Xoay nhẹ sang phải",
      Center: "Giữ mặt thẳng",
    };
    const pitchMap = {
      Up: "Hạ cằm xuống",
      Down: "Nâng cằm lên",
      Center: "Mắt ngang tầm camera",
    };
    const eyeMap = {
      Open: "Giữ mắt mở",
      Close: "Mở cả hai mắt",
    };

    return {
      yaw: yawMap[faceStatus.yaw] ?? "Giữ mặt thẳng",
      pitch: pitchMap[faceStatus.pitch] ?? "Mắt ngang tầm camera",
      eye: eyeMap[faceStatus.eye] ?? "Giữ mắt mở",
    };
  }, [faceStatus]);

  const takePicture = async () => {
    if (!cameraRef.current) return null;

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: "off",
      });
      // Flip ảnh chỉ khi dùng camera trước để tránh bị mirror
      let finalUri = "file://" + photo.path;
      if (cameraPosition === "front") {
        const fixed = await ImageManipulator.manipulateAsync(
          finalUri,
          [{ flip: FlipType.Horizontal }],
          { compress: 0.9, format: SaveFormat.JPEG }
        );
        finalUri = fixed.uri;
      }

      const file = {
        uri: finalUri,
        type: "image/jpeg",
        name: `photo_${Date.now()}.jpg`,
      };

      return file;
    } catch (err) {
      console.error("takePicture error:", err);
      return null;
    }
  };


  const faceDetectionOptions = useRef<FaceDetectionOptions>({
    performanceMode: "accurate",
    landmarkMode: "all",
    contourMode: "none",
    classificationMode: "all",
    trackingEnabled: false,
    windowWidth: width,
    windowHeight: height,
  }).current;

  const handleFacesDetection = (faces: Face[]) => {
    if (faces?.length > 0) {
      const face = faces[0];

      setFaceStatus({
        yaw:
          face.yawAngle > 15
            ? "Right"
            : face.yawAngle < -15
            ? "Left"
            : "Center",
        pitch:
          face.pitchAngle > 15
            ? "Up"
            : face.pitchAngle < -10
            ? "Down"
            : "Center",
        eye:
          face.leftEyeOpenProbability > 0.7 &&
          face.rightEyeOpenProbability > 0.7
            ? "Open"
            : "Close",
      });

      // kiểm tra mặt ổn định
      if (isFaceStable(face)) {
        if (!stableTimer.current) {
          stableTimer.current = setTimeout(() => {
            onFaceStable();
          }, 1000); // cần ổn định trong 1s
        }
      } else {
        // reset timer nếu mặt bị lệch
        if (stableTimer.current) {
          clearTimeout(stableTimer.current);
          stableTimer.current = null;
        }
      }
    } else {
      // reset nếu mất mặt
      if (stableTimer.current) {
        clearTimeout(stableTimer.current);
        stableTimer.current = null;
      }
      setFaceStatus(null);
    }
  };
  const isFaceStable = (face: Face) => {
    // 1. Kiểm tra góc đầu
    const yawOK = Math.abs(face.yawAngle) < 5;
    const pitchOK = Math.abs(face.pitchAngle) < 5;

    // 2. Kiểm tra mắt mở
    const eyesOK =
      face.leftEyeOpenProbability > 0.6 && face.rightEyeOpenProbability > 0.6;

    // 3. Kiểm tra kích thước khuôn mặt (QUAN TRỌNG)
    const faceWidth = face.bounds.width;
    const faceHeight = face.bounds.height;

    const minFaceWidth = width * 0.25; // >= 25% chiều rộng màn hình
    const minFaceHeight = height * 0.25; // >= 25% chiều cao màn hình

    const sizeOK = faceWidth > minFaceWidth && faceHeight > minFaceHeight;

    return yawOK && pitchOK && eyesOK && sizeOK;
  };

  const onFaceStable = async () => {
    if (isProcessing) return; // tránh double trigger

    setIsProcessing(true);
    // TODO: GỌI API / CHỤP ẢNH / XỬ LÝ TIẾP TỤC

    try {
      const file = await takePicture();
      if (!file) {
        Toast.show({
          type: "error",
          text1: "Không thể chụp ảnh",
          text2: "Vui lòng thử lại.",
        });
        return;
      }
      // Lưu ảnh vào thư viện trước khi gọi API
      try {
        await MediaLibrary.createAssetAsync(file.uri);
      } catch (err) {
        console.warn("Save to library failed:", err);
      }

      const scanFaceUseCase = new ScanFaceUseCase(sl.get("RenterRepository"));
      const response = await scanFaceUseCase.execute({
        image: file as any,
      });

      if (response.success) {
        // Close camera before navigating
        setIsCameraActive(false);
        // Small delay to ensure camera is closed
        setTimeout(() => {
          navigation.navigate("ScanResult", { renter: response.data });
        }, 100);
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi khi scan khuôn mặt",
          text2: response.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Đã xảy ra lỗi",
        text2: "Vui lòng thử lại sau.",
      });
    } finally {
      setIsProcessing(false);
      stableTimer.current = null;
      setFaceStatus(null);
    }
  };

  if (!hasPermission) return <Text>Camera permission is required</Text>;
  if (!device) return <Text>No camera found</Text>;

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.topControls}>
        <TouchableOpacity
          style={styles.switchCamBtn}
          onPress={() => {
            // Đổi giữa cam trước / sau
            setFaceStatus(null);
            if (stableTimer.current) {
              clearTimeout(stableTimer.current);
              stableTimer.current = null;
            }
            setCameraPosition((prev) => (prev === "front" ? "back" : "front"));
          }}
        >
          <Text style={styles.switchCamText}>
            {cameraPosition === "front" ? "Dùng cam sau" : "Dùng cam trước"}
          </Text>
        </TouchableOpacity>
      </View>

      <DetectorCamera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        photo={true}
        faceDetectionCallback={handleFacesDetection}
        faceDetectionOptions={faceDetectionOptions}
      />

      <View pointerEvents="none" style={styles.overlay}>
        <View style={styles.dimLayer} />
        <View style={styles.faceGuide}>
          <View style={styles.faceOval}>
            <Text style={styles.guideTitle}>Đưa khuôn mặt vào khung</Text>
            <Text style={styles.guideSubtitle}>
              Giữ thẳng, mở mắt và nhìn chính diện
            </Text>
          </View>
          <View style={styles.statusGroup}>
            <Text style={styles.statusText}>{readableStatus.yaw}</Text>
            <Text style={styles.statusText}>{readableStatus.pitch}</Text>
            <Text style={styles.statusText}>{readableStatus.eye}</Text>
          </View>
        </View>
      </View>

      <Modal transparent visible={isProcessing} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang xử lý khuôn mặt...</Text>
            <Text style={styles.modalSubtitle}>
              Vui lòng giữ yên trong giây lát
            </Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topControls: {
    position: "absolute",
    top: 32,
    right: 16,
    zIndex: 20,
  },
  switchCamBtn: {
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  switchCamText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.3,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  dimLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  faceGuide: {
    position: "absolute",
    alignItems: "center",
    gap: 24,
  },
  faceOval: {
    width: 260,
    height: 320,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.8)",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  guideTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  guideSubtitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
    textAlign: "center",
  },
  statusGroup: {
    backgroundColor: "rgba(0,0,0,0.65)",
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: "center",
    gap: 6,
  },
  statusText: {
    color: "#7CFFCB",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: 280,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 28,
    backgroundColor: "#111",
    gap: 12,
    alignItems: "center",
  },
  modalTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  modalSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    textAlign: "center",
  },
});
