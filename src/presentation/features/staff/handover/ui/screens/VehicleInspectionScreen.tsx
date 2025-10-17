import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";

const vehicleImg = require("../../../../../../../assets/images/motor.png");

type PhotoTileProps = {
  uri: string | null;
  labelTop?: string;
  labelBottom?: string;
  placeholderTitle?: string;
  placeholderSubtitle?: string;
  onPress: () => void;
  isPrimary?: boolean;
};

const PhotoTile: React.FC<PhotoTileProps> = ({ uri, labelTop, labelBottom, placeholderTitle, placeholderSubtitle, onPress, isPrimary }) => {
  return (
    <TouchableOpacity style={[styles.tile, isPrimary && styles.tilePrimary]} onPress={onPress} activeOpacity={0.8}>
      {uri ? (
        <>
          <Image source={{ uri }} style={styles.tileImage} />
          {labelBottom && (
            <View style={styles.retakeBadge}>
              <Text style={styles.retakeText}>{labelBottom}</Text>
            </View>
          )}
          {labelTop && <Text style={styles.tileTopLabel}>{labelTop}</Text>}
        </>
      ) : (
        <View style={styles.placeholderInner}>
          <AntDesign name="camera" size={26} color={colors.text.secondary} />
          {!!placeholderTitle && <Text style={styles.placeholderTitle}>{placeholderTitle}</Text>}
          {!!placeholderSubtitle && <Text style={styles.placeholderSubtitle}>{placeholderSubtitle}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

type InspectionNav = StackNavigationProp<
  StaffStackParamList,
  "VehicleInspection"
>;

export const VehicleInspectionScreen: React.FC = () => {
  const navigation = useNavigation<InspectionNav>();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [photos, setPhotos] = useState<Record<string, string | null>>({
    front: null,
    back: null,
    left: null,
    right: null,
  });

  const ensurePermissions = async () => {
    const cam = await ImagePicker.requestCameraPermissionsAsync();
    const lib = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return cam.status === "granted" && lib.status === "granted";
  };

  const openPicker = async (key: keyof typeof photos) => {
    const ok = await ensurePermissions();
    if (!ok) {
      Alert.alert("Permission required", "Please grant camera and media permissions.");
      return;
    }

    Alert.alert(
      "Add photo",
      "Choose source",
      [
        {
          text: "Camera",
          onPress: async () => {
            const res = await ImagePicker.launchCameraAsync({
              allowsEditing: true,
              quality: 0.7,
            });
            if (!res.canceled && res.assets?.[0]?.uri) {
              setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
            }
          },
        },
        {
          text: "Library",
          onPress: async () => {
            const res = await ImagePicker.launchImageLibraryAsync({
              allowsEditing: true,
              quality: 0.7,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
            if (!res.canceled && res.assets?.[0]?.uri) {
              setPhotos((p) => ({ ...p, [key]: res.assets[0].uri }));
            }
          },
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const sections: { key: string; title: string; items: { label: string; done: boolean }[] }[] = [
    {
      key: 'bodyPaint',
      title: 'Body & Paint (10 items)',
      items: [
        { label: 'Scratches or dents', done: true },
        { label: 'Paint condition', done: true },
        { label: 'Panel alignment', done: false },
        { label: 'Stickers/decals', done: false },
        { label: 'Overall cleanliness', done: true },
      ],
    },
    {
      key: 'batteryPower',
      title: 'Battery & Power System (4 items)',
      items: [
        { label: 'Battery mounted securely', done: true },
        { label: 'Charging port condition', done: true },
        { label: 'Cables intact', done: false },
      ],
    },
    {
      key: 'cleanliness',
      title: 'Cleanliness Assessment (6 items)',
      items: [
        { label: 'Seat and floorboards clean', done: true },
        { label: 'Mirrors clean', done: true },
        { label: 'Mudguards clean', done: true },
      ],
    },
    {
      key: 'wheelsTires',
      title: 'Wheels & Tires (4 items)',
      items: [
        { label: 'Tread ok', done: true },
        { label: 'Pressure ok', done: false },
      ],
    },
    { key: 'lights', title: 'Lights & Signals (6 items)', items: [ { label: 'Headlights', done: true }, { label: 'Turn signals', done: true } ] },
    { key: 'controls', title: 'Controls & Dashboard (8 items)', items: [ { label: 'Horn works', done: true }, { label: 'Speedo works', done: false } ] },
    { key: 'safety', title: 'Safety Equipment (3 items)', items: [ { label: 'Helmet available', done: true }, { label: 'Toolkit available', done: true } ] },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton onPress={() => navigation.goBack()} />

        {/* Title Row */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Vehicle Inspection</Text>
            <Text style={styles.subtitle}>Pre-inspection Mode</Text>
            <Text style={styles.submeta}>VinFast Evo200 · 59X1-12345</Text>
          </View>
          <View style={styles.titleRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <AntDesign name="bell" size={18} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.staffBadge}>
              <Text style={styles.staffText}>ST</Text>
            </View>
          </View>
        </View>

        {/* Required Photos */}
        <View style={styles.photosCard}>
          <Text style={styles.cardHeader}>Required Photos</Text>
          <View style={styles.photosGrid}>
            <PhotoTile
              uri={photos.front}
              placeholderTitle="Front Side"
              placeholderSubtitle="Tap to capture"
              onPress={() => openPicker("front")}
              isPrimary
            />
            <PhotoTile
              uri={photos.back}
              placeholderTitle="Back Side"
              placeholderSubtitle="Tap to capture"
              onPress={() => openPicker("back")}
            />
            <PhotoTile
              uri={photos.left}
              placeholderTitle="Left Side"
              placeholderSubtitle="Tap to capture"
              onPress={() => openPicker("left")}
            />
            <PhotoTile
              uri={photos.right}
              placeholderTitle="Right Side"
              placeholderSubtitle="Tap to capture"
              onPress={() => openPicker("right")}
            />
          </View>
        </View>

        {/* Inspection Checklist - Accordions */}
        {sections.map((section) => {
          const isOpen = !!expanded[section.key];
          return (
            <View key={section.key} style={styles.accordion}>
              <TouchableOpacity
                style={styles.accordionHeader}
                onPress={() => setExpanded((prev) => ({ ...prev, [section.key]: !prev[section.key] }))}
                activeOpacity={0.7}
              >
                <Text style={styles.accordionTitle}>{section.title}</Text>
                <AntDesign name={isOpen ? "up" : "down"} size={14} color={colors.text.secondary} />
              </TouchableOpacity>

              {isOpen && (
                <View style={styles.checklistWrap}>
                  {section.items.map((item, idx) => (
                    <View key={idx} style={styles.checkItemRow}>
                      <Text style={styles.checkItemText}>{item.label}</Text>
                      {item.done ? (
                        <AntDesign name="check-circle" size={18} color="#67D16C" />
                      ) : (
                        <View style={styles.pendingCircle} />
                      )}
                    </View>
                  ))}

                  <TouchableOpacity style={styles.addIssueRow}>
                    <AntDesign name="exclamation-circle" size={14} color="#C9B6FF" />
                    <Text style={styles.addIssueText}>Add Issue</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}

        {/* Current Status Summary */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>22 of 33</Text>
              <Text style={styles.statusCaption}>checks completed</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>3</Text>
              <Text style={styles.statusCaption}>items issues</Text>
            </View>
            <View style={styles.statusItem}>
              <Text style={styles.statusNumber}>0</Text>
              <Text style={styles.statusCaption}>ready holds</Text>
            </View>
          </View>
          <Text style={styles.readyLabel}>Ready for handover</Text>
          <View style={styles.readyProgress}>
            <View style={[styles.readyFill, { width: "67%" }]} />
          </View>
          <View style={styles.timeRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Inspection Time</Text>
            </View>
            <Text style={styles.timeText}>12 minutes</Text>
          </View>
        </View>

        {/* Inspection Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.cardHeader}>Inspection Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Overall condition</Text>
            <Text style={styles.okText}>Excellent</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Battery status</Text>
            <Text style={styles.okText}>92% – Excellent</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Photos</Text>
            <Text style={styles.okText}>Ready for handover</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Issues found</Text>
            <Text style={styles.summaryValue}>0 critical, 3 minor</Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <TouchableOpacity style={styles.primaryCta} onPress={() => navigation.navigate('HandoverReport')}>
          <Text style={styles.primaryCtaText}>Complete Inspection</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryCta}>
          <Text style={styles.secondaryCtaText}>Save & Continue Later</Text>
        </TouchableOpacity>
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
  subtitle: { color: colors.text.secondary, fontSize: 12, marginVertical: 8 },
  submeta: { color: colors.text.secondary, fontSize: 12 },
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

  photosCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  statusItem: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  photosGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  tile: { width: '48%', backgroundColor: '#2A2A2A', borderRadius: 12, height: 120, overflow: 'hidden', position: 'relative' },
  tilePrimary: { height: 120 },
  tileImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  placeholderInner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  placeholderTitle: { color: colors.text.secondary, marginTop: 10, textTransform: 'lowercase' },
  placeholderSubtitle: { color: colors.text.secondary, fontSize: 12, marginTop: 4 },
  retakeBadge: { position: 'absolute', top: 6, left: 6, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  retakeText: { color: '#fff', fontSize: 12 },
  tileTopLabel: { position: 'absolute', bottom: 6, left: 8, color: '#fff', fontWeight: '600' },

  accordion: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  accordionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  accordionTitle: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  checklistWrap: { marginTop: 10 },
  checkItemRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 },
  checkItemText: { color: colors.text.primary, fontSize: 14 },
  pendingCircle: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#3A3A3A' },
  addIssueRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 6, marginTop: 6 },
  addIssueText: { color: '#C9B6FF', fontSize: 14 },

  statusCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  statusNumber: {
    color: colors.text.primary,
    fontWeight: "700",
    textAlign: "center",
  },
  statusCaption: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  readyLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  readyProgress: { height: 8, backgroundColor: "#3A3A3A", borderRadius: 4 },
  readyFill: { height: 8, backgroundColor: "#67D16C", borderRadius: 4 },
  timeRow: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  tag: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: { color: colors.text.primary, fontSize: 12 },
  timeText: { color: colors.text.secondary, fontSize: 12 },

  summaryCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 10,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { color: colors.text.secondary, fontSize: 12 },
  okText: { color: "#67D16C", fontWeight: "600" },
  summaryValue: { color: colors.text.primary },

  primaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 6,
  },
  primaryCtaText: { color: "#000", fontWeight: "700" },
  secondaryCta: {
    marginHorizontal: 16,
    backgroundColor: "#2A2A2A",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 8,
    marginBottom: 12,
  },
  secondaryCtaText: { color: colors.text.primary, fontWeight: "600" },
});
