import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { GenerateContractUseCase } from "../../../../../../domain/usecases/contract/GenerateContractUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import Toast from "react-native-toast-message";
import { GetDetailRentalReceiptUseCase } from "../../../../../../domain/usecases/receipt/GetDetailRentalReceipt";
import { GetListRentalReceiptUseCase } from "../../../../../../domain/usecases/receipt/GetListRentalReceipt";
import { RentalReceipt } from "../../../../../../domain/entities/booking/RentalReceipt";
import { useGetLastReceipt } from "../../../return/ui/hooks/useGetLastReceipt";

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
    // receiptId,
    // notes,
    // startOdometerKm,
    // startBatteryPercentage,
    bookingId,
    // handOverVehicleImageFiles,
    // returnVehicleImageFiles,
    // checkListFile,
  } = route.params || {};
  const [rentalReceipts, setRentalReceipts] = useState<RentalReceipt[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getLastReceipt } = useGetLastReceipt({ bookingId });

  // Handle array data from response
  const handOverImages = useMemo(() => {
    if (Array.isArray(getLastReceipt()?.handOverVehicleImageFiles))
      return getLastReceipt()?.handOverVehicleImageFiles;
    if (getLastReceipt()?.handOverVehicleImageFiles)
      return [getLastReceipt()?.handOverVehicleImageFiles];
    return [];
  }, [getLastReceipt()?.handOverVehicleImageFiles]);

  const checklistImages = useMemo(() => {
    if (Array.isArray(getLastReceipt()?.checkListHandoverFile))
      return getLastReceipt()?.checkListHandoverFile;
    if (getLastReceipt()?.checkListHandoverFile)
      return [getLastReceipt()?.checkListHandoverFile];
    return [];
  }, [getLastReceipt()?.checkListHandoverFile]);

  const getImageLabel = (index: number, total: number) => {
    const labels = ["Mặt trước", "Mặt sau", "Bên trái", "Bên phải"];
    return labels[index] || `Ảnh ${index + 1}`;
  };
  const generateConstract = async () => {
    try {
      setIsLoading(true);
      const generateContractUseCase = new GenerateContractUseCase(
        sl.get("ReceiptRepository")
      );
      const response = await generateContractUseCase.execute(
        bookingId,
        getLastReceipt()?.id || ""
      );
      // if (response.success) {
      Toast.show({
        text1: "Đã gửi báo cáo bàn giao cho khách hàng",
        type: "success",
      });
      navigation.navigate("AwaitingApproval", { bookingId: bookingId });
      // }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeader
          title="Báo cáo bàn giao"
          subtitle="Sẵn sàng gửi"
          onBack={() => navigation.goBack()}
        />

        {/* Status Banner */}
        <View style={styles.statusBanner}>
          <View style={styles.statusIconContainer}>
            <AntDesign name="check-circle" size={24} color="#67D16C" />
          </View>
          <View style={styles.statusContent}>
            <Text style={styles.statusTitle}>Báo cáo đã hoàn tất</Text>
            <Text style={styles.statusSubtitle}>
              Tất cả thông tin đã được ghi nhận và sẵn sàng gửi
            </Text>
          </View>
        </View>

        {/* Vehicle Status Cards */}
        <View style={styles.metricsRow}>
          <View style={[styles.metricCard, styles.batteryCard]}>
            <View style={styles.metricIconContainer}>
              <MaterialIcons
                name="battery-charging-full"
                size={24}
                color="#67D16C"
              />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Mức pin</Text>
              <Text style={styles.metricValue}>
                {getLastReceipt()?.startBatteryPercentage || 0}%
              </Text>
            </View>
          </View>
          <View style={[styles.metricCard, styles.odometerCard]}>
            <View style={styles.metricIconContainer}>
              <MaterialIcons name="speed" size={24} color="#7DB3FF" />
            </View>
            <View style={styles.metricContent}>
              <Text style={styles.metricLabel}>Số km</Text>
              <Text style={styles.metricValue}>
                {getLastReceipt()?.startOdometerKm || 0} km
              </Text>
            </View>
          </View>
        </View>

        {/* Booking Information */}
        <View style={styles.card}>
          <View style={styles.cardHeaderContainer}>
            <View style={styles.cardHeaderIcon}>
              <AntDesign name="file-text" size={18} color="#C9B6FF" />
            </View>
            <Text style={styles.cardHeader}>Thông tin đặt chỗ</Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <MaterialIcons
                name="confirmation-number"
                size={16}
                color={colors.text.secondary}
              />
              <Text style={styles.infoLabel}>Mã đặt chỗ</Text>
            </View>
            <Text style={styles.infoValue}>
              #{bookingId?.substring(0, 8) || "N/A"}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <View style={styles.infoLeft}>
              <AntDesign
                name="idcard"
                size={16}
                color={colors.text.secondary}
              />
              <Text style={styles.infoLabel}>Mã báo cáo</Text>
            </View>
            <Text style={styles.infoValue}>
              #{getLastReceipt()?.id?.substring(0, 8) || "N/A"}
            </Text>
          </View>
          {getLastReceipt()?.notes && (
            <View style={[styles.infoRow]}>
              <View style={styles.infoLeft}>
                <AntDesign
                  name="file-text"
                  size={16}
                  color={colors.text.secondary}
                />
                <Text style={styles.infoLabel}>Ghi chú</Text>
              </View>
              <Text style={[styles.infoValue]}>{getLastReceipt()?.notes}</Text>
            </View>
          )}
        </View>

        {/* Vehicle Images Gallery */}
        {handOverImages.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeaderContainer}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="camera" size={18} color="#C9B6FF" />
              </View>
              <Text style={styles.cardHeader}>Ảnh xe bàn giao</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{handOverImages.length}</Text>
              </View>
            </View>
            <View style={styles.galleryGrid}>
              {handOverImages.map((imageUrl, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image
                    source={{ uri: imageUrl }}
                    style={styles.galleryImage}
                    resizeMode="cover"
                  />
                  <View style={styles.galleryOverlay}>
                    <Text style={styles.galleryLabel}>
                      {getImageLabel(index, handOverImages.length)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Checklist Images */}
        {checklistImages.length > 0 && (
          <View style={styles.card}>
            <View style={styles.cardHeaderContainer}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="check-circle" size={18} color="#67D16C" />
              </View>
              <Text style={styles.cardHeader}>Danh sách kiểm tra</Text>
            </View>
            {checklistImages.map((imageUrl, index) => (
              <View key={index} style={styles.checklistContainer}>
                <Image
                  source={{ uri: imageUrl }}
                  style={styles.checklistImage}
                  resizeMode="cover"
                />
                {checklistImages.length > 1 && (
                  <Text style={styles.checklistLabel}>
                    Trang {index + 1}/{checklistImages.length}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Report Verification */}
        <View style={styles.card}>
          <View style={styles.cardHeaderContainer}>
            <View style={styles.cardHeaderIcon}>
              <AntDesign name="user" size={18} color="#C9B6FF" />
            </View>
            <Text style={styles.cardHeader}>Xác minh báo cáo</Text>
          </View>
          <View style={styles.verificationRow}>
            <View style={styles.verificationItem}>
              <View style={styles.verificationIcon}>
                <AntDesign name="user" size={20} color="#C9B6FF" />
              </View>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationLabel}>Nhân viên</Text>
                <Text style={styles.verificationValue}>
                  {user?.fullName || "N/A"}
                </Text>
              </View>
            </View>
            <View style={styles.verificationItem}>
              <View style={styles.verificationIcon}>
                <AntDesign name="environment" size={20} color="#C9B6FF" />
              </View>
              <View style={styles.verificationContent}>
                <Text style={styles.verificationLabel}>Chi nhánh</Text>
                <Text style={styles.verificationValue}>
                  {user?.branchName || "N/A"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <View style={styles.ctaContainer}>
          <TouchableOpacity
            style={[styles.sendCta, isLoading && styles.sendCtaDisabled]}
            onPress={generateConstract}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#000" />
            ) : (
              <>
                <AntDesign name="send" size={18} color="#000" />
                <Text style={styles.sendCtaText}>Gửi cho khách hàng</Text>
              </>
            )}
          </TouchableOpacity>
          <View style={styles.infoBox}>
            <AntDesign
              name="info-circle"
              size={14}
              color={colors.text.secondary}
            />
            <Text style={styles.noteText}>
              Khách hàng sẽ nhận được thông báo để phê duyệt. Báo cáo sẽ hết hạn
              sau 30 phút nếu không được xem xét.
            </Text>
          </View>
        </View>
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
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(103, 209, 108, 0.1)",
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(103, 209, 108, 0.2)",
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(103, 209, 108, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  statusContent: {
    flex: 1,
  },
  statusTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  statusSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 16,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  metricCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
  },
  batteryCard: {
    backgroundColor: "rgba(103, 209, 108, 0.1)",
    borderColor: "rgba(103, 209, 108, 0.2)",
  },
  odometerCard: {
    backgroundColor: "rgba(125, 179, 255, 0.1)",
    borderColor: "rgba(125, 179, 255, 0.2)",
  },
  metricIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  metricContent: {
    flex: 1,
  },
  metricLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  metricValue: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
  },
  card: {
    backgroundColor: "#1A1D26",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2A2D36",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  cardHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(201, 182, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  badge: {
    backgroundColor: "rgba(201, 182, 255, 0.2)",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "700",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2D36",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#3A3D46",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  infoLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
  },
  infoValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "right",
    flex: 1,
  },
  notesRow: {
    alignItems: "flex-start",
  },
  notesValue: {
    textAlign: "left",
    marginTop: 4,
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  galleryItem: {
    width: "48%",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2D36",
    position: "relative",
  },
  galleryImage: {
    width: "100%",
    height: 140,
    backgroundColor: "#2A2D36",
  },
  galleryOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  galleryLabel: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  checklistContainer: {
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2A2D36",
    marginBottom: 12,
    backgroundColor: "#2A2D36",
    height: 1500,
  },
  checklistImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#2A2D36",
  },
  checklistLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    paddingVertical: 8,
    fontWeight: "600",
  },
  verificationRow: {
    gap: 12,
  },
  verificationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2D36",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3D46",
  },
  verificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(201, 182, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  verificationContent: {
    flex: 1,
  },
  verificationLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  verificationValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  ctaContainer: {
    marginTop: 8,
  },
  sendCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#C9B6FF",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  sendCtaText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },
  sendCtaDisabled: {
    opacity: 0.6,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(201, 182, 255, 0.1)",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "rgba(201, 182, 255, 0.2)",
    gap: 10,
  },
  noteText: {
    color: colors.text.secondary,
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
});
