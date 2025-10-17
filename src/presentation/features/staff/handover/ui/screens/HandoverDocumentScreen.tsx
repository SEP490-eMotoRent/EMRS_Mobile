import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { BrandTitle } from "../../../../authentication/ui/atoms";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
const leftImage = require("../../../../../../../assets/images/left.png");
const rightImage = require("../../../../../../../assets/images/right.png");
const frontImage = require("../../../../../../../assets/images/front.png");

type Nav = StackNavigationProp<StaffStackParamList, "HandoverDocument">;

export const HandoverDocumentScreen: React.FC = () => {
  const navigation = useNavigation<Nav>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Handover Document"
          subtitle="John Nguyen"
          onBack={() => navigation.goBack()}
        />

        {/* Header Card */}
        <View style={styles.headerCard}>
          <BrandTitle
            style={styles.brandTitle}
            textStyle={styles.brandTitleText}
          />
          <Text style={styles.company}>
            Công ty TNHH eMotoRent - Thuê xe máy điện eMotoRent
          </Text>
          <Text style={styles.address}>
            Số 123 Đường Nguyễn Huệ, Quận 1, TP.HCM
          </Text>
          <Text style={styles.title}>Biên bản Bàn giao Xe máy điện</Text>
        </View>

        {/* Booking Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin Booking</Text>
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>Mã Booking:</Text>
            <Text style={styles.rowValue}>BK001-345-987</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>Ngày đặt:</Text>
            <Text style={styles.rowValue}>03/09/2025</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>Thời gian bàn giao:</Text>
            <Text style={styles.rowValue}>06/09/2025 12:05</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>Họ tên:</Text>
            <Text style={styles.rowValue}>NGUYỄN VĂN A</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>CCCD/Passport:</Text>
            <Text style={styles.rowValue}>049897456123</Text>
          </View>
          <View style={styles.rowBox}>
            <Text style={styles.rowLabel}>SĐT:</Text>
            <Text style={styles.rowValue}>0987654123</Text>
          </View>
        </View>

        {/* Vehicle Info */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Thông tin Xe máy điện</Text>
          <View style={styles.groupRow}>
            <View style={styles.groupBox}>
              <Text style={styles.groupTitle}>Thông số Xe</Text>
              <View style={styles.rowBox}>
                <Text style={styles.rowLabel}>Loại xe</Text>
                <Text style={styles.rowValue}>VinFast Evo200</Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={styles.rowLabel}>Biển số</Text>
                <Text style={styles.rowValue}>59X1-12345</Text>
              </View>
              <View style={styles.rowBox}>
                <Text style={styles.rowLabel}>Số odo</Text>
                <Text style={styles.rowValue}>1,562 km</Text>
              </View>
            </View>
            <View style={styles.groupBox}>
              <Text style={styles.groupTitle}>Mức Pin</Text>
              <Text style={styles.batteryPercent}>30%</Text>
              <Text style={styles.batteryNote}>Sau 6h00m sạc đầy</Text>
            </View>
          </View>
        </View>

        {/* Vehicle Photos */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Ảnh tình trạng Xe</Text>
          <View style={styles.photosRow}>
            <View style={styles.photoBox}>
              <Image source={leftImage} style={styles.photoImage} />
            </View>

            <View style={styles.photoBox}>
              <Image source={rightImage} style={styles.photoImage} />
            </View>
          </View>
          <View style={styles.photosRow}>
            <View style={styles.photoBox}>
              <Image source={frontImage} style={styles.photoImage} />
            </View>
            <View style={styles.photoBox}>
              <Image source={frontImage} style={styles.photoImage} />
            </View>
          </View>
        </View>

        {/* Checklist */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Checklist tình trạng Xe</Text>
          {[
            "Đèn tín hiệu hoạt động tốt",
            "Gương chiếu hậu nguyên vẹn",
            "Phanh trước/sau hoạt động",
            "Còi xe hoạt động tốt",
            "Đèn xi-nhan hoạt động",
            "Lốp xe tình trạng tốt",
          ].map((item, idx) => (
            <View key={idx} style={styles.checkRow}>
              <View style={styles.checkDot} />
              <Text style={styles.checkText}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Inspector & Location */}
        <View style={styles.footerMeta}>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Inspector</Text>
            <Text style={styles.metaValue}>Minh Pham</Text>
          </View>
          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>Location</Text>
            <Text style={styles.metaValue}>District 2 Branch</Text>
          </View>
        </View>
        <View style={styles.footerMeta}>
          <View style={styles.infoLine}>
            <Text style={styles.infoSmall}>Address</Text>
            <Text style={styles.infoSmall}>01 Book St, D2, HCMC</Text>
          </View>
          <View style={styles.infoLine}>
            <Text style={styles.infoSmall}>Hotline</Text>
            <Text style={styles.infoSmall}>+84 902-123-456</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => navigation.navigate("HandoverComplete")}
        >
          <Text style={styles.primaryCtaText}>Continue </Text>
          <AntDesign name="arrow-right" size={16} color="black" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 24 },
  brandTitle: {
    marginBottom: 0,
  },
  brandTitleText: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  headerCard: {
    backgroundColor: "#2A2A2A",
    margin: 16,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  brand: { color: "#FFFFFF", fontWeight: "700", marginBottom: 4 },
  company: { color: colors.text.secondary, fontSize: 12 },
  address: { color: colors.text.secondary, fontSize: 12, marginBottom: 8 },
  title: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    marginHorizontal: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontWeight: "700",
    marginBottom: 10,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#C9B6FF",
  },
  rowBox: {
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowLabel: { color: colors.text.secondary, fontSize: 12 },
  rowValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#333", marginVertical: 8 },
  groupRow: { flexDirection: "row", gap: 10 },
  groupBox: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  groupTitle: { color: colors.text.secondary, marginBottom: 6 },
  batteryPercent: { color: "#FFB300", fontWeight: "800", fontSize: 26 },
  batteryNote: { color: colors.text.secondary, fontSize: 12 },
  photosRow: { flexDirection: "row", gap: 10 },
  photoBox: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    width: 110,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    overflow: "hidden",
    marginBottom: 10,
  },
  photoImage: { width: "100%", height: "100%" },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
  },
  checkDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#67D16C",
  },
  checkText: { color: colors.text.primary },
  footerMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginTop: 8,
  },
  metaBox: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 12,
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  metaLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 4 },
  metaValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  infoLine: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  infoSmall: { color: colors.text.secondary, fontSize: 12 },
  primaryCta: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#C9B6FF",
    margin: 16,
    borderRadius: 12,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  primaryCtaText: { color: "#000", fontWeight: "800" },
});
