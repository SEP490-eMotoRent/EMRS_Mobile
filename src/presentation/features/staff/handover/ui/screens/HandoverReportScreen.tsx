import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { GenerateContractUseCase } from "../../../../../../domain/usecases/contract/GenerateContractUseCase";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import sl from "../../../../../../core/di/InjectionContainer";
import Toast from "react-native-toast-message";

type HandoverReportNav = StackNavigationProp<
  StaffStackParamList,
  "HandoverReport"
>;

type HandoverReportRouteProp = RouteProp<StaffStackParamList, "HandoverReport">;

export const HandoverReportScreen: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<HandoverReportNav>();
  const route = useRoute<HandoverReportRouteProp>();
  const {
    receiptId,
    notes,
    startOdometerKm,
    startBatteryPercentage,
    bookingId,
    vehicleFiles,
    checkListFile,
  } = route.params || {};
  const [isLoading, setIsLoading] = useState(false);

  const generateConstract = async () => {
    try {
      setIsLoading(true);
      const generateContractUseCase = new GenerateContractUseCase(
        sl.get("ReceiptRepository")
      );
      const response = await generateContractUseCase.execute(
        bookingId,
        receiptId
      );
      // if (response.success) {
      Toast.show({
        text1: "Đã gửi báo cáo bàn giao cho khách hàng",
        type: "success",
      });
      navigation.navigate("AwaitingApproval");
      // }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Báo cáo bàn giao"
          subtitle="Sẵn sàng gửi"
          onBack={() => navigation.goBack()}
        />

        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Thông tin khách hàng</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Tên</Text>
            <View style={styles.valueRight}>
              <Text style={styles.infoValue}>John Nguyen</Text>
              <AntDesign
                name="check-circle"
                size={14}
                color="#67D16C"
                style={styles.valueIcon}
              />
            </View>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Đặt chỗ</Text>
            <Text style={styles.infoValue}>#EMR240915001</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Ngày đặt chỗ</Text>
            <Text style={styles.infoValue}>06/09/2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Thời gian bàn giao</Text>
            <Text style={styles.infoValue}>06/09/2025 - 12:05</Text>
          </View>
        </View>

        {/* Vehicle Specifications */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Chi tiết kiểm tra</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mã đặt chỗ</Text>
            <Text style={styles.infoValue}>{bookingId || "N/A"}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Mức pin</Text>
            <Text style={styles.infoValue}>{startBatteryPercentage || 0}%</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Số km</Text>
            <Text style={styles.infoValue}>{startOdometerKm || 0} km</Text>
          </View>
          {notes && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ghi chú</Text>
              <Text style={styles.infoValue}>{notes}</Text>
            </View>
          )}
        </View>

        {/* Inspection Results */}
        {/* <View style={styles.card}>
          <Text style={styles.cardHeader}>Inspection Results</Text>
          {[
            ["Body & Paint", "No issues"],
            ["Wheels & Tires", "Excellent condition"],
            ["Lights & Signals", "All functional"],
            ["Controls", "Calibrated and tested"],
            ["Safety Equipment", "All provided"],
            ["Cleanliness Assessment", "Excellent Clean"],
            ["Battery & Power System", "Full Battery"],
          ].map(([k, v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{k}</Text>
              <View style={styles.valueRight}>
                <Text style={styles.okText}>{v}</Text>
                <AntDesign
                  name="check-circle"
                  size={14}
                  color="#67D16C"
                  style={styles.valueIcon}
                />
              </View>
            </View>
          ))}
        </View> */}

        {/* Photo Gallery */}
        {vehicleFiles && vehicleFiles.length > 0 && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Thư viện ảnh</Text>
            <View style={styles.galleryRow}>
              {vehicleFiles.slice(0, 2).map((imageUrl, index) => {
                const labels = ["Mặt trước", "Mặt sau"];
                return (
                  <View key={index} style={styles.galleryItem}>
                    <Image
                      source={{ uri: imageUrl }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                    <Text style={styles.galleryLabel}>{labels[index]}</Text>
                  </View>
                );
              })}
            </View>
            {vehicleFiles.length > 2 && (
              <View style={styles.galleryRow}>
                {vehicleFiles.slice(2, 4).map((imageUrl, index) => {
                  const labels = ["Bên trái", "Bên phải"];
                  return (
                    <View key={index + 2} style={styles.galleryItem}>
                      <Image
                        source={{ uri: imageUrl }}
                        style={styles.galleryImage}
                        resizeMode="cover"
                      />
                      <Text style={styles.galleryLabel}>{labels[index]}</Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Checklist File */}
            {checkListFile && (
              <View style={styles.galleryRow}>
                <View style={[styles.galleryItem, { width: "100%" }]}>
                  <Image
                    source={{ uri: checkListFile }}
                    style={styles.checklistImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.galleryLabel}>Danh sách kiểm tra</Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Report Verification */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Xác minh báo cáo</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Nhân viên</Text>
              <Text style={styles.metaValue}>{user?.fullName}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Thời gian kiểm tra</Text>
              <Text style={styles.metaValue}>15 phút</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Địa điểm</Text>
              <Text style={styles.metaValue}>Chi nhánh {user?.branchName}</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Mã báo cáo</Text>
              <Text style={styles.metaValue}>{receiptId || "N/A"}</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity
          style={[styles.sendCta, isLoading && styles.sendCtaDisabled]}
          onPress={generateConstract}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#000" />
          ) : (
            <AntDesign name="send" size={16} color="#000" />
          )}
          <Text style={styles.sendCtaText}>
            {isLoading ? "Đang gửi..." : "Gửi cho khách hàng"}
          </Text>
        </TouchableOpacity>
        <Text style={styles.noteText}>
          Khách hàng sẽ nhận được thông báo để phê duyệt. Báo cáo sẽ hết hạn sau
          30 phút nếu không được xem xét.
        </Text>
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
  subtitle: { color: colors.text.secondary, fontSize: 12 },
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

  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#C9B6FF",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  infoLabel: { color: colors.text.secondary, fontSize: 13, fontWeight: "500" },
  infoValue: { color: colors.text.primary, fontSize: 13, fontWeight: "600" },
  valueRight: { flexDirection: "row", alignItems: "center" },
  valueIcon: { marginLeft: 8 },
  okText: { color: "#67D16C", fontWeight: "700" },

  galleryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  galleryItem: {
    width: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  galleryImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
    borderRadius: 8,
  },
  checklistImage: {
    width: "100%",
    height: 1200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  galleryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 8,
    fontWeight: "600",
  },
  tipText: { color: colors.text.secondary, fontSize: 12, textAlign: "right" },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 8,
  },
  metaBox: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  metaLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "500",
  },
  metaValue: { color: colors.text.primary, fontSize: 13, fontWeight: "600" },

  sendCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 8,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  sendCtaText: { color: "#000", fontWeight: "800", fontSize: 16 },
  sendCtaDisabled: {
    opacity: 0.6,
  },
  noteText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 12,
    marginHorizontal: 16,
    lineHeight: 16,
  },
});
