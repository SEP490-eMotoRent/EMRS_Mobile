import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { RouteProp, useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { GetTicketsByStaffIdUseCase } from "../../../../../../domain/usecases/ticket/GetTicketsByStaffIdUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import { TicketResponse } from "../../../../../../data/models/ticket/TicketResponse";

type TicketListScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "TicketList"
>;

type TicketListScreenRouteProp = RouteProp<StaffStackParamList, "TicketList">;

// const mockTickets: Ticket[] = [
//   {
//     id: "1",
//     ticketNumber: "TKT-2024-001",
//     status: "pending",
//     priority: "urgent",
//     title: "Xe không khởi động được",
//     description: "Xe không thể khởi động, có tiếng kêu lạ từ động cơ",
//     renterName: "Nguyễn Văn A",
//     renterPhone: "0901234567",
//     vehicleLicensePlate: "59K1-55345",
//     vehicleModel: "VinFast Theon S",
//     location: "123 Nguyễn Huệ, Quận 1, TP.HCM",
//     createdAt: "2024-01-15T10:30:00Z",
//   },
//   {
//     id: "2",
//     ticketNumber: "TKT-2024-002",
//     status: "in_progress",
//     priority: "high",
//     title: "Pin xe hết nhanh",
//     description: "Pin xe chỉ chạy được 20km thay vì 150km như quảng cáo",
//     renterName: "Trần Thị B",
//     renterPhone: "0912345678",
//     vehicleLicensePlate: "59K1-55346",
//     vehicleModel: "VinFast Klara S",
//     location: "456 Lê Lợi, Quận 3, TP.HCM",
//     createdAt: "2024-01-15T09:15:00Z",
//     assignedAt: "2024-01-15T09:30:00Z",
//   },
//   {
//     id: "3",
//     ticketNumber: "TKT-2024-003",
//     status: "resolved",
//     priority: "medium",
//     title: "Lốp xe bị xẹp",
//     description: "Lốp sau bị xẹp, cần thay thế",
//     renterName: "Lê Văn C",
//     renterPhone: "0923456789",
//     vehicleLicensePlate: "59K1-55347",
//     vehicleModel: "VinFast Theon S",
//     location: "789 Điện Biên Phủ, Quận Bình Thạnh, TP.HCM",
//     createdAt: "2024-01-14T14:20:00Z",
//     assignedAt: "2024-01-14T14:35:00Z",
//     resolvedAt: "2024-01-14T16:00:00Z",
//   },
//   {
//     id: "4",
//     ticketNumber: "TKT-2024-004",
//     status: "pending",
//     priority: "medium",
//     title: "Không thể sạc pin",
//     description: "Ổ cắm sạc không hoạt động, không thể sạc pin",
//     renterName: "Phạm Thị D",
//     renterPhone: "0934567890",
//     vehicleLicensePlate: "59K1-55348",
//     vehicleModel: "VinFast Klara A1",
//     location: "321 Võ Văn Tần, Quận 3, TP.HCM",
//     createdAt: "2024-01-15T11:00:00Z",
//   },
// ];

export const TicketListScreen: React.FC = () => {
  const navigation = useNavigation<TicketListScreenNavigationProp>();
  const route = useRoute<TicketListScreenRouteProp>();
  const user = useAppSelector((state) => state.auth.user);
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchTickets();
    }, [user])
  );

  const fetchTickets = async () => {
    if (user) {
      const getTicketsByStaffIdUseCase = new GetTicketsByStaffIdUseCase(
        sl.get("TicketRepository")
      );
      const tickets = await getTicketsByStaffIdUseCase.execute({
        staffId: user.id,
        pageSize: 10,
        pageNum: 1,
        orderByDescending: true,
      });
      console.log(tickets);
      setTickets(tickets.items);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (user) {
        const getTicketsByStaffIdUseCase = new GetTicketsByStaffIdUseCase(
          sl.get("TicketRepository")
        );
        const tickets = await getTicketsByStaffIdUseCase.execute({
          staffId: user.id,
          pageSize: 10,
          pageNum: 1,
          orderByDescending: true,
        });
        setTickets(tickets.items);
      }
    } catch (error) {
      console.error("Error refreshing tickets:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#FFB300";
      case "InProgress":
        return "#7DB3FF";
      case "Resolved":
        return "#67D16C";
      case "Closed":
        return "#999";
      default:
        return colors.text.secondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "InProgress":
        return "Đang xử lý";
      case "Resolved":
        return "Đã giải quyết";
      case "Closed":
        return "Đã hủy";
      default:
        return status || "-";
    }
  };

  const getTicketTypeColor = (ticketType: string) => {
    switch (ticketType) {
      case "WeakBattery":
        return "#FFD666";
      case "BrokenVehicle":
        return "#FF6B6B";
      case "Accident":
        return "#FF8A80";
      case "Theft":
        return "#F97316";
      default:
        return "#C9B6FF";
    }
  };

  const getTicketTypeText = (ticketType: string) => {
    switch (ticketType) {
      case "WeakBattery":
        return "Pin yếu";
      case "BrokenVehicle":
        return "Xe hỏng";
      case "Accident":
        return "Tai nạn";
      case "Theft":
        return "Trộm cắp";
      default:
        return ticketType || "-";
    }
  };

  const generateTicketNumber = (id: string) => {
    return `TKT-${id.slice(-8).toUpperCase()}`;
  };

  const handleTicketPress = (ticketId: string) => {
    navigation.navigate("TicketDetail", { ticketId });
  };

  const pendingCount = tickets.filter(
    (t) => t.status === "Pending"
  ).length;
  const inProgressCount = tickets.filter(
    (t) => t.status === "InProgress"
  ).length;

  const resolvedCount = tickets.filter(
    (t) => t.status === "Resolved"
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Danh sách Ticket"
        subtitle={`${pendingCount} chờ xử lý · ${inProgressCount} đang xử lý`}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FFB30020" }]}>
              <AntDesign name="clock-circle" size={20} color="#FFB300" />
            </View>
            <Text style={styles.statNumber}>{pendingCount}</Text>
            <Text style={styles.statLabel}>Chờ xử lý</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#7DB3FF20" }]}>
              <AntDesign name="sync" size={20} color="#7DB3FF" />
            </View>
            <Text style={styles.statNumber}>{inProgressCount}</Text>
            <Text style={styles.statLabel}>Đang xử lý</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#67D16C20" }]}>
              <AntDesign name="check-circle" size={20} color="#67D16C" />
            </View>
            <Text style={styles.statNumber}>{resolvedCount}</Text>
            <Text style={styles.statLabel}>Đã giải quyết</Text>
          </View>
        </View>

        {/* Tickets List */}
        <View style={styles.ticketsSection}>
          <Text style={styles.sectionTitle}>Tất cả Ticket ({tickets.length})</Text>
          {tickets.length === 0 ? (
            <View style={styles.emptyState}>
              <AntDesign name="inbox" size={48} color={colors.text.secondary} />
              <Text style={styles.emptyStateText}>Chưa có ticket nào</Text>
              <Text style={styles.emptyStateSubtext}>
                Các ticket được gán cho bạn sẽ hiển thị ở đây
              </Text>
            </View>
          ) : (
            tickets.map((ticket) => (
              <TouchableOpacity
                key={ticket.id}
                style={styles.ticketCard}
                onPress={() => handleTicketPress(ticket.id)}
                activeOpacity={0.7}
              >
                <View style={styles.ticketHeader}>
                  <View style={styles.ticketHeaderLeft}>
                    <Text style={styles.ticketNumber}>
                      {generateTicketNumber(ticket.id)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(ticket.status) + "20",
                        },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: getStatusColor(ticket.status) },
                        ]}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(ticket.status) },
                        ]}
                      >
                        {getStatusText(ticket.status)}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.ticketTypeBadge,
                      {
                        backgroundColor:
                          getTicketTypeColor(ticket.ticketType) + "20",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.ticketTypeText,
                        { color: getTicketTypeColor(ticket.ticketType) },
                      ]}
                    >
                      {getTicketTypeText(ticket.ticketType)}
                    </Text>
                  </View>
                </View>

                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <Text style={styles.ticketDescription} numberOfLines={2}>
                  {ticket.description}
                </Text>

                <View style={styles.ticketInfo}>
                  <View style={styles.infoRow}>
                    <AntDesign
                      name="tags"
                      size={14}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.infoText}>
                      Loại: {getTicketTypeText(ticket.ticketType)}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <AntDesign
                      name="idcard"
                      size={14}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.infoText}>
                      Booking: #{ticket.bookingId.slice(-8).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <AntDesign
                      name="clock-circle"
                      size={14}
                      color={colors.text.secondary}
                    />
                    <Text style={styles.infoText}>
                      {new Date(ticket.createdAt).toLocaleString("en-GB")}
                    </Text>
                  </View>
                </View>

                <View style={styles.ticketFooter}>
                  <Text style={styles.viewDetailText}>Xem chi tiết</Text>
                  <AntDesign
                    name="arrow-right"
                    size={16}
                    color={colors.text.secondary}
                  />
                </View>
              </TouchableOpacity>
            ))
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  statNumber: {
    color: colors.text.primary,
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  ticketsSection: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  ticketCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  ticketHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  ticketNumber: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
  ticketTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ticketTypeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ticketTitle: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  ticketDescription: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  ticketInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
  },
  ticketFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  viewDetailText: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyStateText: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    color: colors.text.secondary,
    fontSize: 14,
    textAlign: "center",
  },
});
