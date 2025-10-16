import React, { useState } from "react";
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
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

const banner = require("../../../../../../../assets/images/motor-bg.png");

type VehicleCard = {
  id: string;
  plate: string;
  badge: "Excellent" | "Good" | "InspectionRequired";
  inspector: string;
  inspectedAt: string;
  batteryPct: number;
  rangeKm: number;
  physicalStatus: "Ready" | "Good shape" | "Not Ready";
  priority: "High" | "Normal";
  disabled?: boolean;
};

const mockVehicles: VehicleCard[] = [
  {
    id: "v1",
    plate: "59X1-12345",
    badge: "Excellent",
    inspector: "Minh Phan",
    inspectedAt: "Sep 15, 8:45 AM",
    batteryPct: 92,
    rangeKm: 108,
    physicalStatus: "Ready",
    priority: "Normal",
  },
  {
    id: "v2",
    plate: "59X1-23456",
    badge: "Good",
    inspector: "Minh Phan",
    inspectedAt: "Sep 15, 9:15 AM",
    batteryPct: 85,
    rangeKm: 103,
    physicalStatus: "Ready",
    priority: "High",
  },
  {
    id: "v3",
    plate: "59X1-45678",
    badge: "InspectionRequired",
    inspector: "—",
    inspectedAt: "—",
    batteryPct: 86,
    rangeKm: 120,
    physicalStatus: "Not Ready",
    priority: "Normal",
    disabled: true,
  },
];

type SelectVehicleScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "SelectVehicle"
>;

