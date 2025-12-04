import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Modal as RNModal,
  RefreshControl,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { SectionHeader } from "../molecules/SectionHeader";
import { InfoCard } from "../../../../../common/components/molecules/InfoCard";
import { InfoItem } from "../../../../../common/components/molecules/InfoItem";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { RentalContract } from "../../../../../../domain/entities/booking/RentalContract";
import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";
import { useSelector } from "react-redux";
import { RootState } from "../../../../authentication/store";
import { RentalReceipt } from "../../../../../../domain/entities/booking/RentalReceipt";
import { GenerateContractUseCase } from "../../../../../../domain/usecases/contract/GenerateContractUseCase";
import { useFocusEffect } from "@react-navigation/native";
import { RentalReturnSummaryUseCase } from "../../../../../../domain/usecases/rentalReturn/SummaryReceiptUseCase";
import { SummaryResponse } from "../../../../../../data/models/rentalReturn/SummaryResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { GetListRentalReceiptUseCase } from "../../../../../../domain/usecases/receipt/GetListRentalReceipt";
import { GpsSharingInviteUseCase } from "../../../../../../domain/usecases/gpsSharing/GpsSharingInviteUseCase";
import Toast from "react-native-toast-message";

type BookingDetailsScreenNavigationProp = any;

type BookingDetailsScreenRouteProp = RouteProp<
  StaffStackParamList,
  "BookingDetails"
>;

