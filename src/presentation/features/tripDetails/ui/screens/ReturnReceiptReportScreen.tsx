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
import { RentalReceipt } from "../../../../../domain/entities/booking/RentalReceipt";
import { Booking } from "../../../../../domain/entities/booking/Booking";
import { GetBookingByIdUseCase } from "../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import {
  BookingStatus,
  BookingStatusColorMap,
  BookingStatusMap,
} from "../../constant/BookingStatus";
import Toast from "react-native-toast-message";
import { GetDetailRentalReceiptUseCase } from "../../../../../domain/usecases/receipt/GetDetailRentalReceipt";
import { RootState } from "../../../authentication/store";
import { useAppSelector } from "../../../authentication/store/hooks";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

type NavProp = StackNavigationProp<TripStackParamList, "ReturnReceiptReport">;
type RouteP = RouteProp<TripStackParamList, "ReturnReceiptReport">;

export const ReturnReceiptReportScreen: React.FC = () => {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<RouteP>();
  const { bookingId, rentalReceiptId } = route.params;
  const user = useAppSelector((state: RootState) => state.auth.user);
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
      const getDetailRentalReceiptUseCase = new GetDetailRentalReceiptUseCase(
        sl.get("ReceiptRepository")
      );
      const rentalReceipt = await getDetailRentalReceiptUseCase.execute(
        rentalReceiptId
      );
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
      Toast.show({
        text1: "Trả xe thành công",
        type: "success",
      });
      navigation.navigate("ReturnComplete", {
        bookingId,
        refundAmount: finalizeReturnData.paymentResult.refundAmount,
      });
    } catch (error: any) {
      Toast.show({
        text1: `Không thể hoàn tất trả xe: ${error.message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = () => {
    handleFinalizeReturn();
  };

  const handleRequestRecheck = () => {
    navigation.navigate("ReturnComplete", {
      bookingId,
      refundAmount: 300000,
    });
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
    if (thumbnailScrollRef.current) {
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
    if (thumbnailScrollRef.current) {
      const thumbnailWidth = 60 + 8; // thumbnail width + gap
      const scrollPosition = Math.max(0, (index - 2) * thumbnailWidth);
      thumbnailScrollRef.current.scrollTo({
        x: scrollPosition,
        animated: true,
      });
    }
  };

  const combinedImages = useMemo(() => {
    const returnImages = rentalReceipt?.returnVehicleImageFiles || [];
    const checklistImages = rentalReceipt?.checkListReturnFile || [];
    return [...returnImages, ...checklistImages];
  }, [
    rentalReceipt?.returnVehicleImageFiles,
    rentalReceipt?.checkListReturnFile,
  ]);

  // Scroll to selected image when modal opens
  useEffect(() => {
    if (modalVisible && imageScrollRef.current && combinedImages.length > 0) {
      const scrollTimeout = setTimeout(() => {
        imageScrollRef.current?.scrollTo({
          x: selectedImageIndex * SCREEN_WIDTH,
          animated: false,
        });

        // Also scroll thumbnail strip
        if (thumbnailScrollRef.current) {
          const thumbnailWidth = 60 + 8; // thumbnail width + gap
          const scrollPosition = Math.max(
            0,
            (selectedImageIndex - 2) * thumbnailWidth
          );
          thumbnailScrollRef.current.scrollTo({
            x: scrollPosition,
            animated: false,
          });
        }
      }, 50);
      return () => clearTimeout(scrollTimeout);
    }
  }, [modalVisible, selectedImageIndex, combinedImages.length]);

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
              <Text style={styles.bannerTitle}>
                Vui lòng kiểm tra kỹ báo cáo
              </Text>
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
              <View
                style={[
                  styles.statusPill,
                  {
                    backgroundColor: `${
                      BookingStatusColorMap[booking.bookingStatus]
                    }15`,
                    borderColor: `${
                      BookingStatusColorMap[booking.bookingStatus]
                    }40`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.statusPillDot,
                    {
                      backgroundColor:
                        BookingStatusColorMap[booking.bookingStatus],
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.statusPillText,
                    { color: BookingStatusColorMap[booking.bookingStatus] },
                  ]}
                >
                  {BookingStatusMap[booking.bookingStatus]}
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
                {rentalReceipt?.returnVehicleImageFiles.length} ảnh
              </Text>
            )}
          </View>
          {rentalReceipt?.returnVehicleImageFiles &&
          rentalReceipt?.returnVehicleImageFiles.length > 0 ? (
            <View style={styles.photoGrid}>
              {rentalReceipt?.returnVehicleImageFiles.map((image, i) => (
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
              <AntDesign
                name="picture"
                size={32}
                color={colors.text.secondary}
              />
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
          <View style={styles.cardHeaderRow}>
            <View
              style={[
                styles.iconBadge,
                { backgroundColor: "rgba(245, 158, 11, 0.15)" },
              ]}
            >
              <AntDesign name="dashboard" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.cardHeader}>Đồng hồ công tơ mét</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.odometerRow}>
            <View style={styles.odometerItem}>
              <View style={styles.odometerIconContainer}>
                <AntDesign name="play-circle" size={14} color="#22C55E" />
              </View>
              <Text style={styles.odometerLabel}>Bắt đầu</Text>
              <Text style={styles.odometerValue}>
                {summary?.feesBreakdown?.excessKmDetails?.startOdometerKm ||
                  rentalReceipt?.startOdometerKm ||
                  0}{" "}
                km
              </Text>
            </View>
            <View style={styles.odometerItem}>
              <View style={styles.odometerIconContainer}>
                <AntDesign name="check-circle" size={14} color="#3B82F6" />
              </View>
              <Text style={styles.odometerLabel}>Kết thúc</Text>
              <Text style={styles.odometerValue}>
                {summary?.feesBreakdown?.excessKmDetails?.endOdometerKm ||
                  rentalReceipt?.endOdometerKm ||
                  0}{" "}
                km
              </Text>
            </View>
          </View>
          <View style={styles.odometerRow}>
            <View style={styles.odometerItem}>
              <View
                style={[
                  styles.odometerIconContainer,
                  { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                ]}
              >
                <AntDesign name="car" size={14} color="#3B82F6" />
              </View>
              <Text style={styles.odometerLabel}>Quãng đường đã đi</Text>
              <Text style={styles.odometerValue}>
                {summary?.feesBreakdown?.excessKmDetails?.actualKmDriven ||
                  (rentalReceipt?.endOdometerKm &&
                  rentalReceipt?.startOdometerKm
                    ? rentalReceipt.endOdometerKm -
                      rentalReceipt.startOdometerKm
                    : 0)}{" "}
                km
              </Text>
            </View>
          </View>
          {summary?.feesBreakdown?.excessKmDetails && (
            <>
              <View style={styles.divider} />
              <View style={styles.odometerRow}>
                <View style={styles.odometerItem}>
                  <View
                    style={[
                      styles.odometerIconContainer,
                      { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                    ]}
                  >
                    <AntDesign name="safety" size={14} color="#22C55E" />
                  </View>
                  <Text style={styles.odometerLabel}>Giới hạn miễn phí</Text>
                  <Text style={styles.odometerValue}>
                    {summary.feesBreakdown.excessKmDetails.totalKmLimit} km
                  </Text>
                </View>
                <View style={styles.odometerItem}>
                  <View
                    style={[
                      styles.odometerIconContainer,
                      { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                    ]}
                  >
                    <AntDesign name="warning" size={14} color="#F59E0B" />
                  </View>
                  <Text style={styles.odometerLabel}>Vượt quá</Text>
                  <Text
                    style={[
                      styles.odometerValue,
                      { color: "#F59E0B", fontWeight: "700" },
                    ]}
                  >
                    {summary.feesBreakdown.excessKmDetails.excessKm} km
                  </Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Checklist Return */}
        {rentalReceipt?.checkListReturnFile &&
          rentalReceipt.checkListReturnFile.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardHeaderRow}>
                <View
                  style={[
                    styles.iconBadge,
                    { backgroundColor: "rgba(255, 214, 102, 0.15)" },
                  ]}
                >
                  <AntDesign name="check-square" size={16} color="#FFD666" />
                </View>
                <Text style={styles.cardHeader}>Checklist trả xe</Text>
              </View>
              <View style={styles.divider} />
              {rentalReceipt.checkListReturnFile.map((checklistUri, index) => {
                const imageIndex =
                  (rentalReceipt.returnVehicleImageFiles?.length || 0) + index;
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.85}
                    style={styles.checklistWrap}
                    onPress={() => {
                      setSelectedImageIndex(imageIndex);
                      setModalVisible(true);
                    }}
                  >
                    <Image
                      source={{ uri: checklistUri }}
                      style={styles.checklistImage}
                      resizeMode="contain"
                    />
                    <View style={styles.photoOverlay}>
                      <View style={styles.photoOverlayIcon}>
                        <AntDesign name="zoom-in" size={20} color="#fff" />
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

        {/* Phí */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tổng hợp chi phí</Text>

          {/* Phí thuê xe cơ bản */}
          {booking?.baseRentalFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(201, 182, 255, 0.15)" },
                  ]}
                >
                  <AntDesign name="car" size={14} color="#C9B6FF" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí thuê xe</Text>
                </View>
                <Text style={[styles.feeAmount, { color: "#C9B6FF" }]}>
                  {formatVnd(booking?.baseRentalFee || 0)}
                </Text>
              </View>
            </View>
          )}

          {/* Phí sạc pin */}
          {summary?.totalChargingFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(59, 130, 246, 0.15)" },
                  ]}
                >
                  <AntDesign name="thunderbolt" size={14} color="#3B82F6" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí sạc pin</Text>
                </View>
                <Text style={[styles.feeAmount, { color: "#3B82F6" }]}>
                  {formatVnd(summary?.totalChargingFee || 0)}
                </Text>
              </View>
            </View>
          )}

          {/* Phí hư hỏng */}
          {summary?.feesBreakdown?.damageDetails &&
            summary.feesBreakdown.damageDetails.length > 0 && (
              <View style={styles.feeSection}>
                <View style={styles.feeHeaderRow}>
                  <View
                    style={[
                      styles.feeIconBadge,
                      { backgroundColor: "rgba(239, 68, 68, 0.15)" },
                    ]}
                  >
                    <AntDesign name="warning" size={14} color="#EF4444" />
                  </View>
                  <View style={styles.feeHeaderText}>
                    <Text style={styles.feeTitle}>Phí hư hỏng</Text>
                    <Text style={styles.feeSubtitle}>
                      {summary.feesBreakdown.damageDetails.length}{" "}
                      {summary.feesBreakdown.damageDetails.length === 1
                        ? "hư hỏng"
                        : "hư hỏng"}
                    </Text>
                  </View>
                  <Text style={[styles.feeAmount, { color: "#EF4444" }]}>
                    {formatVnd(
                      summary.feesBreakdown.damageDetails.reduce(
                        (sum, d) => sum + d.amount,
                        0
                      )
                    )}
                  </Text>
                </View>
                <View style={styles.feeDetailsContainer}>
                  {summary.feesBreakdown.damageDetails.map((detail, index) => (
                    <View key={detail.id || index} style={styles.feeDetailRow}>
                      <View style={styles.feeDetailDot} />
                      <Text style={styles.feeDetailText} numberOfLines={2}>
                        {detail.description}
                      </Text>
                      <Text
                        style={[styles.feeDetailAmount, { color: "#EF4444" }]}
                      >
                        {formatVnd(detail.amount)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

          {/* Phí vệ sinh */}
          {summary?.feesBreakdown?.cleaningFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(34, 197, 94, 0.15)" },
                  ]}
                >
                  <AntDesign name="clear" size={14} color="#22C55E" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí vệ sinh</Text>
                </View>
                <Text style={[styles.feeAmount, { color: "#22C55E" }]}>
                  {formatVnd(summary?.feesBreakdown.cleaningFee || 0)}
                </Text>
              </View>
            </View>
          )}

          {/* Phí chuyển chi nhánh */}
          {summary?.feesBreakdown?.crossBranchFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(125, 179, 255, 0.15)" },
                  ]}
                >
                  <AntDesign name="swap" size={14} color="#7DB3FF" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí trả khác chi nhánh</Text>
                  {summary?.feesBreakdown?.crossBranchDetails && (
                    <Text style={styles.feeSubtitle} numberOfLines={1}>
                      {
                        summary.feesBreakdown.crossBranchDetails
                          .handoverBranchName
                      }{" "}
                      →{" "}
                      {
                        summary.feesBreakdown.crossBranchDetails
                          .returnBranchName
                      }
                    </Text>
                  )}
                </View>
                <Text style={[styles.feeAmount, { color: "#7DB3FF" }]}>
                  {formatVnd(summary?.feesBreakdown.crossBranchFee || 0)}
                </Text>
              </View>
            </View>
          )}

          {/* Phí vượt km */}
          {summary?.feesBreakdown?.excessKmFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(245, 158, 11, 0.15)" },
                  ]}
                >
                  <AntDesign name="dashboard" size={14} color="#F59E0B" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí vượt quãng đường</Text>
                  {summary?.feesBreakdown?.excessKmDetails && (
                    <Text style={styles.feeSubtitle}>
                      Vượt {summary.feesBreakdown.excessKmDetails.excessKm} km ×{" "}
                      {formatVnd(
                        summary.feesBreakdown.excessKmDetails.ratePerKm
                      )}
                      /km
                    </Text>
                  )}
                </View>
                <Text style={[styles.feeAmount, { color: "#F59E0B" }]}>
                  {formatVnd(summary?.feesBreakdown.excessKmFee || 0)}
                </Text>
              </View>
            </View>
          )}

          {/* Phí trả muộn */}
          {summary?.feesBreakdown?.lateReturnFee !== 0 && (
            <View style={styles.feeSection}>
              <View style={styles.feeHeaderRow}>
                <View
                  style={[
                    styles.feeIconBadge,
                    { backgroundColor: "rgba(255, 214, 102, 0.15)" },
                  ]}
                >
                  <AntDesign name="clock-circle" size={14} color="#FFD666" />
                </View>
                <View style={styles.feeHeaderText}>
                  <Text style={styles.feeTitle}>Phí trả muộn</Text>
                  {summary?.feesBreakdown?.lateReturnDetails && (
                    <Text style={styles.feeSubtitle}>
                      {Math.ceil(
                        summary.feesBreakdown.lateReturnDetails.lateHours
                      )}{" "}
                      giờ ×{" "}
                      {formatVnd(
                        summary.feesBreakdown.lateReturnDetails.ratePerHour
                      )}
                      /giờ
                    </Text>
                  )}
                </View>
                <Text style={[styles.feeAmount, { color: "#FFD666" }]}>
                  {formatVnd(summary?.feesBreakdown.lateReturnFee || 0)}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

          {/* Tổng phụ phí */}
          <View style={styles.kvRow}>
            <Text style={styles.kvDim}>Tổng phụ phí</Text>
            <Text style={styles.kvStrong}>
              {formatVnd(summary?.totalAmount || 0)}
            </Text>
          </View>

          {/* Đã thanh toán khi booking */}
          <View style={styles.paidSection}>
            <View style={styles.paidSectionHeader}>
              <AntDesign name="check-circle" size={14} color="#22C55E" />
              <Text style={styles.paidSectionTitle}>
                Đã thanh toán khi booking
              </Text>
            </View>
            {(summary?.depositAmount || 0) > 0 && (
              <View style={styles.paidRow}>
                <View style={styles.paidItem}>
                  <View style={styles.paidDot} />
                  <Text style={styles.paidLabel}>Tiền cọc</Text>
                </View>
                <Text style={[styles.paidAmount, { color: "#22C55E" }]}>
                  -{formatVnd(summary?.depositAmount || 0)}
                </Text>
              </View>
            )}
            {(booking?.baseRentalFee || 0) > 0 && (
              <View style={styles.paidRow}>
                <View style={styles.paidItem}>
                  <View style={styles.paidDot} />
                  <Text style={styles.paidLabel}>Phí thuê xe</Text>
                </View>
                <Text style={[styles.paidAmount, { color: "#22C55E" }]}>
                  -{formatVnd(booking?.baseRentalFee || 0)}
                </Text>
              </View>
            )}
            <View style={styles.paidTotalRow}>
              <Text style={styles.paidTotalLabel}>Tổng đã thanh toán</Text>
              <Text style={styles.paidTotalAmount}>
                -
                {formatVnd(
                  (summary?.depositAmount || 0) + (booking?.baseRentalFee || 0)
                )}
              </Text>
            </View>
          </View>

          {/* Kết quả */}
          <View
            style={[
              styles.resultSection,
              (summary?.refundAmount || 0) < 0
                ? styles.resultSectionNegative
                : styles.resultSectionPositive,
            ]}
          >
            <View style={styles.resultRow}>
              <View style={styles.resultLabelContainer}>
                {(summary?.refundAmount || 0) < 0 ? (
                  <AntDesign
                    name="exclamation-circle"
                    size={18}
                    color="#F97316"
                  />
                ) : (
                  <AntDesign name="check-circle" size={18} color="#22C55E" />
                )}
                <Text style={styles.resultLabel}>
                  {(summary?.refundAmount || 0) >= 0
                    ? "Số tiền hoàn lại"
                    : "Số tiền cần thanh toán thêm"}
                </Text>
              </View>
              <Text
                style={[
                  styles.resultAmount,
                  {
                    color:
                      (summary?.refundAmount || 0) >= 0 ? "#22C55E" : "#F97316",
                  },
                ]}
              >
                {formatVnd(Math.abs(summary?.refundAmount || 0))}
              </Text>
            </View>
          </View>
        </View>

        {/* Nút hành động */}
        {booking?.bookingStatus === BookingStatus.RETURNED &&
          user?.role === "RENTER" && (
            <>
              <TouchableOpacity
                style={styles.primaryCta}
                onPress={handleApprove}
              >
                <Text style={styles.primaryCtaText}>
                  Phê duyệt & Thanh toán
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
              style={styles.secondaryCta}
              onPress={handleRequestRecheck}
            >
              <Text style={styles.secondaryCtaText}>Yêu cầu kiểm tra lại</Text>
            </TouchableOpacity> */}
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
        <StatusBar
          barStyle="light-content"
          backgroundColor="rgba(0,0,0,0.95)"
        />
        <View style={styles.modalContainer}>
          {/* Header */}
          <SafeAreaView style={styles.modalHeader}>
            <View style={styles.modalHeaderContent}>
              <Text style={styles.modalImageCounter}>
                {selectedImageIndex + 1} / {combinedImages.length}
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

          {/* Image ScrollView with zoom */}
          <ScrollView
            ref={imageScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleImageScroll}
            style={styles.modalImageScroll}
            decelerationRate="fast"
          >
            {combinedImages.map((image, index) => (
              <ScrollView
                key={index}
                style={styles.modalImageContainer}
                maximumZoomScale={3}
                minimumZoomScale={1}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.modalImageContentContainer}
              >
                <Image
                  source={{ uri: image }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              </ScrollView>
            ))}
          </ScrollView>

          {/* Thumbnail Strip */}
          {combinedImages.length > 1 && (
            <View style={styles.thumbnailStrip}>
              <ScrollView
                ref={thumbnailScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailScrollContent}
              >
                {combinedImages.map((image, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.thumbnailItem,
                      selectedImageIndex === index &&
                        styles.thumbnailItemActive,
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statusPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusPillText: {
    fontWeight: "700",
    fontSize: 11,
    letterSpacing: 0.3,
  },

  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  iconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#3A3A3A",
    marginVertical: 10,
  },
  imageCount: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  odometerRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  odometerItem: {
    flex: 1,
    backgroundColor: "#1F1F1F",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  odometerIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(34, 197, 94, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  odometerLabel: {
    color: colors.text.secondary,
    fontSize: 11,
    marginBottom: 4,
  },
  odometerValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
  },
  checklistWrap: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    overflow: "hidden",
    backgroundColor: "#1F1F1F",
    position: "relative",
    maxHeight: 400,
    marginBottom: 10,
  },
  checklistImage: {
    width: "100%",
    height: 400,
    resizeMode: "contain",
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
  feeSection: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#1F1F1F",
  },
  feeHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feeIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  feeHeaderText: {
    flex: 1,
  },
  feeTitle: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  feeSubtitle: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 2,
  },
  feeAmount: {
    fontSize: 13,
    fontWeight: "700",
  },
  feeDetailsContainer: {
    marginTop: 8,
    marginLeft: 42,
    gap: 6,
  },
  feeDetailRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  feeDetailDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.text.secondary,
    marginTop: 6,
  },
  feeDetailText: {
    flex: 1,
    color: colors.text.secondary,
    fontSize: 11,
    lineHeight: 16,
  },
  feeDetailAmount: {
    fontSize: 11,
    fontWeight: "600",
  },
  paidSection: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "rgba(34, 197, 94, 0.08)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(34, 197, 94, 0.2)",
  },
  paidSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  paidSectionTitle: {
    color: "#22C55E",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  paidRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paidItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  paidDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  paidLabel: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  paidAmount: {
    fontSize: 12,
    fontWeight: "600",
  },
  paidTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(34, 197, 94, 0.2)",
  },
  paidTotalLabel: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "700",
  },
  paidTotalAmount: {
    color: "#22C55E",
    fontSize: 13,
    fontWeight: "700",
  },
  resultSection: {
    marginTop: 12,
    padding: 14,
    borderRadius: 12,
    borderWidth: 2,
  },
  resultSectionPositive: {
    backgroundColor: "rgba(34, 197, 94, 0.1)",
    borderColor: "rgba(34, 197, 94, 0.3)",
  },
  resultSectionNegative: {
    backgroundColor: "rgba(249, 115, 22, 0.1)",
    borderColor: "rgba(249, 115, 22, 0.3)",
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  resultLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "700",
    flex: 1,
  },
  resultAmount: {
    fontSize: 20,
    fontWeight: "800",
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
  },
  modalImageContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  modalImage: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.75 - 40,
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
