import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../../authentication/store/hooks";
import { removeAuth } from "../../../../authentication/store/slices/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type StaffProfileScreenNavigationProp =
  StackNavigationProp<StaffStackParamList>;

interface StaffStats {
  totalHandovers: number;
  totalReturns: number;
  totalScans: number;
  rating: number;
}

interface QuickAction {
  id: string;
  title: string;
  icon: string;
  color: string;
  onPress: () => void;
}

export const StaffProfileScreen: React.FC = () => {
  const navigation = useNavigation<StaffProfileScreenNavigationProp>();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Mock staff data
  const staffStats: StaffStats = {
    totalHandovers: 156,
    totalReturns: 142,
    totalScans: 298,
    rating: 4.8,
  };

  const quickActions: QuickAction[] = [
    {
      id: "ticket",
      title: "Quản lý Ticket",
      icon: "audit",
      color: "#FF6B6B",
      onPress: () => navigation.navigate("TicketList"),
    },
  ];

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: () => {
          dispatch(removeAuth());
          Toast.show({
            type: "success",
            text1: "Đăng xuất thành công",
            text2: "Chào mừng bạn đến với eMotoRent",
          });
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Profile"
          subtitle="Staff Account"
          showBackButton={false}
        />

        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={require("../../../../../../../assets/images/avatar.png")}
              style={styles.avatar}
            />
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online</Text>
            </View>
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.staffName}>
              {user?.fullName || "Staff Member"}
            </Text>
            <Text style={styles.staffRole}>{user?.role || "STAFF"}</Text>
            <View style={styles.branchRow}>
              <AntDesign name="home" size={12} color={colors.text.secondary} />
              <Text style={styles.branchName}>
                {user?.branchName || "Chưa có chi nhánh"}
              </Text>
            </View>
          </View>
        </View>


        {/* Quick Actions */}
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={styles.actionCard}
            onPress={action.onPress}
            activeOpacity={0.8}
          >
            <View style={styles.actionCardLeft}>
              <View
                style={[
                  styles.actionIcon,
                  { backgroundColor: action.color + "20" },
                ]}
              >
                <AntDesign
                  name={action.icon as any}
                  size={24}
                  color={action.color}
                />
              </View>
              <View style={styles.actionCardInfo}>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionSubtitle}>
                  Xem và quản lý các ticket
                </Text>
              </View>
            </View>
            <AntDesign name="right" size={16} color={colors.text.secondary} />
          </TouchableOpacity>
        ))}

        {/* Sign Out Button */}
        <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
          <AntDesign name="logout" size={20} color="#FF6B6B" />
          <Text style={styles.signOutText}>Sign Out</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "#C9B6FF",
    backgroundColor: "#2A2A2A",
  },
  statusBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderWidth: 2,
    borderColor: "#1E1E1E",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#67D16C",
  },
  statusText: {
    color: "#67D16C",
    fontSize: 10,
    fontWeight: "600",
  },
  profileInfo: {
    flex: 1,
  },
  staffName: {
    color: colors.text.primary,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  staffRole: {
    color: "#C9B6FF",
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  branchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  branchName: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
  },
  statsCard: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statsTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  toggleButton: {
    padding: 4,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  statItem: {
    width: "45%",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
  },
  statNumber: {
    color: "#C9B6FF",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
  actionsCard: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#2E2E2E",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  actionCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#2A2A2A",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#333333",
    marginBottom: 12,
    marginHorizontal: 16,
  },
  actionCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  actionCardInfo: {
    flex: 1,
    gap: 4,
  },
  actionTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "400",
  },
  scheduleCard: {
    backgroundColor: "#1E1E1E",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  scheduleText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2A2A2A",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 18,
    gap: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    marginBottom: 20,
  },
  signOutText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
