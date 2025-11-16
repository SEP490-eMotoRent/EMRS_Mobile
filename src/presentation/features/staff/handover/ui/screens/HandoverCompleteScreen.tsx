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
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";

type HandoverCompleteScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "HandoverComplete"
>;

export const HandoverCompleteScreen: React.FC = () => {
  const navigation = useNavigation<HandoverCompleteScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Hoàn thành bàn giao"
          subtitle="John Nguyen"
          onBack={() => navigation.goBack()}
        />

        {/* Success Card */}
        <View style={styles.successCard}>
          <View style={styles.successIcon}>
            <AntDesign name="check-circle" size={28} color="#67D16C" />
          </View>
          <Text style={styles.successTitle}>
            Xe đã được cho thuê thành công
          </Text>
          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Khách hàng</Text>
              <Text style={styles.metaValue}>John Nguyen</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Thời gian hoàn thành</Text>
              <Text style={styles.metaValue}>11:05 AM</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Thời lượng</Text>
              <Text style={styles.metaValue}>35 phút</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Trạng thái</Text>
              <Text style={[styles.metaValue, styles.link]}>Đang thuê</Text>
            </View>
          </View>
        </View>

        {/* GPS Tracking Status (placeholder map box) */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Trạng thái theo dõi GPS</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Theo dõi thời gian thực</Text>
            <Text style={styles.okPill}>ĐANG HOẠT ĐỘNG</Text>
          </View>
          <View style={styles.mapBox}>
            <Text style={styles.subtle}>Bản đồ</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Mức pin</Text>
            <Text style={styles.subtle}>92%</Text>
          </View>
          <Text style={styles.muted}>Chia sẻ vị trí khách hàng đã bật</Text>
        </View>

        {/* Customer Journey Next Steps */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            Các bước tiếp theo của khách hàng
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Trạng thái hành trình khách hàng</Text>
            <Text style={styles.subtle}>Đang thuê</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Dự kiến trả xe</Text>
            <Text style={styles.subtle}>23/09/2025 lúc 11:00 AM</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Thông báo chuẩn bị trả xe</Text>
            <Text style={styles.subtle}>21/09</Text>
          </View>
        </View>

        {/* Staff Next Actions */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>
            Hành động tiếp theo của nhân viên
          </Text>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Bàn giao tiếp theo</Text>
            <Text style={styles.subtle}>2:30 PM (3 giờ)</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Chuẩn bị cho</Text>
            <Text style={styles.subtle}>Sarah Chen - Klara S</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subtle}>Thời gian rảnh</Text>
            <Text style={styles.subtle}>2.5 giờ</Text>
          </View>
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            Làm tốt lắm! Một bàn giao thành công nữa{"\n"}Bạn đã hoàn thành 47
            bàn giao trong tháng này{"\n"}Điểm đánh giá khách hàng: 4.8/5
          </Text>
        </View>

        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => navigation.navigate("Rental")}
        >
          <Text style={styles.primaryCtaText}>Về trang chủ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryCta}>
          <Text style={styles.secondaryCtaText}>Xem đặt chỗ tiếp theo →</Text>
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
  scroll: { paddingBottom: 24 },
  successCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    margin: 16,
    padding: 12,
  },
  successIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 10,
  },
  successTitle: {
    color: colors.text.primary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: 10,
  },
  metaGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  metaCell: {
    flexBasis: "48%",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    padding: 10,
  },
  metaLabel: { color: colors.text.secondary, fontSize: 12 },
  metaValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  link: { color: "#67D16C" },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  subtle: { color: colors.text.primary },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  mapBox: {
    height: 120,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  muted: { color: colors.text.secondary, fontSize: 12 },
  noteCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  noteText: { color: colors.text.secondary, textAlign: "center" },
  primaryCta: {
    backgroundColor: "#C9B6FF",
    margin: 16,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
  },
  primaryCtaText: { color: "#000", fontWeight: "700" },
  secondaryCta: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#363636",
    marginBottom: 16,
  },
  secondaryCtaText: { color: colors.text.primary, fontWeight: "600" },
  okPill: {
    color: "#0F0",
    backgroundColor: "#0B2F1A",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 999,
    fontSize: 12,
    fontWeight: "700",
  },
});
