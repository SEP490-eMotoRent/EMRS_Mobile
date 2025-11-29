import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { useNavigation, useRoute } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";

type AwaitingApprovalScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AwaitingApproval"
>;

export const AwaitingApprovalScreen: React.FC = () => {
  const navigation = useNavigation<AwaitingApprovalScreenNavigationProp>();
  const route = useRoute();
  const status = (route.params as any)?.status as
    | ("pending" | "approved" | "denied")
    | undefined;

  const handleBackToHome = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Rental" }],
    });
  };

  const getStatusConfig = () => {
    if (!status || status === "pending") {
      return {
        icon: "clock-circle",
        iconColor: "#FFD700",
        bgColor: "rgba(255,211,102,0.15)",
        title: "Đang chờ phê duyệt",
        subtitle: "Báo cáo đã được gửi tới khách hàng",
        description: "Đang chờ khách hàng xác nhận...",
        cardStyle: styles.cardPending,
      };
    }
    if (status === "approved") {
      return {
        icon: "check-circle",
        iconColor: "#67D16C",
        bgColor: "rgba(103,209,108,0.15)",
        title: "Đã được phê duyệt",
        subtitle: "Khách hàng đã xác nhận báo cáo",
        description: "Chữ ký số đã được ghi nhận\nThời gian: 10:52 AM",
        cardStyle: styles.cardApproved,
      };
    }
    return {
      icon: "close-circle",
      iconColor: "#FF6B6B",
      bgColor: "rgba(255,107,107,0.15)",
      title: "Đã bị từ chối",
      subtitle: "Khách hàng không đồng ý với báo cáo",
      description: "Cần kiểm tra lại xe\nThời gian: 10:52 AM",
      cardStyle: styles.cardDenied,
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <ScreenHeader
          title="Chờ phê duyệt"
          subtitle="John Nguyen"
          onBack={() => navigation.goBack()}
        />

        {/* Status card */}
        <View style={[styles.statusCard, statusConfig.cardStyle]}>
          <View style={[styles.statusIconContainer, { backgroundColor: statusConfig.bgColor }]}>
            <AntDesign
              name={statusConfig.icon as any}
              size={48}
              color={statusConfig.iconColor}
            />
          </View>
          <Text style={styles.statusTitle}>{statusConfig.title}</Text>
          <Text style={styles.statusSubtitle}>{statusConfig.subtitle}</Text>
          <Text style={styles.statusDescription}>{statusConfig.description}</Text>
          
          {(!status || status === "pending") && (
            <View style={styles.pendingIndicator}>
              <View style={styles.pendingDot} />
              <Text style={styles.pendingText}>Đang xử lý...</Text>
            </View>
          )}
        </View>

        {/* Report Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="file-text" size={18} color="#7CFFCB" />
              </View>
              <Text style={styles.cardHeaderTitle}>Tóm tắt báo cáo</Text>
            </View>
          </View>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryBox}>
              <View style={styles.summaryBoxIcon}>
                <AntDesign name="car" size={16} color="#C9B6FF" />
              </View>
              <Text style={styles.summaryLabel}>Xe</Text>
              <Text style={styles.summaryValue}>
                VinFast Evo200
              </Text>
              <Text style={styles.summarySubvalue}>59X1-12345</Text>
            </View>
            <View style={styles.summaryBox}>
              <View style={styles.summaryBoxIcon}>
                <AntDesign name="clock-circle" size={16} color="#FFD666" />
              </View>
              <Text style={styles.summaryLabel}>Thời gian bắt đầu</Text>
              <Text style={styles.summaryValue}>10:30 AM</Text>
            </View>
            <View style={styles.summaryBox}>
              <View style={styles.summaryBoxIcon}>
                <AntDesign name="check-square" size={16} color="#67D16C" />
              </View>
              <Text style={styles.summaryLabel}>Danh sách kiểm tra</Text>
              <Text style={styles.summaryValue}>Tuyệt vời</Text>
            </View>
            <View style={styles.summaryBox}>
              <View style={styles.summaryBoxIcon}>
                <AntDesign name="camera" size={16} color="#7DB3FF" />
              </View>
              <Text style={styles.summaryLabel}>Ảnh</Text>
              <Text style={styles.summaryValue}>4 góc đã chụp</Text>
            </View>
          </View>
        </View>

        {/* Live Updates */}
        <View style={styles.updatesCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <View style={styles.cardHeaderIcon}>
                <AntDesign name="sync" size={18} color="#FFD666" />
              </View>
              <Text style={styles.cardHeaderTitle}>Cập nhật trạng thái</Text>
            </View>
          </View>
          <View style={styles.timelineContainer}>
            {[
              { label: "Đã chọn xe", completed: true },
              { label: "Đã kiểm tra", completed: true },
              { label: "Đã tạo báo cáo", completed: true },
              { label: "Đang chờ phê duyệt...", completed: false },
            ].map((item, idx) => (
              <View key={idx} style={styles.timelineItem}>
                <View style={styles.timelineLine}>
                  {idx > 0 && <View style={[styles.timelineConnector, item.completed && styles.timelineConnectorActive]} />}
                  <View style={[styles.timelineDot, item.completed ? styles.timelineDotCompleted : styles.timelineDotPending]}>
                    {item.completed ? (
                      <AntDesign name="check" size={12} color="#FFFFFF" />
                    ) : (
                      <View style={styles.timelineDotInner} />
                    )}
                  </View>
                  {idx < 3 && <View style={[styles.timelineConnector, item.completed && styles.timelineConnectorActive]} />}
                </View>
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineText, item.completed && styles.timelineTextCompleted]}>
                    {item.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.refreshBtn}>
            <View style={styles.refreshBtnContent}>
              <AntDesign name="reload" size={16} color="#7CFFCB" />
              <Text style={styles.refreshText}>Làm mới trạng thái</Text>
            </View>
          </TouchableOpacity>

          {(!status || status === "pending") && (
            <TouchableOpacity
              style={[styles.stateBtn, styles.pendingBtn]}
              disabled
            >
              <View style={styles.stateBtnContent}>
                <AntDesign name="clock-circle" size={18} color="#9CA3AF" />
                <Text style={styles.stateBtnTextPending}>Đang chờ...</Text>
              </View>
            </TouchableOpacity>
          )}
          
          {status === "approved" && (
            <TouchableOpacity
              style={[styles.stateBtn, styles.approvedBtn]}
              onPress={() => navigation.navigate("HandoverDocument")}
            >
              <View style={styles.stateBtnContent}>
                <AntDesign name="check-circle" size={18} color="#0B0B0F" />
                <Text style={styles.stateBtnText}>Hoàn tất bàn giao</Text>
                <AntDesign name="right" size={14} color="#0B0B0F" />
              </View>
            </TouchableOpacity>
          )}
          
          {status === "denied" && (
            <TouchableOpacity style={[styles.stateBtn, styles.deniedBtn]}>
              <View style={styles.stateBtnContent}>
                <AntDesign name="reload" size={18} color="#FFFFFF" />
                <Text style={styles.stateBtnTextDenied}>Kiểm tra lại</Text>
              </View>
            </TouchableOpacity>
          )}

          {/* Back to Home Button */}
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={handleBackToHome}
          >
            <View style={styles.homeBtnContent}>
              <AntDesign name="home" size={18} color={colors.text.primary} />
              <Text style={styles.homeBtnText}>Về trang chủ</Text>
            </View>
          </TouchableOpacity>
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
  statusCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 24,
    marginBottom: 16,
    marginTop: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPending: {
    borderColor: "rgba(255,211,102,0.3)",
  },
  cardApproved: {
    borderColor: "rgba(103,209,108,0.3)",
    backgroundColor: "rgba(11,47,26,0.3)",
  },
  cardDenied: {
    borderColor: "rgba(255,107,107,0.3)",
    backgroundColor: "rgba(58,30,30,0.3)",
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  statusTitle: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  statusSubtitle: {
    color: colors.text.secondary,
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  statusDescription: {
    color: colors.text.secondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 20,
  },
  pendingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "rgba(255,211,102,0.15)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  pendingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
  },
  pendingText: {
    color: "#FFD700",
    fontSize: 12,
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
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
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    minWidth: "47%",
    backgroundColor: "#1B1F2A",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#232838",
    alignItems: "center",
  },
  summaryBoxIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  summaryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 8,
    textAlign: "center",
  },
  summaryValue: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
  },
  summarySubvalue: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  updatesCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    marginHorizontal: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
  },
  timelineContainer: {
    gap: 16,
  },
  timelineItem: {
    flexDirection: "row",
    gap: 16,
  },
  timelineLine: {
    alignItems: "center",
    width: 24,
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: "#2F3545",
    minHeight: 20,
  },
  timelineConnectorActive: {
    backgroundColor: "#67D16C",
  },
  timelineDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  timelineDotCompleted: {
    backgroundColor: "#67D16C",
    borderColor: "#67D16C",
  },
  timelineDotPending: {
    backgroundColor: "transparent",
    borderColor: "#FFD700",
  },
  timelineDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FFD700",
  },
  timelineContent: {
    flex: 1,
    justifyContent: "center",
  },
  timelineText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  timelineTextCompleted: {
    color: colors.text.primary,
    fontWeight: "600",
  },
  actionsContainer: {
    gap: 12,
    marginTop: 8,
  },
  refreshBtn: {
    marginHorizontal: 16,
    backgroundColor: "#1B1F2A",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232838",
  },
  refreshBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
  },
  refreshText: {
    color: "#7CFFCB",
    fontSize: 14,
    fontWeight: "600",
  },
  stateBtn: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stateBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  pendingBtn: {
    backgroundColor: "#2F3545",
    shadowOpacity: 0,
    elevation: 0,
  },
  stateBtnTextPending: {
    color: "#9CA3AF",
    fontSize: 16,
    fontWeight: "700",
  },
  approvedBtn: {
    backgroundColor: "#67D16C",
  },
  stateBtnText: {
    color: "#0B0B0F",
    fontSize: 16,
    fontWeight: "700",
  },
  deniedBtn: {
    backgroundColor: "#FF6B6B",
  },
  stateBtnTextDenied: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  homeBtn: {
    marginHorizontal: 16,
    backgroundColor: "transparent",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#232838",
    marginBottom: 20,
  },
  homeBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  homeBtnText: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "600",
  },
});
