import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetGpsSharingSessionsUseCase } from "../../../../../domain/usecases/gpsSharing/GetGpsSharingSessionsUseCase";
import sl from "../../../../../core/di/InjectionContainer";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../common/theme/colors";

export const GpsSharingSessionListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchSessions();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "Đã hủy";
      case "Pending":
        return "Chờ xác nhận";
      case "Active":
        return "Đang hoạt động";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "#FF6B6B";
      case "Pending":
        return "#FFD666";
      case "Active":
        return "#67D16C";
      default:
        return "#67D16C";
    }
  };
  const fetchSessions = async () => {
    try {
      setLoading(true);
      const getSessionsUseCase = new GetGpsSharingSessionsUseCase(
        sl.get("GpsSharingRepository")
      );
      const response = await getSessionsUseCase.execute();
      if (response.success && response.data) {
        setSessions(response.data);
      }
    } catch (error) {
      console.error("Error fetching GPS sharing sessions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchSessions();
  };

  const renderSessionItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.sessionCard} activeOpacity={0.8}>
        <View style={styles.sessionCardHeader}>
          <View style={styles.sessionIconContainer}>
            <AntDesign name="environment" size={20} color="#7CFFCB" />
          </View>
          <View style={styles.sessionInfo}>
            <Text style={styles.sessionTitle}>
              {item.vehicleLicensePlate || "Session #" + (item.sessionId?.slice(-8) || "N/A")}
            </Text>
            <Text style={styles.sessionSubtitle}>
              {item.participantCount || 0} người tham gia
            </Text>
          </View>
          <View style={styles.sessionStatusBadge}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>{getStatusText(item.status)}</Text>
          </View>
        </View>
        <View style={styles.sessionDetails}>
          <View style={styles.detailRow}>
            <AntDesign name="clock-circle" size={14} color={colors.text.secondary} />
            <Text style={styles.detailText}>
              Bắt đầu: {item.createdAt ? new Date(item.createdAt).toLocaleString("vi-VN") : "N/A"}
            </Text>
          </View>
          {item.invitationCode && (
            <View style={styles.detailRow}>
              <AntDesign name="key" size={14} color={colors.text.secondary} />
              <Text style={styles.detailText}>Mã: {item.invitationCode}</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.viewButton}>
          <Text style={styles.viewButtonText}>Xem chi tiết</Text>
          <AntDesign name="right" size={14} color="#7CFFCB" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color="#7CFFCB" />
          <Text style={styles.emptyText}>Đang tải danh sách...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <AntDesign name="environment" size={48} color={colors.text.secondary} />
        </View>
        <Text style={styles.emptyTitle}>Chưa có session nào</Text>
        <Text style={styles.emptySubtitle}>
          Bạn chưa có session chia sẻ GPS nào. Tạo session mới từ booking details.
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Chia sẻ GPS"
        subtitle="Danh sách session"
        showBackButton={false}
      />
      <FlatList
        data={sessions}
        keyExtractor={(item, index) => item.sessionId || `session-${index}`}
        renderItem={renderSessionItem}
        contentContainerStyle={sessions.length === 0 ? styles.emptyListContent : styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7CFFCB" />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  emptyListContent: {
    flex: 1,
  },
  sessionCard: {
    backgroundColor: "#11131A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1F2430",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sessionCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  sessionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(124,255,203,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: {
    flex: 1,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },
  sessionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  sessionStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(103,209,108,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(103,209,108,0.3)",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  sessionDetails: {
    marginBottom: 16,
    gap: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(124,255,203,0.15)",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(124,255,203,0.3)",
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7CFFCB",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#1B1F2A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 12,
  },
});

