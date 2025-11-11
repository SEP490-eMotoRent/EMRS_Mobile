import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Dimensions,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../../../common/theme/colors";
import { TripStackParamList } from "../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../common/components/organisms/ScreenHeader";
import { SummaryResponse } from "../../../../../data/models/rentalReturn/SummaryResponse";
import { RentalReturnSummaryUseCase } from "../../../../../domain/usecases/rentalReturn/SummaryReceiptUseCase";
import { unwrapResponse } from "../../../../../core/network/APIResponse";
import { RentalReturnFinalizeUseCase } from "../../../../../domain/usecases/rentalReturn/RentalReturnFinalizeUseCase";
import { FinalizeReturnResponse } from "../../../../../data/models/rentalReturn/FinalizeReturnResponse";
import sl from "../../../../../core/di/InjectionContainer";
import { GetReceiptDetailsUseCase } from "../../../../../domain/usecases/receipt/GetReceiptDetails";
import { RentalReceipt } from "../../../../../domain/entities/booking/RentalReceipt";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { GetBookingByIdUseCase } from "../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import {
  BookingStatus,
  BookingStatusColorMap,
  BookingStatusMap,
} from "../../constant/BookingStatus";
import { BookingStatusBadge } from "../atoms/BookingStatusBadge";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type NavProp = StackNavigationProp<TripStackParamList, "ReturnReport">;
type RouteP = RouteProp<TripStackParamList, "ReturnReport">;

