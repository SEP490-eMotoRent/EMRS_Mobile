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
  TextInput,
  Modal,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetGpsSharingSessionsUseCase } from "../../../../../domain/usecases/gpsSharing/GetGpsSharingSessionsUseCase";
import { GpsSharingJoinUseCase } from "../../../../../domain/usecases/gpsSharing/GpsSharingJoinUseCase";
import { GetCurrentRenterBookingsUseCase } from "../../../../../domain/usecases/booking/GetCurrentRenterBookingsUseCase";
import sl from "../../../../../core/di/InjectionContainer";
import { AntDesign } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { colors } from "../../../../common/theme/colors";
import Toast from "react-native-toast-message";

export const GpsSharingSessionListScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [invitationCode, setInvitationCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSessions();
    fetchCurrentVehicle();
  }, []);

  const fetchCurrentVehicle = async () => {
    try {
      const getCurrentRenterBookingsUseCase = new GetCurrentRenterBookingsUseCase(
        sl.get("BookingRepository")
      );
      const bookings = await getCurrentRenterBookingsUseCase.execute();
      const rentingBooking = bookings.find((b) => b.bookingStatus === "Renting");
      if (rentingBooking?.id) {
        setCurrentBookingId(rentingBooking.id);
      }
    } catch (error) {
      console.error("Error fetching current vehicle:", error);
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "Đã hủy";
      case "Pending":
        return "Chờ xác nhận";
      case "Active":
        return "Đang hoạt động";
      case "Expired":
        return "Đã hết hạn";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "#FF8A80";
      case "Pending":
        return "#FFD54F";
      case "Active":
        return "#81C784";
      case "Expired":
        return "#9E9E9E";
      default:
        return "#81C784";
    }
  };

  const getStatusBgColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "rgba(255,138,128,0.15)";
      case "Pending":
        return "rgba(255,213,79,0.15)";
      case "Active":
        return "rgba(129,199,132,0.15)";
      case "Expired":
        return "rgba(158,158,158,0.15)";
      default:
        return "rgba(129,199,132,0.15)";
    }
  };

  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "Cancelled":
        return "rgba(255,138,128,0.3)";
      case "Pending":
        return "rgba(255,213,79,0.3)";
      case "Active":
        return "rgba(129,199,132,0.3)";
      case "Expired":
        return "rgba(158,158,158,0.3)";
      default:
        return "rgba(129,199,132,0.3)";
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
    fetchCurrentVehicle();
  };

  const handleJoinSession = async () => {
    if (!invitationCode.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập mã mời",
      });
      return;
    }

    if (!currentBookingId) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Bạn cần có xe đang thuê để tham gia session",
      });
      return;
    }

    try {
      setJoining(true);
      const joinUseCase = new GpsSharingJoinUseCase(sl.get("GpsSharingRepository"));
      const response = await joinUseCase.execute({
        invitationCode: invitationCode.trim().toUpperCase(),
        guestBookingId: currentBookingId,
      });

      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đã tham gia session thành công",
        });
        setShowJoinModal(false);
        setInvitationCode("");
        fetchSessions();
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: response.message || "Không thể tham gia session",
        });
      }
    } catch (error: any) {
      console.error("Error joining session:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error.response?.data?.message || "Đã xảy ra lỗi khi tham gia session",
      });
    } finally {
      setJoining(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSessionPress = (item: any) => {
    if (item.status === "Active") {
      navigation.navigate("GpsSharingTracking", {
        sessionId: item.sessionId,
        ownerVehicleId: item.ownerVehicleId,
        ownerVehicleLicensePlate: item.ownerVehicleLicensePlate,
        guestVehicleId: item.guestVehicleId,
        guestVehicleLicensePlate: item.guestVehicleLicensePlate,
        ownerRenterName: item.ownerRenterName,
        guestRenterName: item.guestRenterName,
      });
    }
  };

  const renderSessionItem = ({ item }: { item: any }) => {
    const statusColor = getStatusColor(item.status);
    const statusBgColor = getStatusBgColor(item.status);
    const statusBorderColor = getStatusBorderColor(item.status);

    const isActive = item.status === "Active";

    return (
      <TouchableOpacity 
        style={[
          styles.sessionCard, 
          { backgroundColor: "#1A1D26" },
          isActive && styles.sessionCardActive
        ]} 
        activeOpacity={isActive ? 0.85 : 1}
        onPress={() => handleSessionPress(item)}
        disabled={!isActive}
      >
        {/* Card Header with Gradient Effect */}
        <View style={[styles.cardHeaderGradient, { borderBottomColor: statusBorderColor }]}>
          <View style={styles.sessionCardHeader}>
            <View style={styles.sessionInfo}>
              <View style={styles.vehiclePlateRow}>
                <View style={styles.vehicleIconWrapper}>
                  <AntDesign name="car" size={18} color="#7DB3FF" />
                </View>
                <Text style={styles.sessionTitle}>
                  {item.ownerVehicleLicensePlate || "N/A"}
                </Text>
              </View>
              <View style={styles.ownerRow}>
                <AntDesign name="user" size={12} color={colors.text.secondary} />
                <Text style={styles.sessionSubtitle}>
                  {item.ownerRenterName || "N/A"}
                </Text>
              </View>
            </View>
            <View style={[styles.sessionStatusBadge, { backgroundColor: statusBgColor, borderColor: statusBorderColor }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.sessionContent}>
          {/* Invitation Code - Highlighted */}
          {item.invitationCode && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, styles.invitationIconContainer]}>
                <AntDesign name="key" size={18} color="#7DB3FF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Mã mời</Text>
                <View style={styles.codeBadge}>
                  <Text style={styles.codeText}>{item.invitationCode}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Guest Info (if exists) */}
          {item.guestRenterName && (
            <View style={styles.infoRow}>
              <View style={[styles.infoIconContainer, styles.guestIconContainer]}>
                <AntDesign name="team" size={18} color="#C9B6FF" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Khách mời</Text>
                <Text style={styles.infoValue}>{item.guestRenterName}</Text>
                {item.guestVehicleLicensePlate && (
                  <View style={styles.guestVehicleTag}>
                    <AntDesign name="car" size={12} color="#C9B6FF" />
                    <Text style={styles.infoSubValue}>{item.guestVehicleLicensePlate}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Timeline Section */}
          <View style={styles.timelineSection}>
            <View style={styles.timelineLine} />
            <View style={styles.timelineItems}>
              {/* Created Date */}
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, styles.timelineDotCreated]}>
                  <AntDesign name="clock-circle" size={12} color="#FFD666" />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineLabel}>Tạo lúc</Text>
                  <Text style={styles.timelineValue}>{formatDate(item.createdAt)}</Text>
                </View>
              </View>

              {/* Accepted Date (if exists) */}
              {item.acceptedAt && (
                <View style={styles.timelineItem}>
                  <View style={[styles.timelineDot, styles.timelineDotAccepted]}>
                    <AntDesign name="check-circle" size={12} color="#81C784" />
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineLabel}>Chấp nhận lúc</Text>
                    <Text style={styles.timelineValue}>{formatDate(item.acceptedAt)}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Active Indicator */}
          {isActive && (
            <View style={styles.activeIndicator}>
              <AntDesign name="environment" size={14} color="#81C784" />
              <Text style={styles.activeIndicatorText}>Nhấn để xem vị trí trên bản đồ</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.emptyContainer}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#7DB3FF" />
            <Text style={styles.emptyText}>Đang tải danh sách...</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <View style={styles.emptyIconBackground}>
            <AntDesign name="share-alt" size={40} color="#7DB3FF" />
          </View>
        </View>
        <Text style={styles.emptyTitle}>Chưa có session nào</Text>
        <Text style={styles.emptySubtitle}>
          Bạn chưa có session chia sẻ GPS nào. Tạo session mới từ booking details hoặc tham gia session bằng mã mời.
        </Text>
        <TouchableOpacity
          style={styles.emptyActionButton}
          onPress={() => setShowJoinModal(true)}
          activeOpacity={0.8}
        >
          <AntDesign name="plus-circle" size={18} color="#7DB3FF" />
          <Text style={styles.emptyActionText}>Tham gia session</Text>
        </TouchableOpacity>
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
      
      {/* Join Session Button */}
      <View style={styles.joinSection}>
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => setShowJoinModal(true)}
          activeOpacity={0.85}
        >
          <View style={styles.joinButtonLeft}>
            <View style={styles.joinButtonIconContainer}>
              <AntDesign name="plus-circle" size={22} color="#C9B6FF" />
            </View>
            <View style={styles.joinButtonTextContainer}>
              <Text style={styles.joinButtonText}>Tham gia session</Text>
              <Text style={styles.joinButtonSubtext}>Nhập mã mời để tham gia</Text>
            </View>
          </View>
          <AntDesign name="right" size={18} color="#C9B6FF" />
        </TouchableOpacity>
      </View>

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

      {/* Join Session Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <AntDesign name="key" size={24} color="#C9B6FF" />
              </View>
              <Text style={styles.modalTitle}>Tham gia session</Text>
              <Text style={styles.modalSubtitle}>
                Nhập mã mời để tham gia session chia sẻ GPS
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Mã mời</Text>
              <View style={styles.inputWrapper}>
                <AntDesign name="key" size={18} color="#C9B6FF" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Nhập mã mời (VD: 3YS4CD)"
                  placeholderTextColor={colors.text.secondary}
                  value={invitationCode}
                  onChangeText={(text) => setInvitationCode(text.toUpperCase())}
                  autoCapitalize="characters"
                  maxLength={10}
                  editable={!joining}
                />
              </View>
            </View>

            {currentBookingId ? (
              <View style={styles.infoBox}>
                <AntDesign name="check-circle" size={16} color="#81C784" />
                <Text style={styles.infoBoxText}>
                  Xe hiện tại sẽ được sử dụng để tham gia session
                </Text>
              </View>
            ) : (
              <View style={[styles.infoBox, styles.infoBoxWarning]}>
                <AntDesign name="warning" size={16} color="#FFD54F" />
                <Text style={[styles.infoBoxText, styles.infoBoxTextWarning]}>
                  Bạn cần có xe đang thuê để tham gia session
                </Text>
              </View>
            )}

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowJoinModal(false);
                  setInvitationCode("");
                }}
                disabled={joining}
              >
                <Text style={styles.modalButtonCancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalButtonJoin,
                  (!currentBookingId || joining) && styles.modalButtonDisabled,
                ]}
                onPress={handleJoinSession}
                disabled={!currentBookingId || joining}
              >
                {joining ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <>
                    <AntDesign name="check-circle" size={16} color="#000" />
                    <Text style={styles.modalButtonJoinText}>Tham gia</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderRadius: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2D36",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
    overflow: "hidden",
  },
  sessionCardActive: {
    borderColor: "rgba(129,199,132,0.5)",
    borderWidth: 1.5,
  },
  activeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "rgba(129,199,132,0.1)",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  activeIndicatorText: {
    fontSize: 11,
    color: "#81C784",
    fontWeight: "600",
  },
  cardHeaderGradient: {
    backgroundColor: "rgba(125,179,255,0.05)",
    borderBottomWidth: 2,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  sessionCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  sessionInfo: {
    flex: 1,
  },
  vehiclePlateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  vehicleIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(125,179,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.8,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sessionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  sessionStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  sessionContent: {
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  invitationIconContainer: {
    backgroundColor: "rgba(125,179,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(125,179,255,0.3)",
  },
  guestIconContainer: {
    backgroundColor: "rgba(201,182,255,0.2)",
    borderWidth: 1.5,
    borderColor: "rgba(201,182,255,0.3)",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "600",
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  codeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(125,179,255,0.1)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "rgba(125,179,255,0.2)",
    alignSelf: "flex-start",
  },
  codeText: {
    fontSize: 16,
    color: "#7DB3FF",
    fontWeight: "700",
    letterSpacing: 2,
  },
  infoValue: {
    fontSize: 15,
    color: colors.text.primary,
    fontWeight: "600",
    marginBottom: 4,
  },
  guestVehicleTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(201,182,255,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  infoSubValue: {
    fontSize: 12,
    color: "#C9B6FF",
    fontWeight: "600",
  },
  timelineSection: {
    marginTop: 8,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 20,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: "#2A2D36",
  },
  timelineItems: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  timelineDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    zIndex: 1,
  },
  timelineDotCreated: {
    backgroundColor: "rgba(255,214,102,0.15)",
    borderColor: "rgba(255,214,102,0.3)",
  },
  timelineDotAccepted: {
    backgroundColor: "rgba(129,199,132,0.15)",
    borderColor: "rgba(129,199,132,0.3)",
  },
  timelineContent: {
    flex: 1,
    paddingTop: 4,
  },
  timelineLabel: {
    fontSize: 11,
    color: colors.text.secondary,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  timelineValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingContainer: {
    alignItems: "center",
    gap: 16,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(125,179,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(125,179,255,0.3)",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 12,
    textAlign: "center",
    letterSpacing: 0.5,
  },
  emptySubtitle: {
    fontSize: 15,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    marginTop: 12,
    fontWeight: "500",
  },
  emptyActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(125,179,255,0.15)",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "rgba(125,179,255,0.3)",
  },
  emptyActionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#7DB3FF",
  },
  joinSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(201,182,255,0.2)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(201,182,255,0.3)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  joinButtonLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 14,
  },
  joinButtonIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(201,182,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(201,182,255,0.3)",
  },
  joinButtonTextContainer: {
    flex: 1,
  },
  joinButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#C9B6FF",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  joinButtonSubtext: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "500",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1D26",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: 40,
    borderTopWidth: 1.5,
    borderColor: "#2A2D36",
    maxHeight: "90%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 28,
  },
  modalIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(201,182,255,0.3)",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.secondary,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#11131A",
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#2A2D36",
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  inputIcon: {
    marginRight: 14,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: colors.text.primary,
    fontWeight: "700",
    letterSpacing: 3,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(129,199,132,0.15)",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(129,199,132,0.3)",
    marginBottom: 24,
  },
  infoBoxWarning: {
    backgroundColor: "rgba(255,213,79,0.15)",
    borderColor: "rgba(255,213,79,0.3)",
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: "#81C784",
    fontWeight: "500",
    lineHeight: 18,
  },
  infoBoxTextWarning: {
    color: "#FFD54F",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
  },
  modalButtonCancel: {
    backgroundColor: "#11131A",
    borderWidth: 1.5,
    borderColor: "#2A2D36",
  },
  modalButtonCancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.secondary,
  },
  modalButtonJoin: {
    backgroundColor: "#C9B6FF",
  },
  modalButtonDisabled: {
    backgroundColor: "#2A2D36",
    opacity: 0.5,
  },
  modalButtonJoinText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#000",
  },
});
