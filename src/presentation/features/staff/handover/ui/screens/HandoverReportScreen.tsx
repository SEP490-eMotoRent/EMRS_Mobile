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
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";

const vehicleImg = require("../../../../../../../assets/images/motor.png");

type HandoverReportNav = StackNavigationProp<
  StaffStackParamList,
  "HandoverReport"
>;

export const HandoverReportScreen: React.FC = () => {
  const navigation = useNavigation<HandoverReportNav>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton onPress={() => navigation.goBack()} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Handover Report</Text>
            <Text style={styles.subtitle}>Ready to send</Text>
          </View>
          <View style={styles.titleRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <AntDesign
                name="share-alt"
                size={18}
                color={colors.text.primary}
              />
            </TouchableOpacity>
            <View style={styles.staffBadge}>
              <Text style={styles.staffText}>ST</Text>
            </View>
          </View>
        </View>

        {/* Customer Information */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Customer Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
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
            <Text style={styles.infoLabel}>Booking</Text>
            <Text style={styles.infoValue}>#EMR240915001</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Booking Date</Text>
            <Text style={styles.infoValue}>06/09/2025</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Handover Time</Text>
            <Text style={styles.infoValue}>06/09/2025 - 12:05</Text>
          </View>
        </View>

        {/* Vehicle Specifications */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Vehicle Specifications</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Motorbike Type</Text>
            <Text style={styles.infoValue}>VinFast Evo200</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Battery</Text>
            <Text style={styles.infoValue}>92% • 180km range</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Odometer</Text>
            <Text style={styles.infoValue}>2,487 km</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Number plate</Text>
            <Text style={styles.infoValue}>59X1-12345</Text>
          </View>
        </View>

        {/* Inspection Results */}
        <View style={styles.card}>
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
        </View>

        {/* Photo Gallery */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Photo Gallery</Text>
          <View style={styles.galleryRow}>
            {["Front", "Back"].map((t, i) => (
              <View key={i} style={styles.galleryItem}>
                <Image source={vehicleImg} style={styles.galleryImage} />
                <Text style={styles.galleryLabel}>{t}</Text>
              </View>
            ))}
          </View>
          <View style={styles.galleryRow}>
            {["Left", "Right"].map((t, i) => (
              <View key={i} style={styles.galleryItem}>
                <Image source={vehicleImg} style={styles.galleryImage} />
                <Text style={styles.galleryLabel}>{t}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Report Verification */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Report Verification</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Staff member</Text>
              <Text style={styles.metaValue}>Minh Pham</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Inspection time</Text>
              <Text style={styles.metaValue}>15 minutes</Text>
            </View>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Location</Text>
              <Text style={styles.metaValue}>District 2 Branch</Text>
            </View>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>Report ID</Text>
              <Text style={styles.metaValue}>REP-15-240915-001</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA */}
        <TouchableOpacity style={styles.sendCta} onPress={() => navigation.navigate('AwaitingApproval')}>
          <AntDesign name="send" size={16} color="#000" />
          <Text style={styles.sendCtaText}>Send to Customer</Text>
        </TouchableOpacity>
        <Text style={styles.noteText}>
          Customer will receive notification to approve. Report expires in 30
          minutes if not reviewed.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
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
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  infoLabel: { color: colors.text.secondary, fontSize: 12 },
  infoValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  valueRight: { flexDirection: "row", alignItems: "center" },
  valueIcon: { marginLeft: 6 },
  okText: { color: "#67D16C", fontWeight: "600" },

  galleryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    marginBottom: 10,
  },
  galleryItem: {
    width: "32%",
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 8,
    alignItems: "center",
  },
  galleryImage: { width: "100%", height: 70, resizeMode: "contain" },
  galleryLabel: { color: colors.text.secondary, fontSize: 12, marginTop: 6 },
  tipText: { color: colors.text.secondary, fontSize: 12, textAlign: "right" },

  metaRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  metaBox: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  metaLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  metaValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },

  sendCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  sendCtaText: { color: "#000", fontWeight: "700" },
  noteText: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
});