export const BookingDetailsScreen: React.FC = () => {
  const route = useRoute<BookingDetailsScreenRouteProp>();
  const navigation = useNavigation<BookingDetailsScreenNavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [contract, setContract] = useState<RentalContract | null>(null);
  const [rentalReceipts, setRentalReceipts] = useState<RentalReceipt[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const { bookingId } = route.params;
  const [showContract, setShowContract] = useState(false);
  const [webviewLoading, setWebviewLoading] = useState(false);
  const [viewer, setViewer] = useState<"pdf" | "webview">("pdf");
  const [vehicleModels, setVehicleModels] = useState<VehicleModel[]>([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showModelList, setShowModelList] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [showReceiptListModal, setShowReceiptListModal] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
      fetchVehicleModels();
      fetchRentalReceipt();
      // fetchSummary();
    }, [])
  );

  useEffect(() => {
    if (booking?.bookingStatus === "Completed") {
      fetchSummary();
    }
  }, [booking?.bookingStatus]);

  const fetchBooking = async () => {
    try {
      setLoading(true);
      const getBookingByIdUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );
      const booking = await getBookingByIdUseCase.execute(bookingId);
      setBooking(booking);
      setContract(booking?.rentalContract);
    } catch (error) {
      console.error("Error fetching booking:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRentalReceipt = async () => {
    try {
      const getListRentalReceiptUseCase = new GetListRentalReceiptUseCase(
        sl.get("ReceiptRepository")
      );
      const rentalReceipts = await getListRentalReceiptUseCase.execute(
        bookingId
      );
      setRentalReceipts(rentalReceipts.data);
    } catch (error) {
      console.error("Error fetching rental receipt:", error);
      return null;
    }
  };

  const fetchSummary = async () => {
    try {
      const getSummaryUseCase = new RentalReturnSummaryUseCase(
        sl.get("RentalReturnRepository")
      );
      const summaryResponse = await getSummaryUseCase.execute(bookingId);
      const summaryData: SummaryResponse = unwrapResponse(summaryResponse);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  };

  const generateConstract = async () => {
    try {
      setIsLoading(true);
      const generateContractUseCase = new GenerateContractUseCase(
        sl.get("ReceiptRepository")
      );
      const response = await generateContractUseCase.execute(
        bookingId,
        rentalReceipts?.[0]?.id || ""
      );
      // if (response.success) {
      navigation.navigate("AwaitingApproval");
      // }
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVehicleModels = async () => {
    try {
      const uc = new GetAllVehicleModelsUseCase(
        sl.get("VehicleModelRepository")
      );
      const res = await uc.execute();
      setVehicleModels(res);
    } catch (e) {
      // ignore
      console.error("Error fetching vehicle models:", e);
    }
  };

  const getLastReceipt = () => {
    const receipts = rentalReceipts || [];
    const bookingVehicleId = booking?.vehicle?.id || booking?.vehicleId || null;

    const lastReceipt = receipts.length
      ? (() => {
          if (!bookingVehicleId) {
            return receipts[receipts.length - 1];
          }
          const matched = [...receipts].reverse().find((r) => {
            const id = r?.vehicle?.id || r?.booking?.vehicle?.id || null;
            return id === bookingVehicleId;
          });
          return matched || receipts[receipts.length - 1];
        })()
      : null;
    return lastReceipt;
  };

  const openEdit = () => {
    setSelectedModelId(booking?.vehicleModel?.id || "");
    setShowEdit(true);
  };

  const handleCloseEdit = () => {
    setShowEdit(false);
    setSelectedModelId("");
    setShowModelList(false);
  };

  const openVehicleDetails = () => {
    navigation.navigate("RentedVehicleDetails", {
      vehicleId: booking?.vehicle?.id,
    });
  };

  const saveEdit = async () => {
    try {
      setSaving(true);
      const chosen = vehicleModels.find((m) => m.id === selectedModelId);
      if (chosen && booking) {
        setBooking({ ...booking, vehicleModel: chosen } as Booking);
      }
      setShowEdit(false);
    } finally {
      setSaving(false);
    }
  };

  const hasContract = !!contract?.contractPdfUrl;
  const hasRentalReceipt = rentalReceipts?.[0]?.id ? true : false;
  const contractInfo = useMemo(
    () => ({
      id: contract?.id || "",
      status: contract?.contractStatus || "-",
      url: contract?.contractPdfUrl || "",
    }),
    [contract]
  );

  const canSignContract =
    user?.id &&
    booking?.renter?.id === user.id &&
    contract?.contractStatus === "Unsigned";

  const statusMeta = useMemo(() => {
    const status = booking?.bookingStatus;
    switch (status) {
      case "Booked":
        return {
          label: "Đã đặt",
          bg: "rgba(250, 204, 21, 0.12)",
          border: "rgba(250, 204, 21, 0.4)",
          text: "#FACC15",
          icon: "calendar",
        };
      case "Renting":
        return {
          label: "Đang thuê",
          bg: "rgba(34, 197, 94, 0.12)",
          border: "rgba(34, 197, 94, 0.4)",
          text: "#22C55E",
          icon: "car",
        };
      case "Returned":
        return {
          label: "Đã trả",
          bg: "rgba(249, 115, 22, 0.12)",
          border: "rgba(249, 115, 22, 0.4)",
          text: "#F97316",
          icon: "swap",
        };
      case "Completed":
        return {
          label: "Hoàn tất",
          bg: "rgba(59, 130, 246, 0.12)",
          border: "rgba(59, 130, 246, 0.4)",
          text: "#3B82F6",
          icon: "checkcircle",
        };
      default:
        return {
          label: status || "-",
          bg: "rgba(148, 163, 184, 0.15)",
          border: "rgba(148, 163, 184, 0.4)",
          text: "#94A3B8",
          icon: "exclamationcircleo",
        };
    }
  }, [booking?.bookingStatus]);

  // Temporary summary (will be replaced by API output when available)
  const returnSummary = {
    baseRentalFee: 3130000,
    totalChargingFee: 0,
    totalAdditionalFees: 0,
    feesBreakdown: {
      damageFee: 0,
      cleaningFee: 0,
      lateReturnFee: 0,
      crossBranchFee: 0,
      excessKmFee: 0,
    },
    totalAmount: 3130000,
    depositAmount: 2000000,
    refundAmount: -1130000,
  } as const;

  const formatVnd = (n: number) =>
    new Intl.NumberFormat("vi-VN").format(n) + " VND";
  const insurancePackage = booking?.insurancePackage || null;
  const hasInsurancePackage = !!insurancePackage;

  const handleViewReceipt = (receiptId: string) => {
    setShowReceiptListModal(false);
    navigation.navigate("HandoverReceiptReport", {
      bookingId,
      rentalReceiptId: receiptId,
    });
  };

  const openReturnReceiptReport = () => {
    if (!booking) return;

    const zero = 0;
    navigation.navigate("ReturnReceiptReport", {
      bookingId,
      rentalReceiptId: getLastReceipt()?.id || "",
      settlement: {
        baseRentalFee: zero,
        depositAmount: zero,
        totalAmount: zero,
        totalChargingFee: zero,
        totalAdditionalFees: zero,
        refundAmount: zero,
        feesBreakdown: {
          cleaningFee: zero,
          crossBranchFee: zero,
          damageFee: zero,
          excessKmFee: zero,
          lateReturnFee: zero,
        },
      },
    });
  };

  const handleShareGPSInvite = async () => {
    if (!booking?.vehicle?.id) {
      return;
    }

    try {
      // TODO: Implement GPS sharing API call
      // This could generate a shareable link or send an invite to staff
      // For now, we'll show a placeholder action
      console.log("Sharing GPS invite for vehicle:", booking.vehicle.id);

      // You can implement:
      // 1. Generate shareable link
      // 2. Send invite to staff members
      // 3. Open share dialog with link
      // Example:
      const gpsSharingInviteUseCase = await new GpsSharingInviteUseCase(
        sl.get("GpsSharingRepository")
      );
      const response = await gpsSharingInviteUseCase.execute({
        bookingId: booking.id,
      });
      if (response.success) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đã chia sẻ GPS invite",
        });
        navigation.jumpTo("ShareGpsTab", {
          screen: "SessionList",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: error?.message || "Không thể chia sẻ GPS invite",
      });
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Global loading overlay */}
      <ScreenHeader
        title="Booking Details"
        subtitle={booking?.renter?.fullName()}
        onBack={() => navigation.goBack()}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchBooking} />
        }
      >
        {/* Payment Ready Banner - Show when return files exist and status is Renting */}
        {user?.role === "RENTER" &&
          booking?.bookingStatus === "Returned" &&
          rentalReceipts?.[0]?.returnVehicleImageFiles?.length > 0 && (
            // rentalReceipts?.[0]?.checkListFile &&
            <TouchableOpacity
              style={styles.paymentReadyBanner}
              onPress={openReturnReceiptReport}
              activeOpacity={0.9}
            >
              <View style={styles.paymentReadyContent}>
                <View style={styles.paymentReadyLeft}>
                  <View style={styles.paymentReadyIconContainer}>
                    <AntDesign name="wallet" size={24} color="#FFD666" />
                  </View>
                  <View style={styles.paymentReadyTextContainer}>
                    <Text style={styles.paymentReadyTitle}>
                      Sẵn sàng thanh toán
                    </Text>
                    <Text style={styles.paymentReadySubtitle}>
                      Xem biên bản trả xe và hoàn tất thanh toán
                    </Text>
                  </View>
                </View>
                <View style={styles.paymentReadyRight}>
                  <View style={styles.paymentReadyBadge}>
                    <AntDesign name="check-circle" size={16} color="#67D16C" />
                    <Text style={styles.paymentReadyBadgeText}>Mới</Text>
                  </View>
                  <AntDesign
                    name="arrow-right"
                    size={20}
                    color="#FFD666"
                    style={styles.paymentReadyArrow}
                  />
                </View>
              </View>
              <View style={styles.paymentReadyFooter}>
                <View style={styles.paymentReadyInfoRow}>
                  <AntDesign
                    name="picture"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.paymentReadyInfoText}>
                    {getLastReceipt()?.returnVehicleImageFiles?.length} ảnh xe
                    trả
                  </Text>
                </View>
                <View style={styles.paymentReadyInfoRow}>
                  <AntDesign
                    name="file-text"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.paymentReadyInfoText}>
                    Đã có checklist
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}

        {/* Customer Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Khách hàng" icon="user" />
          <InfoCard>
            <Text style={styles.customerName}>
              Họ và tên: {booking?.renter?.fullName()}
            </Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Tên tài khoản: {booking?.renter?.account?.username}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoText}>
                Số điện thoại: {booking?.renter?.phone}
              </Text>
            </View>
          </InfoCard>
        </View>

        {/* Booking Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Booking" icon="calendar" />
          {/* Status and meta */}
          <View style={styles.metaChipsRow}>
            <View
              style={[
                styles.statusPill,
                { backgroundColor: statusMeta.bg, borderColor: statusMeta.border },
              ]}
            >
              <AntDesign
                name={statusMeta.icon as any}
                size={12}
                color={statusMeta.text}
              />
              <Text
                style={[
                  styles.statusPillText,
                  { color: statusMeta.text },
                ]}
              >
                {statusMeta.label}
              </Text>
            </View>
            {!!booking?.id && (
              <View style={styles.idPill}>
                <AntDesign name="tags" size={12} color="#C9B6FF" />
                <Text style={styles.idPillText}>#{booking.id.slice(-8)}</Text>
              </View>
            )}
          </View>

          <InfoCard>
            {/* Vehicle Model */}
            {booking?.vehicle?.id && (
              <>
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                    <AntDesign name="idcard" size={14} color="#7DB3FF" />
                <Text style={styles.iconLabel}>Mã xe thuê</Text>
              </View>
              <Text style={styles.iconValue}>
                #{booking?.vehicle?.id.slice(-12) || "-"}
              </Text>
            </View>
            <View style={styles.divider} />
              </>
            )}
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                <AntDesign name="car" size={14} color="#FFD666" />
                <Text style={styles.iconLabel}>Mẫu xe thuê</Text>
              </View>
              <Text style={styles.iconValue}>
                {booking?.vehicleModel?.modelName || "-"}
              </Text>
            </View>
            <View style={styles.divider} />

            {/* Location */}
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                <AntDesign name="environment" size={14} color="#7DB3FF" />
                <Text style={styles.iconLabel}>Địa điểm thuê</Text>
              </View>
              <Text style={styles.iconValue}>
                {booking?.handoverBranch?.branchName || "-"}
              </Text>
            </View>
            <View style={styles.divider} />
            {/* Start time */}
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                <AntDesign name="clock-circle" size={14} color="#67D16C" />
                <Text style={styles.iconLabel}>Thời gian thuê</Text>
              </View>
              <Text style={styles.iconValue}>
                {booking?.startDatetime?.toLocaleString("en-GB") || "-"}
              </Text>
            </View>
            <View style={styles.divider} />
            {/* End time */}
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                <AntDesign name="clock-circle" size={14} color="#FFB300" />
                <Text style={styles.iconLabel}>Thời gian trả</Text>
              </View>
              <Text style={styles.iconValue}>
                {booking?.endDatetime?.toLocaleString("en-GB") || "-"}
              </Text>
            </View>
            <View style={styles.divider} />
            {/* Package */}
            <View style={styles.iconRow}>
              <View style={styles.iconLeft}>
                <AntDesign name="inbox" size={14} color="#7DB3FF" />
                <Text style={styles.iconLabel}>Gói thuê</Text>
              </View>
              <Text style={styles.iconValue}>24 giờ</Text>
            </View>
          </InfoCard>
        </View>
        {booking?.vehicle?.id && (
          <>
          <TouchableOpacity
            style={styles.vehicleDetailsBtn}
            activeOpacity={0.85}
            onPress={openVehicleDetails}
          >
            <View style={styles.vehicleDetailsLeft}>
              <View style={styles.vehicleIconBadge}>
                <AntDesign name="car" size={18} color="#000" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.vehicleDetailsTitle}>
                  Xem thông tin xe đang thuê
                </Text>
                <Text style={styles.vehicleDetailsSubtitle}>
                  {booking?.vehicle?.licensePlate || "Chưa có biển số"} ·{" "}
                  {booking?.vehicleModel?.modelName ||
                    booking?.vehicle?.vehicleModel?.modelName ||
                    "Đang cập nhật"}
                </Text>
              </View>
            </View>
            <AntDesign name="arrow-right" size={18} color="#fff" />
          </TouchableOpacity>

            {/* Charging history CTA - navigate to booking charging list */}
            <TouchableOpacity
              style={styles.chargingHistoryBtn}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate("ChargingListBooking", {
                  bookingId,
                  licensePlate: booking?.vehicle?.licensePlate,
                })
              }
            >
              <View style={styles.chargingHistoryLeft}>
                <View style={styles.chargingIconBadge}>
                  <AntDesign name="thunderbolt" size={20} color="#000" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.chargingHistoryTitle}>
                    Lịch sử sạc theo booking
                  </Text>
                  <Text style={styles.chargingHistorySubtitle}>
                    Xem các phiên sạc đã tạo cho xe ·{" "}
                    {booking?.vehicle?.licensePlate || "Chưa có biển số"}
                  </Text>
                </View>
              </View>
              <View style={styles.chargingHistoryRight}>
                <View style={styles.chargingHistoryBadge}>
                  <AntDesign name="thunderbolt" size={12} color="#22C55E" />
                  <Text style={styles.chargingHistoryBadgeText}>Charging</Text>
                </View>
                <AntDesign name="arrow-right" size={18} color="#C9B6FF" />
              </View>
            </TouchableOpacity>
          </>
        )}

        {hasInsurancePackage && insurancePackage && (
          <View style={styles.section}>
            <SectionHeader
              title="Thông tin Bảo hiểm"
              icon="safety-certificate"
            />
            <InfoCard style={styles.insuranceCard}>
              <View style={styles.insuranceHeaderRow}>
                <View style={styles.insuranceTitleWrap}>
                  <Text style={styles.insuranceLabel}>Gói bảo hiểm</Text>
                  <Text style={styles.insuranceTitle}>
                    {insurancePackage.packageName}
                  </Text>
                </View>
                {insurancePackage.packageName && (
                  <View style={styles.insuranceBadge}>
                    <AntDesign name="safety" size={16} color="#000" />
                    <Text style={styles.insuranceBadgeText}>
                      {insurancePackage.packageName.toUpperCase()}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.insuranceMetaRow}>
                <View style={styles.insuranceMetaPill}>
                  <AntDesign name="wallet" size={12} color="#fff" />
                  <Text style={styles.insuranceMetaText}>
                    Phí gói {formatVnd(insurancePackage.packageFee)}
                  </Text>
                </View>
                <View style={styles.insuranceMetaPill}>
                  <AntDesign name="warning" size={12} color="#fff" />
                  <Text style={styles.insuranceMetaText}>
                    Khấu trừ {formatVnd(insurancePackage.deductibleAmount)}
                  </Text>
                </View>
              </View>

              <View style={styles.insuranceGrid}>
                <InfoItem
                  label="Bồi thường cho người"
                  value={`${formatVnd(
                    insurancePackage.coveragePersonLimit
                  )} / người`}
                />
                <InfoItem
                  label="Bồi thường tài sản"
                  value={`${formatVnd(insurancePackage.coveragePropertyLimit)}`}
                />
                <InfoItem
                  label="Bảo hiểm vật chất xe"
                  value={`${insurancePackage.coverageVehiclePercentage}% giá trị xe`}
                />
                <InfoItem
                  label="Bảo hiểm trộm cắp"
                  value={
                    insurancePackage.coverageTheft
                      ? "Bao gồm toàn diện"
                      : "Không bao gồm"
                  }
                />
              </View>

              {!!insurancePackage.description && (
                <View style={styles.insuranceDescription}>
                  <Text style={styles.insuranceDescriptionLabel}>
                    Quyền lợi
                  </Text>
                  <Text style={styles.insuranceDescriptionText}>
                    {insurancePackage.description}
                  </Text>
                </View>
              )}
            </InfoCard>
          </View>
        )}

        {/* Return Summary */}
        {booking?.bookingStatus === "Completed" && (
        <View style={styles.section}>
          <SectionHeader title="Tóm tắt trả xe" icon="profile" />
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeaderRow}>
              <Text style={styles.summaryHeaderTitle}>Financial Summary</Text>
              <View style={styles.summaryPill}>
                <Text style={styles.summaryPillText}>Biên bản bàn giao</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Phí thuê xe</Text>
              <Text style={styles.summaryVal}>
                {formatVnd(summary?.baseRentalFee || 0)}
              </Text>
            </View>
            {summary?.totalChargingFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí sạc pin</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.totalChargingFee || 0)}
                </Text>
              </View>
            )}
              {summary?.feesBreakdown?.damageDetails.length > 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí hư hỏng</Text>
                <Text style={styles.summaryVal}>
                    {formatVnd(
                      summary?.feesBreakdown.damageDetails.reduce(
                        (acc, detail) => acc + detail.amount,
                        0
                      ) || 0
                    )}
                </Text>
              </View>
            )}
            {summary?.feesBreakdown?.cleaningFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí vệ sinh</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.cleaningFee || 0)}
                </Text>
              </View>
            )}
            {summary?.feesBreakdown?.crossBranchFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí chuyển chi nhánh</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.crossBranchFee || 0)}
                </Text>
              </View>
            )}
            {summary?.feesBreakdown?.excessKmFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí quá quãng đường</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.excessKmFee || 0)}
                </Text>
              </View>
            )}
            {summary?.feesBreakdown?.lateReturnFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Trả muộn</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.lateReturnFee || 0)}
                </Text>
              </View>
            )}

            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Tổng phụ phí</Text>
              <Text style={styles.summaryVal}>
                {formatVnd(summary?.totalAmount || 0)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Tiền cọc</Text>
              <Text style={styles.summaryVal}>
                {formatVnd(summary?.depositAmount || 0)}
              </Text>
            </View>

            <View style={styles.divider} />
            <View style={[styles.summaryRow]}>
              <Text style={styles.summaryTotalLabel}>
                {summary?.refundAmount >= 0
                  ? "Số tiền hoàn lại"
                  : "Số tiền cần thanh toán thêm"}
              </Text>
              <Text
                style={[
                  styles.summaryTotalValue,
                  {
                    color: summary?.refundAmount >= 0 ? "#22C55E" : "#F97316", // xanh: hoàn tiền, cam: cần trả thêm
                  },
                ]}
              >
                {formatVnd(Math.abs(summary?.refundAmount || 0))}
              </Text>
            </View>
            {summary?.refundAmount < 0 && (
              <Text style={styles.paymentNote}>
                Số tiền này sẽ được thanh toán thêm qua ví hoặc chuyển khoản.
              </Text>
            )}
          </View>
        </View>
        )}

        {hasRentalReceipt && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <SectionHeader title="Biên bản bàn giao" icon="file-text" />
              {rentalReceipts && rentalReceipts.length > 1 && (
                <View style={styles.receiptCountBadge}>
                  <Text style={styles.receiptCountText}>
                    {rentalReceipts.length} biên bản
                  </Text>
                </View>
              )}
            </View>
            <InfoCard>
              <TouchableOpacity
                style={[styles.actionBtn, styles.receiptBtn]}
                onPress={() => setShowReceiptListModal(true)}
              >
                <AntDesign name="file-text" size={18} color="#000" />
                <Text style={styles.actionBtnText}>
                  {rentalReceipts && rentalReceipts.length > 1
                    ? `Xem ${rentalReceipts.length} biên bản bàn giao`
                    : "Xem biên bản bàn giao"}
                </Text>
              </TouchableOpacity>
              {booking?.bookingStatus === "Completed" ||
                (booking?.bookingStatus === "Returned" &&
                  rentalReceipts?.[0]?.returnVehicleImageFiles?.length > 0 && (
                    // rentalReceipts?.[0]?.checkListReturnFile &&
                <TouchableOpacity
                  style={[styles.actionBtn, styles.returnReportBtn]}
                      onPress={openReturnReceiptReport}
                >
                  <AntDesign name="file-text" size={18} color="#000" />
                  <Text style={styles.returnReportBtnText}>
                    Xem biên bản trả xe
                  </Text>
                </TouchableOpacity>
                  ))}
            </InfoCard>
          </View>
        )}

        {/* Contract Section (only when available) */}
        {hasContract && (
          <View style={styles.section}>
            <SectionHeader title="Hợp đồng thuê" icon="file-text" />
            <InfoCard style={styles.contractCard}>
              <InfoItem
                label="Mã hợp đồng:"
                value={`#${contractInfo.id.slice(-8).toUpperCase()}`}
              />
              <InfoItem
                label="Trạng thái:"
                value={contractInfo.status === "Signed" ? "Đã ký" : "Chưa ký"}
              />
              {/* Sign contract CTA if eligible */}
              {canSignContract && (
                <TouchableOpacity
                  style={styles.signContractBtn}
                  onPress={() =>
                    navigation.navigate("SignContract", {
                      bookingId,
                      email: booking?.renter?.email,
                      fullName: booking?.renter?.account?.fullname,
                      receiptId: rentalReceipts?.[0]?.id || "",
                    })
                  }
                >
                  <AntDesign name="edit" size={16} color="#fff" />
                  <Text style={styles.signContractBtnText}>
                    Ký hợp đồng kỹ thuật số
                  </Text>
                </TouchableOpacity>
              )}
              <View style={styles.contractActionsRow}>
                <TouchableOpacity
                  style={[styles.contractBtn, styles.contractBtnPrimary]}
                  onPress={() => {
                    setViewer("pdf");
                    setShowContract(true);
                  }}
                >
                  <AntDesign name="file" size={16} color="#000" />
                  <Text style={styles.contractBtnText}>Xem hợp đồng</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity
                  style={[styles.contractBtn, styles.contractBtnSecondary]}
                  onPress={() => {
                    setViewer("webview");
                    setShowContract(true);
                  }}
                >
                  <AntDesign name="export" size={16} color="#000" />
                  <Text style={styles.contractBtnText}>Mở bằng WebView</Text>
                </TouchableOpacity> */}
              </View>
              <Text style={styles.contractNote}>
                Bạn có thể xem hợp đồng trong ứng dụng hoặc mở bằng trình duyệt
              </Text>
            </InfoCard>
          </View>
        )}

        {booking?.bookingStatus === "Booked" &&
          !hasRentalReceipt &&
          !hasContract && (
            <View style={styles.editRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.updateBtn]}
                onPress={openEdit}
              >
                <AntDesign name="edit" size={16} color="#000" />
                <Text style={styles.actionBtnText}>Update Booking</Text>
              </TouchableOpacity>
            </View>
          )}
        {booking?.bookingStatus === "Renting" && user?.role === "STAFF" && (
          <View style={styles.editRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.changeBtn]}
              onPress={() => {
                navigation.navigate("SelectVehicle", {
                  bookingId: bookingId,
                  renterName: booking?.renter?.fullName?.() ?? "",
                  vehicleModel: booking?.vehicleModel,
                  vehicleStatus: "Available",
                  isChangeVehicle: true,
                });
              }}
            >
              <AntDesign name="swap" size={16} color="#000" />
              <Text style={styles.actionBtnText}>Đổi xe</Text>
            </TouchableOpacity>
          </View>
        )}
        {booking?.bookingStatus === "Booked" &&
          hasRentalReceipt &&
          !hasContract && (
            <View style={styles.contractCreateRow}>
              <TouchableOpacity
                style={[
                  styles.contractCreateBtn,
                  isLoading && styles.contractCreateBtnDisabled,
                ]}
                onPress={generateConstract}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <AntDesign name="file-text" size={20} color="#000" />
                )}
                <Text style={styles.contractCreateBtnText}>
                  {isLoading ? "Đang tạo hợp đồng..." : "Tạo hợp đồng thuê"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        {booking?.bookingStatus === "Renting" && (
          <View style={styles.editRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.gpsBtn]}
              onPress={() =>
                navigation.navigate("TrackingGPS", {
                  vehicleId: booking?.vehicle?.id,
                  licensePlate: booking?.vehicle?.licensePlate,
                })
              }
            >
              <AntDesign name="environment" size={16} color="#000" />
              <Text style={styles.actionBtnText}>Theo dõi GPS</Text>
            </TouchableOpacity>
          </View>
        )}
        {booking?.bookingStatus === "Renting" &&
          user?.role === "RENTER" &&
          booking?.renter?.id === user.id && (
            <View style={styles.editRow}>
              <TouchableOpacity
                style={[styles.actionBtn, styles.shareGpsBtn]}
                onPress={handleShareGPSInvite}
              >
                <AntDesign name="export" size={16} color="#000" />
                <Text style={styles.actionBtnText}>Share GPS Invite</Text>
              </TouchableOpacity>
            </View>
          )}
        {booking?.bookingStatus === "Returned" && user?.role === "STAFF" && (
          <View style={styles.editRow}>
            <TouchableOpacity
              style={styles.additionalFeesBtn}
              onPress={() => {
                navigation.navigate("AdditionalFees", {
                  bookingId: bookingId,
                });
              }}
              activeOpacity={0.8}
            >
              <View style={styles.additionalFeesBtnContent}>
                <AntDesign name="plus-circle" size={18} color="#FFD666" />
                <Text style={styles.additionalFeesBtnText}>
                  Thêm phí phát sinh
                </Text>
                <AntDesign name="right" size={16} color="#FFD666" />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Contract WebView Modal */}
      <Modal
        visible={showContract}
        animationType="fade"
        onRequestClose={() => setShowContract(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.modalBack}
              onPress={() => setShowContract(false)}
            >
              <AntDesign name="arrow-left" size={20} color="#000" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Hợp đồng thuê</Text>
            <View style={{ width: 20 }} />
          </View>

          <View style={styles.webviewWrap}>
            {webviewLoading && (
              <View style={styles.webviewLoadingOverlay}>
                <ActivityIndicator color="#000" />
              </View>
            )}
            {contractInfo.url ? (
              viewer === "pdf" ? (
                <Pdf
                  trustAllCerts={false}
                  source={{ uri: contractInfo.url, cache: true }}
                  onLoadProgress={() => setWebviewLoading(true)}
                  onLoadComplete={() => setWebviewLoading(false)}
                  onError={() => setWebviewLoading(false)}
                  style={styles.webview}
                />
              ) : (
                // <Text>PDF</Text>
                <WebView
                  source={{ uri: contract?.contractPdfUrl }}
                  onLoadStart={() => setWebviewLoading(true)}
                  onLoadEnd={() => setWebviewLoading(false)}
                  style={styles.webview}
                />
              )
            ) : (
              <View style={styles.noContractWrap}>
                <AntDesign name="file" size={32} color="#999" />
                <Text style={styles.noContractText}>
                  Không có đường dẫn hợp đồng
                </Text>
              </View>
            )}
          </View>
        </SafeAreaView>
      </Modal>

      {/* Edit Booking Modal */}
      <RNModal
        visible={showEdit}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEdit(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderDark}>
              <Text style={styles.modalTitleDark}>Update Booking</Text>
              <TouchableOpacity onPress={handleCloseEdit}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.fieldLabelDark}>Vehicle Model</Text>
            <View style={styles.selectContainerDark}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[styles.inputDark, styles.selectLike]}
                onPress={() => setShowModelList((p) => !p)}
              >
                <Text style={{ color: colors.text.primary }}>
                  {vehicleModels.find(
                    (m) =>
                      m.id === (selectedModelId || booking?.vehicleModel?.id)
                  )?.modelName || "All models"}
                </Text>
                <AntDesign
                  name={showModelList ? "up" : "down"}
                  size={12}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
              {showModelList && (
                <View style={styles.dropdownList}>
                  <ScrollView style={{ maxHeight: 160 }}>
                    <TouchableOpacity
                      key={"all"}
                      style={[
                        styles.dropdownItem,
                        !selectedModelId && styles.dropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedModelId("");
                        setShowModelList(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>All models</Text>
                    </TouchableOpacity>
                    {vehicleModels.map((m) => (
                      <TouchableOpacity
                        key={m.id}
                        style={[
                          styles.dropdownItem,
                          selectedModelId === m.id &&
                            styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setSelectedModelId(m.id);
                          setShowModelList(false);
                        }}
                      >
                        <Text style={styles.dropdownItemText}>
                          {m.modelName}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            <View style={styles.modalActionsDark}>
              <TouchableOpacity
                style={[styles.modalBtnDark, styles.resetBtnDark]}
                onPress={() => {
                  setSelectedModelId("");
                  setShowModelList(false);
                }}
              >
                <Text style={styles.modalBtnTextDark}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtnDark, styles.applyBtnDark]}
                onPress={saveEdit}
                disabled={saving}
              >
                <Text style={[styles.modalBtnTextDark, { color: "#000" }]}>
                  {saving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </RNModal>

      {/* Receipt List Modal */}
      <RNModal
        visible={showReceiptListModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReceiptListModal(false)}
      >
        <View style={styles.receiptModalBackdrop}>
          <View style={styles.receiptModalContainer}>
            <View style={styles.receiptModalHeader}>
              <View>
                <Text style={styles.receiptModalTitle}>Danh sách biên bản</Text>
                <Text style={styles.receiptModalSubtitle}>
                  {rentalReceipts?.length || 0} biên bản bàn giao
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setShowReceiptListModal(false)}
                style={styles.receiptModalCloseBtn}
              >
                <AntDesign name="close" size={20} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.receiptListContent}
            >
              {rentalReceipts?.map((receipt, index) => {
                const receiptId = receipt.id
                  ? `#${receipt.id.slice(-8).toUpperCase()}`
                  : "-";
                // Handle both entity structure and API response structure
                const vehicle = (receipt as any).vehicle || receipt.vehicle;
                const vehicleInfo = vehicle
                  ? `${vehicle.licensePlate || "-"} · ${vehicle.color || "-"}`
                  : "-";
                // Handle both handOverVehicleImageFiles (entity) and API response
                const imageFiles =
                  (receipt as any).handOverVehicleImageFiles ||
                  receipt.handOverVehicleImageFiles ||
                  [];
                const imageCount = Array.isArray(imageFiles)
                  ? imageFiles.length
                  : 0;
                const isConfirmed = !!receipt.renterConfirmedAt;

                return (
                  <TouchableOpacity
                    key={receipt.id || index}
                    style={styles.receiptCard}
                    onPress={() => handleViewReceipt(receipt.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.receiptCardHeader}>
                      <View style={styles.receiptCardLeft}>
                        <View style={styles.receiptNumberBadge}>
                          <Text style={styles.receiptNumberText}>
                            {index + 1}
                          </Text>
                        </View>
                        <View style={styles.receiptCardInfo}>
                          <Text style={styles.receiptCardId}>
                            Mã: {receiptId}
                          </Text>
                        </View>
                      </View>
                      {isConfirmed && (
                        <View style={styles.confirmedBadge}>
                          <AntDesign
                            name="check-circle"
                            size={14}
                            color="#67D16C"
                          />
                          <Text style={styles.confirmedText}>Đã xác nhận</Text>
                        </View>
                      )}
                    </View>

                    {receipt.notes && (
                      <View style={styles.receiptNotes}>
                        <AntDesign
                          name="file-text"
                          size={12}
                          color={colors.text.secondary}
                        />
                        <Text style={styles.receiptNotesText} numberOfLines={2}>
                          Ghi chú: {receipt.notes}
                        </Text>
                      </View>
                    )}

                    <View style={styles.receiptVehicleInfo}>
                      <View style={styles.receiptVehicleRow}>
                        <AntDesign
                          name="car"
                          size={14}
                          color={colors.text.secondary}
                        />
                        <Text style={styles.receiptVehicleText}>
                          {vehicleInfo}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.receiptMetrics}>
                      <View style={styles.receiptMetricItem}>
                        <View style={styles.receiptMetricIcon}>
                          <AntDesign name="dashboard" size={12} color="#fff" />
                        </View>
                        <Text style={styles.receiptMetricLabel}>Số km</Text>
                        <Text style={styles.receiptMetricValue}>
                          {receipt.startOdometerKm?.toLocaleString("vi-VN") ||
                            0}{" "}
                          km
                        </Text>
                      </View>
                      <View style={styles.receiptMetricItem}>
                        <View style={styles.receiptMetricIcon}>
                          <AntDesign
                            name="thunderbolt"
                            size={12}
                            color="#fff"
                          />
                        </View>
                        <Text style={styles.receiptMetricLabel}>Pin</Text>
                        <Text style={styles.receiptMetricValue}>
                          {receipt.startBatteryPercentage || 0}%
                        </Text>
                      </View>
                      {imageCount > 0 && (
                        <View style={styles.receiptMetricItem}>
                          <View style={styles.receiptMetricIcon}>
                            <AntDesign name="picture" size={12} color="#fff" />
                          </View>
                          <Text style={styles.receiptMetricLabel}>Ảnh</Text>
                          <Text style={styles.receiptMetricValue}>
                            {imageCount}
                          </Text>
                        </View>
                      )}
                    </View>

                    <View style={styles.receiptCardFooter}>
                      <Text style={styles.receiptCardActionText}>
                        Nhấn để xem chi tiết
                      </Text>
                      <AntDesign
                        name="arrow-right"
                        size={16}
                        color={colors.text.secondary}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </RNModal>
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
  header: {
    alignItems: "center",
    paddingVertical: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 20,
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text.primary,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  contractCard: {
    backgroundColor: "#1F1F1F",
  },
  customerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text.primary,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  metaChipsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  statusPillText: { fontWeight: "700", fontSize: 12, letterSpacing: 0.3 },
  idPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(201,182,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  idPillText: { color: "#C9B6FF", fontWeight: "700", fontSize: 12 },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  iconLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconLabel: { color: colors.text.secondary, fontSize: 12 },
  iconValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "600",
    flexShrink: 1,
    textAlign: "right",
  },
  divider: {
    height: 1,
    backgroundColor: "#dedede",
    marginVertical: 4,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 14,
    color: colors.text.secondary,
    marginHorizontal: 8,
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    paddingVertical: 2,
  },
  infoLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    flex: 1,
    marginRight: 16,
  },
  infoValue: {
    fontSize: 14,
    color: colors.text.primary,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  proceedButton: {
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 20,
    marginHorizontal: 16,
  },
  proceedButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  checkIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  proceedButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  editRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    marginHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  updateBtn: { backgroundColor: "#C9B6FF" },
  changeBtn: { backgroundColor: "#FFD666" },
  gpsBtn: { backgroundColor: "#7DB3FF" },
  shareGpsBtn: { backgroundColor: "#7CFFCB" },
  receiptBtn: { backgroundColor: "#C9B6FF" },
  actionBtnText: { color: "#000", fontWeight: "700" },
  contractCreateRow: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  contractCreateBtn: {
    backgroundColor: "#C9B6FF",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    shadowColor: "#C9B6FF",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  contractCreateBtnText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  contractCreateBtnDisabled: {
    opacity: 0.6,
  },
  returnReportRow: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  returnReportBtn: {
    backgroundColor: "#FFD666",
    borderRadius: 12,
    marginTop: 10,
  },
  returnReportBtnText: {
    color: "#000",
    fontWeight: "700",
  },
  contractActionsRow: {
    flexDirection: "row",
    gap: 10,
  },
  contractBtn: {
    marginTop: 10,
    backgroundColor: "#C9B6FF",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  contractBtnPrimary: {
    flex: 1,
    backgroundColor: "#C9B6FF",
  },
  contractBtnSecondary: {
    flex: 1,
    backgroundColor: "#E6E6E6",
  },
  contractBtnText: {
    color: "#000",
    fontWeight: "700",
  },
  contractNote: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
    marginTop: 8,
  },
  insuranceCard: {
    gap: 12,
    padding: 18,
  },
  insuranceHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  insuranceTitleWrap: {
    flex: 1,
    gap: 4,
  },
  insuranceLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  insuranceTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
  insuranceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFD666",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  insuranceBadgeText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 12,
    letterSpacing: 0.5,
  },
  insuranceMetaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  insuranceMetaPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(201,182,255,0.2)",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  insuranceMetaText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
  },
  insuranceGrid: {
    gap: 10,
  },
  insuranceDescription: {
    backgroundColor: "rgba(255,214,102,0.12)",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,214,102,0.25)",
    gap: 6,
  },
  insuranceDescriptionLabel: {
    color: "#FFD666",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  insuranceDescriptionText: {
    color: colors.text.primary,
    fontSize: 12,
    lineHeight: 18,
  },
  // Return summary styles
  summaryCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  summaryHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  summaryHeaderTitle: { color: colors.text.primary, fontWeight: "700" },
  summaryPill: {
    backgroundColor: "rgba(201,182,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  summaryPillText: { color: "#C9B6FF", fontWeight: "700", fontSize: 12 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  summaryKey: { color: colors.text.secondary, fontSize: 12 },
  summaryVal: { color: colors.text.primary, fontSize: 12, fontWeight: "600" },
  summaryTotalRow: {
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
    paddingTop: 10,
    marginTop: 6,
  },
  summaryTotalLabel: { color: colors.text.primary, fontWeight: "700" },
  summaryTotalValue: { fontWeight: "800" },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginTop: 20,
  },
  modalBack: {
    padding: 6,
  },
  modalTitle: {
    fontWeight: "700",
    color: "#000",
  },
  webviewWrap: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  webview: {
    flex: 1,
  },
  webviewLoadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  noContractWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  noContractText: {
    color: "#999",
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  loadingOverlayText: { marginTop: 8, color: "#C9B6FF" },
  // Dark modal styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#1E1E1E",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    overflow: "visible",
    maxHeight: "90%",
  },
  modalHeaderDark: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  modalTitleDark: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  fieldLabelDark: {
    color: colors.text.secondary,
    marginBottom: 6,
    fontSize: 12,
  },
  inputDark: {
    backgroundColor: "#2A2A2A",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#3A3A3A",
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.text.primary,
  },
  selectContainerDark: { position: "relative" },
  selectLike: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownList: {
    position: "absolute",
    bottom: 46,
    left: 0,
    right: 0,
    backgroundColor: "#262626",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333333",
    overflow: "hidden",
    zIndex: 1000,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  dropdownItemSelected: { backgroundColor: "#313131" },
  dropdownItemText: { color: colors.text.primary, fontSize: 12 },
  modalActionsDark: {
    flexDirection: "row",
    gap: 10,
    marginTop: 8,
    marginBottom: 16,
  },
  modalBtnDark: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  resetBtnDark: { backgroundColor: "#2A2A2A" },
  applyBtnDark: { backgroundColor: "#C9B6FF", borderColor: "#C9B6FF" },
  modalBtnTextDark: { color: colors.text.primary, fontWeight: "700" },
  signContractBtn: {
    backgroundColor: "#6B3EF5",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    marginBottom: 4,
    marginTop: 10,
  },
  signContractBtnText: { color: "#fff", fontWeight: "700" },
  paymentNote: {
    color: "#F97316",
    fontSize: 12,
    textAlign: "left",
    marginTop: 8,
    marginHorizontal: 16,
  },
  vehicleDetailsBtn: {
    marginBottom: 8,
    marginHorizontal: 16,
    backgroundColor: "#131313",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  vehicleDetailsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  vehicleIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD666",
    alignItems: "center",
    justifyContent: "center",
  },
  vehicleDetailsTitle: {
    color: colors.text.primary,
    fontWeight: "700",
  },
  vehicleDetailsSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  chargingHistoryBtn: {
    marginTop: 10,
    marginBottom: 8,
    marginHorizontal: 16,
    backgroundColor: "#14121F",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.6)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    shadowColor: "#C9B6FF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  chargingHistoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  chargingIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  chargingHistoryTitle: {
    color: colors.text.primary,
    fontWeight: "700",
    fontSize: 15,
  },
  chargingHistorySubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  chargingHistoryRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  chargingHistoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.4)",
  },
  chargingHistoryBadgeText: {
    color: "#22C55E",
    fontSize: 11,
    fontWeight: "600",
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  receiptCountBadge: {
    backgroundColor: "rgba(201,182,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  receiptCountText: {
    color: "#C9B6FF",
    fontSize: 11,
    fontWeight: "700",
  },
  // Receipt List Modal Styles
  receiptModalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  receiptModalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "90%",
    paddingTop: 8,
  },
  receiptModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  receiptModalTitle: {
    color: colors.text.primary,
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  receiptModalSubtitle: {
    color: colors.text.secondary,
    fontSize: 13,
    marginTop: 4,
  },
  receiptModalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#2a2a2a",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptListScroll: {
    flex: 1,
  },
  receiptListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  receiptCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  receiptCardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  receiptCardLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  receiptNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#C9B6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  receiptNumberText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "700",
  },
  receiptCardInfo: {
    flex: 1,
    gap: 4,
  },
  receiptCardId: {
    color: colors.text.primary,
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  receiptCardDate: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  confirmedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(103,209,108,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(103,209,108,0.3)",
  },
  confirmedText: {
    color: "#67D16C",
    fontSize: 11,
    fontWeight: "600",
  },
  receiptNotes: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#131313",
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  receiptNotesText: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
  receiptVehicleInfo: {
    marginBottom: 12,
  },
  receiptVehicleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  receiptVehicleText: {
    color: colors.text.secondary,
    fontSize: 13,
    fontWeight: "500",
  },
  receiptMetrics: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  receiptMetricItem: {
    flex: 1,
    backgroundColor: "#131313",
    padding: 10,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  receiptMetricIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(201,182,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  receiptMetricLabel: {
    color: colors.text.secondary,
    fontSize: 10,
    marginBottom: 2,
  },
  receiptMetricValue: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: "700",
  },
  receiptCardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2a2a2a",
  },
  receiptCardActionText: {
    color: "#C9B6FF",
    fontSize: 12,
    fontWeight: "600",
  },
  // Payment Ready Banner Styles
  paymentReadyBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#1A1D26",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#FFD666",
    shadowColor: "#FFD666",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  paymentReadyContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  paymentReadyLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    flex: 1,
  },
  paymentReadyIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "rgba(255,214,102,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,214,102,0.3)",
  },
  paymentReadyTextContainer: {
    flex: 1,
    gap: 4,
  },
  paymentReadyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: 0.3,
  },
  paymentReadySubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
    lineHeight: 18,
  },
  paymentReadyRight: {
    alignItems: "flex-end",
    gap: 8,
  },
  paymentReadyBadge: {
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
  paymentReadyBadgeText: {
    color: "#67D16C",
    fontSize: 12,
    fontWeight: "700",
  },
  paymentReadyArrow: {
    marginTop: 4,
  },
  paymentReadyFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,214,102,0.2)",
  },
  paymentReadyInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  paymentReadyInfoText: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
  },
  // Additional Fees Button Styles (matching ManualInspectionScreen)
  additionalFeesBtn: {
    flex: 1,
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#FFD666",
    shadowColor: "#FFD666",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    overflow: "hidden",
  },
  additionalFeesBtnContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 18,
  },
  additionalFeesBtnText: {
    color: "#FFD666",
    fontWeight: "700",
    fontSize: 16,
  },
});