export const SelectVehicleScreen: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>("v1");
  const navigation = useNavigation<SelectVehicleScreenNavigationProp>();

  const renderBadge = (badge: VehicleCard["badge"]) => {
    if (badge === "Excellent")
      return (
        <Text style={[styles.badge, styles.badgeExcellent]}>Excellent</Text>
      );
    if (badge === "Good")
      return <Text style={[styles.badge, styles.badgeGood]}>Good</Text>;
    return (
      <Text style={[styles.badge, styles.badgeWarn]}>Inspection Required</Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton onPress={() => navigation.goBack()} />

        {/* Top meta */}
        <View style={styles.metaHeader}>
          <Text style={styles.metaTitle}>Select Vehicle</Text>
          <View style={styles.metaRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <AntDesign name="search" size={18} color={colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <AntDesign name="bell" size={18} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.staffBadge}>
              <Text style={styles.staffBadgeText}>ST</Text>
            </View>
          </View>
        </View>

        <View style={styles.bookedInfo}>
          <Text style={styles.bookedType}>Booked type: VinFast Evo200</Text>
          <Text style={styles.customerName}>John Nguyen</Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeaderText}>Available Vehicles</Text>
          <TouchableOpacity style={styles.filterRow}>
            <AntDesign name="filter" size={16} color={colors.text.primary} />
            <Text style={styles.filterText}>Filter & Sort</Text>
          </TouchableOpacity>
        </View>

        {mockVehicles.map((vehicle) => (
          <View
            key={vehicle.id}
            style={[styles.card, vehicle.disabled && styles.cardDisabled]}
          >
            {/* Badges row */}
            <View style={styles.badgesRow}>
              {renderBadge(vehicle.badge)}
              {vehicle.badge !== "InspectionRequired" && (
                <Text style={[styles.badge, styles.badgeMuted]}>
                  Recently inspected
                </Text>
              )}
              {vehicle.badge !== "InspectionRequired" && (
                <Text style={[styles.badge, styles.badgeMuted]}>
                  Best overall condition
                </Text>
              )}
            </View>

            {/* Banner image */}
            <Image source={banner} style={styles.banner} />

            {/* Plate + right link */}
            <View style={styles.rowBetween}>
              <Text style={styles.plate}>{vehicle.plate}</Text>
              <TouchableOpacity disabled={vehicle.disabled}>
                <Text style={styles.link}>View inspection details</Text>
              </TouchableOpacity>
            </View>

            {/* Inspector and status header */}
            <View style={styles.preInspectRow}>
              <View style={styles.rowLeft}>
                <AntDesign name="check-circle" size={14} color="#67D16C" />
                <Text style={[styles.mutedText, styles.boldText]}>
                  {" "}
                  Pre-inspected
                </Text>
                <Text style={styles.mutedText}> By {vehicle.inspector} </Text>
                <AntDesign
                  name="calendar"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.mutedText}> {vehicle.inspectedAt}</Text>
              </View>
            </View>

            {/* Battery summary */}
            <View style={styles.batterySummaryRow}>
              <View style={styles.rowLeft}>
                <FontAwesome
                  name="battery-4"
                  size={14}
                  color={colors.text.primary}
                />
                <Text style={styles.metricText}> {vehicle.batteryPct} %</Text>
              </View>
              <Text style={styles.positiveText}>Fully charged</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${vehicle.batteryPct}%` },
                ]}
              />
            </View>
            <Text style={styles.rangeText}>
              Estimated range:{" "}
              <Text style={styles.rangeValue}>{vehicle.rangeKm}km</Text>
            </Text>

            {/* Detail chips grid */}
            <View style={styles.detailGrid}>
              <View style={styles.detailCard}>
                <View style={styles.detailHeaderRow}>
                  <Text style={styles.detailLabel}>Physical Status</Text>
                  <View style={styles.valueRight}>
                    <Text style={styles.okText}>Ready</Text>
                    <AntDesign
                      name="check-circle"
                      size={12}
                      color="#67D16C"
                      style={styles.valueIcon}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.detailCard}>
                <View style={styles.detailHeaderRow}>
                  <Text style={styles.detailLabel}>Photos</Text>
                  <View style={styles.valueRight}>
                    <Text style={styles.okText}>Prepared</Text>
                    <AntDesign
                      name="check-circle"
                      size={12}
                      color="#67D16C"
                      style={styles.valueIcon}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.detailCard}>
                <View style={styles.detailHeaderRow}>
                  <Text style={styles.detailLabel}>Safety</Text>
                  <View style={styles.valueRight}>
                    <Text style={styles.okText}>Ready</Text>
                    <AntDesign
                      name="check-circle"
                      size={12}
                      color="#67D16C"
                      style={styles.valueIcon}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Footer actions */}
            <View style={styles.footerRow}>
              <TouchableOpacity disabled={vehicle.disabled}>
                <Text style={styles.link}>
                  View Details{" "}
                  <AntDesign
                    name="arrow-right"
                    size={12}
                    color={colors.text.primary}
                  />
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={vehicle.disabled}
                style={[
                  styles.selectBtn,
                  selectedId === vehicle.id && styles.selectBtnActive,
                  vehicle.disabled && styles.selectBtnDisabled,
                ]}
                onPress={() => setSelectedId(vehicle.id)}
              >
                <Text style={styles.selectBtnText}>
                  {selectedId === vehicle.id ? "Selected" : "Select"}
                </Text>
              </TouchableOpacity>
            </View>

            {vehicle.disabled && (
              <View style={styles.disabledNote}>
                <Text style={styles.disabledNoteText}>
                  Cannot select: Pre-inspection needed
                </Text>
              </View>
            )}
          </View>
        ))}

        {/* Bottom CTA */}
        <TouchableOpacity style={styles.bottomCta} onPress={() => navigation.navigate('VehicleInspection')}>
          <Text style={styles.bottomCtaText}>Inspection Motorbikes</Text>
        </TouchableOpacity>
        <Text style={styles.expireNote}>
          Only pre-inspected vehicles can be selected. Selection expires in 10
          minutes
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  metaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  metaTitle: { fontSize: 16, fontWeight: "600", color: colors.text.primary },
  metaRight: { flexDirection: "row", alignItems: "center" },
  iconBtn: { padding: 8 },
  staffBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 4,
  },
  staffBadgeText: { color: "#fff", fontWeight: "700", fontSize: 12 },
  bookedInfo: { paddingHorizontal: 16, marginBottom: 8 },
  bookedType: { color: colors.text.secondary, fontSize: 12 },
  customerName: { color: colors.text.primary, fontSize: 12 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionHeaderText: { color: colors.text.secondary, fontSize: 12 },
  filterRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  filterText: { color: colors.text.primary, marginLeft: 6 },

  card: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 12,
  },
  cardDisabled: { opacity: 0.7 },
  badgesRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  badge: {
    color: "#000",
    fontSize: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    overflow: "hidden",
  },
  badgeExcellent: { backgroundColor: "#4CAF50", color: "#fff" },
  badgeGood: { backgroundColor: "#FFB300", color: "#000" },
  badgeWarn: { backgroundColor: "#FF8A80", color: "#000" },
  badgeMuted: { backgroundColor: "#2A2A2A", color: colors.text.secondary },
  banner: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "cover",
    marginBottom: 8,
  },
  plate: { color: colors.text.primary, fontWeight: "700", fontSize: 14 },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 8,
  },
  mutedText: { color: colors.text.secondary, fontSize: 12 },
  statusRight: { marginLeft: "auto", fontSize: 12 },
  goodStatus: { color: "#67D16C" },

  metricText: { color: colors.text.primary, fontSize: 12 },
  metricTextSmall: {
    color: colors.text.secondary,
    fontSize: 12,
    marginLeft: 6,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3, marginLeft: 6 },
  dotOk: { backgroundColor: "#67D16C" },
  dotWarn: { backgroundColor: "#FFB300" },

  preInspectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 6,
  },
  boldText: { fontWeight: "600", color: colors.text.primary },
  positiveText: { color: "#67D16C", fontSize: 12 },
  batterySummaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3A3A3A",
    marginTop: 8,
  },
  progressFill: { height: 8, borderRadius: 4, backgroundColor: "#67D16C" },
  rangeText: { color: colors.text.secondary, fontSize: 12, marginTop: 6 },
  rangeValue: { color: colors.text.primary },

  detailGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 10 },
  detailCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 10,
    minWidth: "48%",
  },
  detailHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  detailLabel: { color: colors.text.primary, fontSize: 12 },
  detailValue: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  smallProgressBar: { height: 6, borderRadius: 3, backgroundColor: "#3A3A3A" },
  smallProgressFill: { height: 6, borderRadius: 3, backgroundColor: "#67D16C" },
  valueRight: { flexDirection: "row", alignItems: "center" },
  okText: { color: "#67D16C", marginRight: 6 },
  valueIcon: { marginLeft: 2 },

  footerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },
  link: {
    color: colors.text.primary,
    textDecorationLine: "underline",
    fontSize: 12,
  },
  selectBtn: {
    backgroundColor: "#2A2A2A",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  selectBtnActive: { backgroundColor: "#C9B6FF" },
  selectBtnDisabled: { backgroundColor: "#333" },
  selectBtnText: { color: "#FFFFFF", fontWeight: "600" },

  disabledNote: {
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  disabledNoteText: { color: colors.text.secondary, fontSize: 12 },

  bottomCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    borderRadius: 10,
    alignItems: "center",
    paddingVertical: 14,
    marginTop: 8,
  },
  bottomCtaText: { color: "#fff", fontWeight: "700" },
  expireNote: {
    color: colors.text.secondary,
    textAlign: "center",
    fontSize: 12,
    marginTop: 8,
  },
});
