import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { BackButton } from "../../../../../common/components/atoms/buttons/BackButton";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";

type AwaitingApprovalScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AwaitingApproval"
>;

export const AwaitingApprovalScreen: React.FC = () => {
  const navigation = useNavigation<AwaitingApprovalScreenNavigationProp>();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <BackButton onPress={() => navigation.goBack()} />

        {/* Header */}
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.title}>Awaiting Customer</Text>
            <Text style={styles.title}>Approval</Text>
            <Text style={styles.subtext}>John Nguyen</Text>
          </View>
          <View style={styles.titleRight}>
            <TouchableOpacity style={styles.iconBtn}>
              <AntDesign name="bell" size={18} color={colors.text.primary} />
            </TouchableOpacity>
            <View style={styles.staffBadge}><Text style={styles.staffText}>ST</Text></View>
          </View>
        </View>

        {/* Report sent card */}
        <View style={styles.primaryCard}>
          <View style={styles.clockCircle}><AntDesign name="clock-circle" size={22} color={colors.text.primary} /></View>
          <Text style={styles.primaryCardTitle}>Report sent to customer</Text>
          <Text style={styles.primaryCardSub}>Waiting for approval...</Text>
        </View>

        {/* Report Summary */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Report Summary</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Vehicle</Text>
              <Text style={styles.summaryValue}>VinFast Evo200{"\n"}59X1-12345</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Start time</Text>
              <Text style={styles.summaryValue}>10:30 AM</Text>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Checklist</Text>
              <Text style={styles.summaryValue}>Exceelent</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryLabel}>Photos</Text>
              <Text style={styles.summaryValue}>4 angles captured</Text>
            </View>
          </View>
        </View>

        {/* Live Updates */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Live Updates</Text>
          {["Vehicle Selected", "Inspection", "Report generated", "Approval pending..."]
            .map((label, idx) => (
              <View key={idx} style={styles.liveRow}>
                <Text style={styles.liveText}>{label}</Text>
                {idx < 3 ? (
                  <AntDesign name="check-circle" size={18} color="#67D16C" />
                ) : (
                  <View />
                )}
              </View>
            ))}
        </View>

        {/* Refresh and Waiting */}
        <TouchableOpacity style={styles.refreshBtn}>
          <Text style={styles.refreshText}>Refresh Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.waitingBtn} disabled>
          <Text style={styles.waitingText}>Waiting</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingBottom: 40 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 8 },
  title: { color: colors.text.primary, fontSize: 18, fontWeight: '700' },
  subtext: { color: colors.text.secondary, fontSize: 12, marginTop: 6 },
  titleRight: { flexDirection: 'row', alignItems: 'center' },
  iconBtn: { padding: 8 },
  staffBadge: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#C9B6FF', alignItems: 'center', justifyContent: 'center' },
  staffText: { color: '#fff', fontWeight: '700', fontSize: 12 },

  primaryCard: { backgroundColor: '#1E1E1E', borderRadius: 12, marginHorizontal: 16, padding: 16, marginBottom: 12, alignItems: 'center' },
  clockCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2A2A2A', alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  primaryCardTitle: { color: colors.text.primary, fontWeight: '600' },
  primaryCardSub: { color: colors.text.secondary, marginTop: 4 },

  card: { backgroundColor: '#1E1E1E', borderRadius: 12, marginHorizontal: 16, padding: 12, marginBottom: 12 },
  cardHeader: { color: colors.text.secondary, fontSize: 12, marginBottom: 10 },
  summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  summaryBox: { flex: 1, backgroundColor: '#2A2A2A', borderRadius: 10, padding: 12 },
  summaryLabel: { color: colors.text.secondary, fontSize: 12, marginBottom: 6 },
  summaryValue: { color: colors.text.primary, fontSize: 12, fontWeight: '600' },

  liveRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#2A2A2A', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12, marginBottom: 8 },
  liveText: { color: colors.text.primary },
  pendingDot: { width: 18, height: 18, borderRadius: 9, backgroundColor: '#3A3A3A' },

  refreshBtn: { alignSelf: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  refreshText: { color: colors.text.secondary },

  waitingBtn: { marginHorizontal: 16, backgroundColor: '#7F8493', alignItems: 'center', paddingVertical: 14, borderRadius: 10 },
  waitingText: { color: '#E6E9EF', fontWeight: '700' },
});


