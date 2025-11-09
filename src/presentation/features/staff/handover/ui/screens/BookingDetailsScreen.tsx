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
  Image,
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
import { Linking } from "react-native";
// import Pdf from "react-native-pdf";
import { WebView } from "react-native-webview";
import { VehicleModel } from "../../../../../../domain/entities/vehicle/VehicleModel";
import { GetAllVehicleModelsUseCase } from "../../../../../../domain/usecases/vehicle/GetAllVehicleModelsUseCase ";
import { useSelector } from "react-redux";
import { RootState } from "../../../../authentication/store";
import { RentalReceipt } from "../../../../../../domain/entities/booking/RentalReceipt";
import { GenerateContractUseCase } from "../../../../../../domain/usecases/contract/GenerateContractUseCase";
import { GetReceiptDetailsUseCase } from "../../../../../../domain/usecases/receipt/GetReceiptDetails";
import { useFocusEffect } from "@react-navigation/native";
import { RentalReturnSummaryUseCase } from "../../../../../../domain/usecases/rentalReturn/SummaryReceiptUseCase";
import { SummaryResponse } from "../../../../../../data/models/rentalReturn/SummaryResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";

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
  const [rentalReceipt, setRentalReceipt] = useState<RentalReceipt | null>(
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
  const [showReceipt, setShowReceipt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  // useEffect(() => {
  //   fetchBooking();
  //   fetchVehicleModels();
  //   fetchRentalReceipt();
  // }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      fetchBooking();
      fetchVehicleModels();
      fetchRentalReceipt();
      fetchSummary();
    }, [])
  );

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
      const getReceiptDetailsUseCase = new GetReceiptDetailsUseCase(
        sl.get("ReceiptRepository")
      );
      const rentalReceipt = await getReceiptDetailsUseCase.execute(bookingId);
      setRentalReceipt(rentalReceipt.data);
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
        rentalReceipt?.id
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
    }
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
  const hasRentalReceipt = !!rentalReceipt;
  const contractInfo = useMemo(
    () => ({
      number: contract?.contractNumber || "(chưa cấp)",
      status: contract?.contractStatus || "-",
      url: contract?.contractPdfUrl || "",
    }),
    [contract]
  );

  const canSignContract =
    user?.id &&
    booking?.renter?.id === user.id &&
    contract?.contractStatus === "Unsigned";

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

  const openReturnReport = () => {
    if (!booking) return;
    const zero = 0;
    navigation.navigate("ReturnReport", {
      bookingId,
      rentalReceiptId: rentalReceipt?.id || "",
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

  return (
    <SafeAreaView style={styles.container}>
      {/* Global loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#C9B6FF" />
          <Text style={styles.loadingOverlayText}>Loading booking...</Text>
        </View>
      )}
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
              <Text style={styles.bullet}>•</Text>
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
                booking?.bookingStatus === "Booked" && styles.statusPillBooked,
                booking?.bookingStatus === "Available" &&
                  styles.statusPillAvailable,
                booking?.bookingStatus === "Unavailable" &&
                  styles.statusPillUnavailable,
              ]}
            >
              <AntDesign
                name={
                  booking?.bookingStatus === "Booked"
                    ? "calendar"
                    : booking?.bookingStatus === "Available"
                    ? "check-circle"
                    : "exclamation-circle"
                }
                size={12}
                color="#000"
              />
              <Text style={styles.statusPillText}>
                {booking?.bookingStatus || "-"}
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
                <AntDesign name="environment" size={14} color="#FFD666" />
                <Text style={styles.iconLabel}>Địa điểm thuê</Text>
              </View>
              <Text style={styles.iconValue}>
                Xx Street, Ward 2, Tan Binh District
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
                {booking?.startDatetime?.toLocaleDateString("en-GB") || "-"}
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
                {booking?.endDatetime?.toLocaleDateString("en-GB") || "-"}
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

        {/* Insurance Information */}
        <View style={styles.section}>
          <SectionHeader title="Thông tin Bảo hiểm" icon="safety-certificate" />
          <InfoCard>
            <InfoItem label="Gói bảo hiểm:" value="Premium" />
            <InfoItem label="Mức bồi thường:" value="50,000,000 VND" />
          </InfoCard>
        </View>

        {/* Return Summary */}
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
            {summary?.feesBreakdown?.excessKmFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí quãng đường</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.excessKmFee || 0)}
                </Text>
              </View>
            )}
            {summary?.totalChargingFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí sạc pin</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.totalChargingFee || 0)}
                </Text>
              </View>
            )}
            {summary?.feesBreakdown?.damageFee !== 0 && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryKey}>Phí hư hỏng</Text>
                <Text style={styles.summaryVal}>
                  {formatVnd(summary?.feesBreakdown.damageFee || 0)}
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

        {hasRentalReceipt && (
          <View style={styles.section}>
            <SectionHeader title="Biên bản bàn giao" icon="file-text" />
            <InfoCard>
              <TouchableOpacity
                style={[styles.actionBtn, styles.receiptBtn]}
                onPress={() => setShowReceipt(true)}
              >
                <AntDesign name="file" size={16} color="#000" />
                <Text style={styles.actionBtnText}>Xem biên bản bàn giao</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.returnReportBtn]}
                onPress={openReturnReport}
              >
                <AntDesign name="file-text" size={18} color="#000" />
                <Text style={styles.returnReportBtnText}>
                  Xem biên bản trả xe
                </Text>
              </TouchableOpacity>
            </InfoCard>
          </View>
        )}

        {/* Contract Section (only when available) */}
        {hasContract && (
          <View style={styles.section}>
            <SectionHeader title="Hợp đồng thuê" icon="file-text" />
            <InfoCard style={styles.contractCard}>
              <InfoItem label="Số hợp đồng:" value={contractInfo.number} />
              <InfoItem label="Trạng thái:" value={contractInfo.status} />
              {/* Sign contract CTA if eligible */}
              {canSignContract && (
                <TouchableOpacity
                  style={styles.signContractBtn}
                  onPress={() =>
                    navigation.navigate("SignContract", {
                      bookingId,
                      email: booking?.renter?.email,
                      fullName: booking?.renter?.account?.fullname,
                      receiptId: rentalReceipt?.id,
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
                  <Text style={styles.contractBtnText}>Xem trong ứng dụng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contractBtn, styles.contractBtnSecondary]}
                  onPress={() => {
                    setViewer("webview");
                    setShowContract(true);
                  }}
                >
                  <AntDesign name="export" size={16} color="#000" />
                  <Text style={styles.contractBtnText}>Mở bằng WebView</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.contractNote}>
                Bạn có thể xem hợp đồng trong ứng dụng hoặc mở bằng trình duyệt
              </Text>
            </InfoCard>
          </View>
        )}

        {/* Total Cost */}
        <View style={styles.section}>
          <SectionHeader title="Tổng chi phí" icon="wallet" />
          <InfoCard>
            <InfoItem label="Thuê xe VinFast Evo200:" value="450,000 VND" />
            <InfoItem label="Bảo hiểm Premium:" value="50,000 VND" />
            <InfoItem label="Phí dịch vụ:" value="25,000 VND" />
          </InfoCard>
        </View>

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
              <TouchableOpacity
                style={[styles.actionBtn, styles.changeBtn]}
                onPress={() => {
                  navigation.navigate("SelectVehicle", {
                    bookingId: bookingId,
                    renterName: booking?.renter?.fullName?.() ?? "",
                    vehicleModel: booking?.vehicleModel,
                  });
                }}
              >
                <AntDesign name="swap" size={16} color="#000" />
                <Text style={styles.actionBtnText}>Change Vehicle</Text>
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
      </ScrollView>

      {/* Rental Receipt Modal */}
      <RNModal
        visible={showReceipt}
        transparent
        animationType="fade"
        onRequestClose={() => setShowReceipt(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderDark}>
              <Text style={styles.modalTitleDark}>Biên bản bàn giao</Text>
              <TouchableOpacity onPress={() => setShowReceipt(false)}>
                <AntDesign name="close" size={18} color={colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              <InfoCard>
                <View style={[styles.infoItem]}>
                  <Text style={styles.infoLabel}>Ghi chú:</Text>
                  <Text style={styles.infoValue}>
                    {rentalReceipt?.notes || "-"}
                  </Text>
                </View>
                <View style={[styles.infoItem]}>
                  <Text style={styles.infoLabel}>Số km bắt đầu:</Text>
                  <Text style={styles.infoValue}>
                    {rentalReceipt?.startOdometerKm} km
                  </Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Pin bắt đầu:</Text>
                  <Text style={styles.infoValue}>
                    {rentalReceipt?.startBatteryPercentage}%
                  </Text>
                </View>
              </InfoCard>

              {/* Vehicle photos grid */}
              {!!rentalReceipt?.handOverVehicleImageFiles?.length && (
                <View style={styles.section}>
                  <SectionHeader title="Ảnh xe bàn giao" icon="picture" />
                  <View style={styles.photoGrid}>
                    {rentalReceipt?.handOverVehicleImageFiles.map(
                      (uri: string, idx: number) => (
                        <View key={idx} style={styles.photoItem}>
                          <Image
                            source={{ uri }}
                            style={styles.photoImage}
                            resizeMode="cover"
                          />
                        </View>
                      )
                    )}
                  </View>
                </View>
              )}

              {!!rentalReceipt?.checkListFile && (
                <View style={styles.section}>
                  <SectionHeader title="Checklist" icon="profile" />
                  <View style={styles.checklistWrapImg}>
                    <Image
                      source={{
                        uri: rentalReceipt?.checkListFile as string,
                      }}
                      style={styles.checklistImg}
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </RNModal>

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
                // <Pdf
                //   trustAllCerts={false}
                //   source={{ uri: contractInfo.url, cache: true }}
                //   onLoadProgress={() => setWebviewLoading(true)}
                //   onLoadComplete={() => setWebviewLoading(false)}
                //   onError={() => setWebviewLoading(false)}
                //   style={styles.webview}
                // />
                <Text>PDF</Text>
              ) : (
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
    backgroundColor: "#EDEDED",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  statusPillBooked: { backgroundColor: "#FFD666" },
  statusPillAvailable: { backgroundColor: "#67D16C" },
  statusPillUnavailable: { backgroundColor: "#FF8A80" },
  statusPillText: { color: "#000", fontWeight: "700", fontSize: 12 },
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
  receiptBtn: { backgroundColor: "#C9B6FF", marginHorizontal: 16 },
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
    marginHorizontal: 16,
    marginTop: 10,
  },
  returnReportBtnText: {
    color: "#000",
    fontWeight: "700",
    letterSpacing: 0.5,
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
  photoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 0,
  },
  photoItem: {
    width: "48%",
    aspectRatio: 1,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#0F0A18",
    borderWidth: 1,
    borderColor: "#2A2A2A",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  photoImage: { width: "100%", height: "100%" },
  checklistWrapImg: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#0F0A18",
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  checklistContent: { alignItems: "center", justifyContent: "center" },
  checklistImg: {
    width: "100%",
    height: 1300,
    resizeMode: "cover",
    borderRadius: 8,
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
});