export const ReturnReportScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  const { bookingId } = route.params;

  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [rentalReceipt, setRentalReceipt] = useState<RentalReceipt | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const imageScrollRef = useRef<ScrollView>(null);
  const thumbnailScrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchSummaryReceipt();
    fetchBooking();
    fetchRentalReceipt();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const getBookingByIdUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const booking = await getBookingByIdUseCase.execute(bookingId);
      setBooking(booking);
    } catch (error: any) {
      Alert.alert("Lỗi", `Không thể tải booking: ${error.message}`);
    }
  };

  const fetchSummaryReceipt = async () => {
    try {
      setLoading(true);
      const getBookingByIdUseCase = new RentalReturnSummaryUseCase(
        sl.get("RentalReturnRepository")
      );
      const summaryResponse = await getBookingByIdUseCase.execute(bookingId);
      const summaryData: SummaryResponse = unwrapResponse(summaryResponse);
      setSummary(summaryData);
    } catch (error: any) {
      Alert.alert("Lỗi", `Không thể tải báo cáo: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentalReceipt = async () => {
    try {
      const getRentalReceiptUseCase = new GetReceiptDetailsUseCase(
        sl.get("ReceiptRepository")
      );
      const rentalReceipt = await getRentalReceiptUseCase.execute(bookingId);
      setRentalReceipt(rentalReceipt.data);
    } catch (error: any) {
      Alert.alert("Lỗi", `Không thể tải biên bản trả xe: ${error.message}`);
    }
  };

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + "đ";

  const handleFinalizeReturn = async () => {
    try {
      setLoading(true);
      const finalizeReturnUseCase = new RentalReturnFinalizeUseCase(
        sl.get("RentalReturnRepository")
      );
      const finalizeReturnResponse = await finalizeReturnUseCase.execute({
        bookingId,
        renterConfirmed: true,
      });
      const finalizeReturnData: FinalizeReturnResponse = unwrapResponse(
        finalizeReturnResponse
      );

      // Navigate to Return Complete screen
      Alert.alert("Success", "Trả xe thành công");
      navigation.navigate("ReturnComplete");
    } catch (error: any) {
      Alert.alert("Lỗi", `Không thể hoàn tất trả xe: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    handleFinalizeReturn();
  };

  const handleRequestRecheck = () => {
    navigation.navigate("ReturnComplete");
  };

  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setModalVisible(true);
  };

  const closeImageModal = () => {
    setModalVisible(false);
  };

  const handleImageScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    setSelectedImageIndex(index);
    
    // Auto-scroll thumbnail strip to show selected thumbnail
    if (thumbnailScrollRef.current && rentalReceipt?.returnVehicleImageFiles) {
      const thumbnailWidth = 60 + 8; // thumbnail width + gap
      const scrollPosition = Math.max(0, (index - 2) * thumbnailWidth);
      thumbnailScrollRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  const scrollToImage = (index: number) => {
    if (imageScrollRef.current) {
      imageScrollRef.current.scrollTo({
        x: index * SCREEN_WIDTH,
        animated: true,
      });
    }
    setSelectedImageIndex(index);
    
    // Auto-scroll thumbnail strip to show selected thumbnail
    if (thumbnailScrollRef.current && rentalReceipt?.returnVehicleImageFiles) {
      const thumbnailWidth = 60 + 8; // thumbnail width + gap
      const scrollPosition = Math.max(0, (index - 2) * thumbnailWidth);
      thumbnailScrollRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  // Scroll to selected image when modal opens
  useEffect(() => {
    if (modalVisible && imageScrollRef.current && rentalReceipt?.returnVehicleImageFiles) {
      const scrollTimeout = setTimeout(() => {
        imageScrollRef.current?.scrollTo({
          x: selectedImageIndex * SCREEN_WIDTH,
          animated: false,
        });
        
        // Also scroll thumbnail strip
        if (thumbnailScrollRef.current) {
          const thumbnailWidth = 60 + 8; // thumbnail width + gap
          const scrollPosition = Math.max(0, (selectedImageIndex - 2) * thumbnailWidth);
          thumbnailScrollRef.current.scrollTo({
            x: scrollPosition,
            animated: false,
          });
        }
      }, 50);
      return () => clearTimeout(scrollTimeout);
    }
  }, [modalVisible, selectedImageIndex, rentalReceipt?.returnVehicleImageFiles]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ScreenHeader
          title="Báo cáo trả xe"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        {/* Banner cảnh báo */}
        {booking?.bookingStatus === BookingStatus.RENTING && (
        <View style={styles.banner}>
          <AntDesign name="exclamation-circle" size={14} color="#FFEDD5" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Vui lòng kiểm tra kỹ báo cáo</Text>
            <Text style={styles.bannerSub}>
              Đã báo cáo vào {new Date().toLocaleString("vi-VN")}
              </Text>
            </View>
          </View>
        )}

        {/* Xe */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View>
              <Text style={styles.vehicleTitle}>
                {booking?.vehicle?.vehicleModel?.modelName}
              </Text>
              <Text style={styles.vehicleMeta}>
                {booking?.vehicle?.licensePlate}
              </Text>
            </View>
            {booking?.bookingStatus && (
              <View style={styles.statusPill}>
                <Text
                  style={[
                    styles.statusPillText,
                    { color: BookingStatusColorMap[booking?.bookingStatus] },
                  ]}
                >
                  {BookingStatusMap[booking?.bookingStatus]}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Ảnh */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeader}>Ảnh tình trạng xe</Text>
            {rentalReceipt?.returnVehicleImageFiles && (
              <Text style={styles.imageCount}>
                {rentalReceipt.returnVehicleImageFiles.length} ảnh
              </Text>
            )}
          </View>
          {rentalReceipt?.returnVehicleImageFiles && 
           rentalReceipt.returnVehicleImageFiles.length > 0 ? (
            <View style={styles.photoGrid}>
              {rentalReceipt.returnVehicleImageFiles.map((image, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.photoItem}
                  onPress={() => openImageModal(i)}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: image }} style={styles.photoImg} />
                  <View style={styles.photoOverlay}>
                    <View style={styles.photoOverlayIcon}>
                      <AntDesign name="eye" size={20} color="#fff" />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.noImagesContainer}>
              <AntDesign name="picture" size={32} color={colors.text.secondary} />
              <Text style={styles.noImagesText}>Chưa có ảnh</Text>
            </View>
          )}
          <TouchableOpacity style={styles.successBtn}>
            <AntDesign name="check-circle" size={14} color="#16A34A" />
            <Text style={styles.successBtnText}>
              Danh tính & xe đã được kiểm tra
            </Text>
          </TouchableOpacity>
        </View>

        {/* Odometer */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Đồng hồ công tơ mét</Text>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Bắt đầu</Text>
            <Text style={styles.kvVal}>1.234 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Kết thúc</Text>
            <Text style={styles.kvVal}>1.390 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Quãng đường</Text>
            <Text style={styles.kvVal}>156 km</Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Vượt quá</Text>
            <Text style={[styles.kvVal, { color: "#F59E0B" }]}>56 km</Text>
          </View>
        </View>

        {/* Phí */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tổng hợp chi phí</Text>
          {summary?.totalChargingFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Phí sạc pin</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.totalChargingFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.damageFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Phí hư hỏng</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.feesBreakdown.damageFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.cleaningFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Phí vệ sinh</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.feesBreakdown.cleaningFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.crossBranchFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Phí chuyển chi nhánh</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.feesBreakdown.crossBranchFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown?.excessKmFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Phí vượt quá quãng đường</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.feesBreakdown.excessKmFee || 0)}
              </Text>
            </View>
          )}
          {summary?.feesBreakdown.lateReturnFee !== 0 && (
            <View style={styles.kvRow}>
              <Text style={styles.kvKey}>Trả muộn</Text>
              <Text style={styles.kvVal}>
                {formatVnd(summary?.feesBreakdown.lateReturnFee || 0)}
              </Text>
            </View>
          )}

          <View style={styles.kvRow}>
            <Text style={styles.kvDim}>Tổng phụ phí</Text>
            <Text style={styles.kvStrong}>
              {formatVnd(summary?.totalAmount || 0)}
            </Text>
          </View>
          <View style={styles.kvRow}>
            <Text style={styles.kvKey}>Tiền cọc</Text>
            <Text style={styles.kvStrong}>
              {formatVnd(summary?.depositAmount || 0)}
            </Text>
          </View>

          <View style={[styles.kvRow, styles.topLine]}>
            <Text style={styles.kvStrong}>Hoàn tiền</Text>
            <Text
              style={[
                styles.kvStrong,
                {
                  color:
                    (summary?.refundAmount || 0) >= 0 ? "#22C55E" : "#F97316",
                },
              ]}
            >
              {formatVnd(summary?.refundAmount || 0)}
            </Text>
          </View>
        </View>

        {/* Nút hành động */}
        {booking?.bookingStatus === BookingStatus.RENTING && (
          <>
            <TouchableOpacity style={styles.primaryCta} onPress={handleApprove}>
              <Text style={styles.primaryCtaText}>Phê duyệt & Thanh toán</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.secondaryCta}
              onPress={handleRequestRecheck}
            >
              <Text style={styles.secondaryCtaText}>Yêu cầu kiểm tra lại</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeImageModal}
        statusBarTranslucent
      >
        <StatusBar barStyle="light-content" backgroundColor="rgba(0,0,0,0.95)" />
        <View style={styles.modalContainer}>
          {/* Header */}
          <SafeAreaView style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalImageCounter}>
                {selectedImageIndex + 1} / {rentalReceipt?.returnVehicleImageFiles?.length || 0}
              </Text>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={closeImageModal}
                activeOpacity={0.7}
              >
                <AntDesign name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Image ScrollView */}
          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.modalImageScroll}
            decelerationRate="fast"
          >
            {rentalReceipt?.returnVehicleImageFiles.map((image, index) => (
              <View key={index} style={styles.modalImageContainer}>
                <Image
                  source={{ uri: image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          {/* Thumbnail Strip */}
          {rentalReceipt?.returnVehicleImageFiles && 
           rentalReceipt.returnVehicleImageFiles.length > 1 && (
            <View style={styles.thumbnailStrip}>
              <ScrollView
                ref={thumbnailScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailScrollContent}
              >
                {rentalReceipt.returnVehicleImageFiles.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnailItem,
                      selectedImageIndex === index && styles.thumbnailItemActive,
                    ]}
                    onPress={() => scrollToImage(index)}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: image }}
                      style={styles.thumbnailImage}
                    />
                    {selectedImageIndex === index && (
                      <View style={styles.thumbnailIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingBottom: 40 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  backBtn: { padding: 6 },
  headerTitle: { color: colors.text.primary, fontWeight: "700" },

  banner: {
    marginHorizontal: 16,
    backgroundColor: "#7C3E1D",
    borderRadius: 12,
    padding: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  bannerTitle: { color: "#FFEDD5", fontWeight: "700", fontSize: 12 },
  bannerSub: { color: "#FED7AA", fontSize: 11 },

  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  cardHeader: {
    color: colors.text.primary,
    fontWeight: "700",
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  vehicleTitle: { color: colors.text.primary, fontWeight: "700" },
  vehicleMeta: { color: colors.text.secondary, fontSize: 12 },
  statusPill: {
    backgroundColor: "#FFEDD5",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: { color: "#7C2D12", fontWeight: "700", fontSize: 12 },

  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  imageCount: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 12,
  },
  photoItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
    borderWidth: 1,
    borderColor: "#3A3A3A",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  photoImg: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  photoOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  photoOverlayIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.3)",
  },
  noImagesContainer: {
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F1F1F",
    borderRadius: 12,
    marginBottom: 12,
  },
  noImagesText: {
    color: colors.text.secondary,
    fontSize: 14,
    marginTop: 8,
  },
  successBtn: {
    marginTop: 10,
    backgroundColor: "#052e1a",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  successBtnText: { color: "#22C55E", fontWeight: "700", fontSize: 12 },

  kvRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  kvKey: { color: colors.text.secondary, fontSize: 12 },
  kvVal: { color: colors.text.primary, fontSize: 12 },
  kvDim: { color: colors.text.secondary, fontSize: 12 },
  kvStrong: { color: colors.text.primary, fontWeight: "700" },
  topLine: {
    borderTopWidth: 1,
    borderTopColor: "#3A3A3A",
    paddingTop: 8,
    marginTop: 6,
  },

  primaryCta: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  primaryCtaText: { color: "#000", fontWeight: "700" },
  secondaryCta: {
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  secondaryCtaText: { color: colors.text.primary, fontWeight: "700" },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.95)",
  },
  modalHeader: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
    marginTop: 40,
  },
  modalHeaderContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  modalImageCounter: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalImageScroll: {
    flex: 1,
  },
  modalImageContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.75,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: "100%",
  },
  thumbnailStrip: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingVertical: 12,
  },
  thumbnailScrollContent: {
    paddingHorizontal: 16,
    gap: 8,
    alignItems: "center",
  },
  thumbnailItem: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
    position: "relative",
  },
  thumbnailItemActive: {
    borderColor: "#C9B6FF",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  thumbnailIndicator: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(201, 182, 255, 0.2)",
    borderWidth: 2,
    borderColor: "#C9B6FF",
    borderRadius: 6,
  },
});
