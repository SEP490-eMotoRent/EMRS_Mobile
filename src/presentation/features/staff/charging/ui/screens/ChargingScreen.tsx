import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { useNavigation } from "@react-navigation/native";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { StackNavigationProp } from "@react-navigation/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { GetChargingByLicensePlateUseCase } from "../../../../../../domain/usecases/charging/GetChargingByLicensePlateUseCase";
import sl from "../../../../../../core/di/InjectionContainer";
import Toast from "react-native-toast-message";
import { BookingChargingResponse } from "../../../../../../data/models/charging/BookingChargingResponse";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import { CreateChargingRecordUserCase } from "../../../../../../domain/usecases/charging/CreateChargingRecordUserCase";
import { GetChargingRateResponse } from "../../../../../../data/models/charging/GetChargingRateResponse";
import { GetChargingRateUseCase } from "../../../../../../domain/usecases/charging/GetChargingRateUseCase";

type ChargingScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "Charging"
>;

export const ChargingScreen: React.FC = () => {
  const navigation = useNavigation<ChargingScreenNavigationProp>();
  const [manualPlate, setManualPlate] = useState<string>("");
  const [startBatteryPercentage, setStartBatteryPercentage] =
    useState<string>("");
  const [endBatteryPercentage, setEndBatteryPercentage] = useState<string>("");
  const [kwhCharged, setKwhCharged] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [loadingRate, setLoadingRate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [chargingData, setChargingData] =
    useState<BookingChargingResponse | null>(null);
  const [autoCalculateKwh, setAutoCalculateKwh] = useState<boolean>(true);
  const [chargingRate, setChargingRate] =
    useState<GetChargingRateResponse | null>(null);

  useEffect(() => {
    handleGetChargingRate();
  }, []);

  
  // Auto-calculate kWh when start and end battery are entered
  useEffect(() => {
    if (!autoCalculateKwh || !startBatteryPercentage || !endBatteryPercentage) {
      return;
    }

    const startBattery = parseFloat(startBatteryPercentage);
    const endBattery = parseFloat(endBatteryPercentage);

    if (
      isNaN(startBattery) ||
      isNaN(endBattery) ||
      endBattery <= startBattery
    ) {
      setKwhCharged("");
      return;
    }

    // Calculate kWh based on battery percentage difference
    // Assuming a standard battery capacity (this might need adjustment based on vehicle model)
    // For example, if 100% = 5 kWh, then 1% = 0.05 kWh
    const batteryCapacityKwh = 5; // This should ideally come from vehicle model
    const batteryDifference = endBattery - startBattery;
    const calculatedKwh = (batteryDifference / 100) * batteryCapacityKwh;
    const roundedKwh = Math.round(calculatedKwh * 100) / 100;

    if (roundedKwh > 0) {
      setKwhCharged(roundedKwh.toString());
    } else {
      setKwhCharged("");
    }
  }, [startBatteryPercentage, endBatteryPercentage, autoCalculateKwh]);

  const handleSearchVehicle = async () => {
    if (!manualPlate.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập biển số xe",
      });
      return;
    }

    try {
      setLoading(true);
      const getChargingByLicensePlateUseCase =
        new GetChargingByLicensePlateUseCase(sl.get("ChargingRepository"));
      const response = await getChargingByLicensePlateUseCase.execute(
        manualPlate.trim()
      );
      if (response.success) {
        const data: BookingChargingResponse = unwrapResponse(response);
        setChargingData(data);
        // Reset form fields when new vehicle is found
        setStartBatteryPercentage("");
        setEndBatteryPercentage("");
        setKwhCharged("");
        setNotes("");
        setAutoCalculateKwh(true);
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đã tìm thấy thông tin xe",
        });
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: `Không tìm thấy xe có biển số ${manualPlate}`,
      });
      setChargingData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGetChargingRate = async () => {
    try {
      setLoadingRate(true);
      const getChargingRateUseCase = new GetChargingRateUseCase(
        sl.get("ChargingRepository")
      );
      const response = await getChargingRateUseCase.execute({
        chargingDate: new Date().toISOString(),
      });
      if (response.success) {
        const data: GetChargingRateResponse = unwrapResponse(response);
        setChargingRate(data);
      }
    } catch (error: any) {
      // Don't show error toast for charging rate, just log it
      console.warn("Failed to get charging rate:", error);
      setChargingRate(null);
    } finally {
      setLoadingRate(false);
    }
  };

  const calculateEstimatedFee = () => {
    if (!chargingRate || !kwhCharged) return 0;
    const kwh = parseFloat(kwhCharged);
    if (isNaN(kwh) || kwh <= 0) return 0;
    return Math.round(chargingRate.ratePerKwh * kwh);
  };

  const getTimeSlotColor = (timeSlot: string) => {
    const slot = timeSlot?.toLowerCase() || "";
    if (slot.includes("peak")) return "#FF6B6B";
    if (slot.includes("off")) return "#4ECDC4";
    return "#C9B6FF";
  };

  const getTimeSlotLabel = (timeSlot: string) => {
    const slot = timeSlot?.toLowerCase() || "";
    if (slot.includes("peak")) return "Giờ cao điểm";
    if (slot.includes("off")) return "Giờ thấp điểm";
    return timeSlot || "N/A";
  };

  const calculateKwhCharged = () => {
    if (!startBatteryPercentage || !endBatteryPercentage) return 0;

    const startBattery = parseFloat(startBatteryPercentage);
    const endBattery = parseFloat(endBatteryPercentage);

    if (isNaN(startBattery) || isNaN(endBattery) || endBattery <= startBattery)
      return 0;

    // Calculate kWh based on battery percentage difference
    const batteryCapacityKwh = 5; // This should ideally come from vehicle model
    const batteryDifference = endBattery - startBattery;
    const calculatedKwh = (batteryDifference / 100) * batteryCapacityKwh;

    return Math.round(calculatedKwh * 100) / 100;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatVnd = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
  };

  const handleCreateChargingRecord = async () => {
    // Validation
    if (!chargingData) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng tìm kiếm xe trước",
      });
      return;
    }

    if (!startBatteryPercentage || !endBatteryPercentage || !kwhCharged) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    const startBattery = parseFloat(startBatteryPercentage);
    const endBattery = parseFloat(endBatteryPercentage);
    const kwh = parseFloat(kwhCharged);

    if (isNaN(startBattery) || startBattery < 0 || startBattery > 100) {
      Alert.alert("Lỗi", "Mức pin bắt đầu phải từ 0-100%");
      return;
    }

    if (isNaN(endBattery) || endBattery < 0 || endBattery > 100) {
      Alert.alert("Lỗi", "Mức pin kết thúc phải từ 0-100%");
      return;
    }

    if (endBattery <= startBattery) {
      Alert.alert("Lỗi", "Mức pin kết thúc phải lớn hơn mức pin bắt đầu");
      return;
    }

    if (isNaN(kwh) || kwh <= 0) {
      Alert.alert("Lỗi", "Số kWh sạc phải lớn hơn 0");
      return;
    }

    // Show confirmation dialog
    Alert.alert(
      "Xác nhận tạo bản ghi sạc",
      `Xe: ${
        chargingData.licensePlate
      }\nPin bắt đầu: ${startBatteryPercentage}%\nPin kết thúc: ${endBatteryPercentage}%\nkWh sạc: ${kwhCharged} kWh\nGhi chú: ${
        notes || "Không có"
      }`,
      [
        {
          text: "Hủy",
          style: "cancel",
        },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              setCreating(true);
              const createChargingRecordUseCase =
                new CreateChargingRecordUserCase(sl.get("ChargingRepository"));
              const response = await createChargingRecordUseCase.execute({
                bookingId: chargingData.bookingId,
                chargingDate: new Date().toISOString(),
                startBatteryPercentage: startBattery,
                endBatteryPercentage: endBattery,
                kwhCharged: kwh,
                notes: notes || "",
              });
              if (response.success) {
                Toast.show({
                  type: "success",
                  text1: "Thành công",
                  text2: "Đã tạo bản ghi sạc thành công",
                });
              } else {
                Toast.show({
                  type: "error",
                  text1: "Lỗi",
                  text2: response.message || "Không thể tạo bản ghi sạc",
                });
              }

              // Reset form
              setStartBatteryPercentage("");
              setEndBatteryPercentage("");
              setKwhCharged("");
              setNotes("");
            } catch (error: any) {
              Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: error.message || "Không thể tạo bản ghi sạc",
              });
            } finally {
              setCreating(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Sạc xe điện"
          subtitle="Quản lý phiên sạc"
          showBackButton={false}
        />

        {/* Vehicle Search */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Tìm kiếm xe</Text>

          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Nhập biển số xe:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.textInput}
                placeholder="VD: 59K1-33345"
                value={manualPlate}
                onChangeText={setManualPlate}
                placeholderTextColor={colors.text.secondary}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={[
                  styles.inputButton,
                  loading && styles.inputButtonDisabled,
                ]}
                onPress={handleSearchVehicle}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#000" />
                ) : (
                  <FontAwesome name="search" size={20} color="#000" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Booking Information */}
        {chargingData && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Thông tin đặt xe</Text>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Mã đặt xe</Text>
                <Text style={styles.infoValue}>{chargingData.bookingCode}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Trạng thái</Text>
                <View
                  style={[
                    styles.statusBadge,
                    chargingData.bookingStatus === "Renting" &&
                      styles.statusBadgeActive,
                  ]}
                >
                  <Text style={styles.statusBadgeText}>
                    {chargingData.bookingStatus === "Renting"
                      ? "Đang thuê"
                      : chargingData.bookingStatus}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Khách hàng</Text>
                <Text style={styles.infoValue}>
                  {chargingData.renterFullName}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Chi nhánh</Text>
                <Text style={styles.infoValueSmall}>
                  {chargingData.branchAddress}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Vehicle Information */}
        {chargingData && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Thông tin xe</Text>

            <View style={styles.vehicleInfoRow}>
              <View style={styles.vehicleIconContainer}>
                <AntDesign name="car" size={24} color="#C9B6FF" />
              </View>
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleModel}>
                  {chargingData.vehicleModelName}
                </Text>
                <Text style={styles.vehiclePlate}>
                  {chargingData.licensePlate}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.batteryInfoRow}>
              <View style={styles.batteryIconContainer}>
                <AntDesign name="thunderbolt" size={20} color="#22C55E" />
              </View>
              <View style={styles.batteryDetails}>
                <Text style={styles.batteryLabel}>Pin khi bàn giao</Text>
                <Text style={styles.batteryValue}>
                  {chargingData.batteryAtHandover}%
                </Text>
              </View>
            </View>

            {chargingData.lastChargingDate && (
              <View style={styles.lastChargingRow}>
                <AntDesign
                  name="clock-circle"
                  size={14}
                  color={colors.text.secondary}
                />
                <Text style={styles.lastChargingText}>
                  Lần sạc cuối: {formatDate(chargingData.lastChargingDate)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Charging Rate Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.cardHeaderLeft}>
              <AntDesign name="line-chart" size={18} color="#C9B6FF" />
              <Text style={styles.rateCardHeader}>Tỷ giá sạc hiện tại</Text>
            </View>
            <View style={styles.cardHeaderRight}>
              {loadingRate ? (
                <ActivityIndicator size="small" color="#C9B6FF" />
              ) : (
                <TouchableOpacity
                  style={styles.refreshButton}
                  onPress={handleGetChargingRate}
                  disabled={loadingRate}
                >
                  <AntDesign name="reload" size={16} color="#C9B6FF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {chargingRate ? (
            <>
              <View style={styles.rateMainInfo}>
                <View style={styles.rateValueContainer}>
                  <Text style={styles.rateValue}>
                    {formatVnd(chargingRate.ratePerKwh)}
                  </Text>
                  <Text style={styles.rateUnit}>/kWh</Text>
                </View>
                <View
                  style={[
                    styles.timeSlotBadge,
                    {
                      backgroundColor:
                        getTimeSlotColor(chargingRate.timeSlot) + "20",
                      borderColor: getTimeSlotColor(chargingRate.timeSlot),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.timeSlotBadgeText,
                      {
                        color: getTimeSlotColor(chargingRate.timeSlot),
                      },
                    ]}
                  >
                    {getTimeSlotLabel(chargingRate.timeSlot)}
                  </Text>
                </View>
              </View>

              {chargingRate.description && (
                <View style={styles.rateDescriptionContainer}>
                  <AntDesign
                    name="info-circle"
                    size={14}
                    color={colors.text.secondary}
                  />
                  <Text style={styles.rateDescription}>
                    {chargingRate.description}
                  </Text>
                </View>
              )}
            </>
          ) : (
            !loadingRate && (
              <View style={styles.rateUnavailableContainer}>
                <AntDesign
                  name="exclamation-circle"
                  size={20}
                  color={colors.text.secondary}
                />
                <Text style={styles.rateUnavailableText}>
                  Không thể tải tỷ giá sạc
                </Text>
              </View>
            )
          )}
        </View>

        {/* Charging Record Form */}
        {chargingData && (
          <View style={styles.card}>
            <Text style={styles.cardHeader}>Thông tin sạc</Text>

            {/* Helper info */}
            <View style={styles.infoBanner}>
              <AntDesign name="info-circle" size={14} color="#C9B6FF" />
              <Text style={styles.infoBannerText}>
                Pin khi bàn giao: {chargingData.batteryAtHandover}% (chỉ để tham
                khảo)
              </Text>
            </View>

            {/* Start Battery Percentage */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <AntDesign name="thunderbolt" size={16} color="#FF6B6B" />
                <Text style={styles.inputLabel}>Mức pin bắt đầu *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="VD: 30"
                value={startBatteryPercentage}
                onChangeText={setStartBatteryPercentage}
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
                maxLength={3}
              />
              <Text style={styles.inputHelper}>
                Mức pin của xe khi bắt đầu sạc (0-100%)
              </Text>
            </View>

            {/* End Battery Percentage */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <AntDesign name="thunderbolt" size={16} color="#22C55E" />
                <Text style={styles.inputLabel}>Mức pin kết thúc *</Text>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="VD: 85"
                value={endBatteryPercentage}
                onChangeText={setEndBatteryPercentage}
                keyboardType="numeric"
                placeholderTextColor={colors.text.secondary}
                maxLength={3}
              />
              <Text style={styles.inputHelper}>
                Mức pin của xe sau khi sạc xong (0-100%)
              </Text>
            </View>

            {/* kWh Charged */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <AntDesign name="poweroff" size={16} color="#C9B6FF" />
                <Text style={styles.inputLabel}>Số kWh sạc *</Text>
                <TouchableOpacity
                  style={styles.toggleButton}
                  onPress={() => setAutoCalculateKwh(!autoCalculateKwh)}
                >
                  <AntDesign
                    name={autoCalculateKwh ? "check-circle" : "close-circle"}
                    size={14}
                    color={autoCalculateKwh ? "#22C55E" : colors.text.secondary}
                  />
                  <Text style={styles.toggleButtonText}>
                    {autoCalculateKwh ? "Tự động" : "Thủ công"}
                  </Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.textInput}
                placeholder="VD: 2.5"
                value={kwhCharged}
                onChangeText={(text) => {
                  setKwhCharged(text);
                  setAutoCalculateKwh(false);
                }}
                keyboardType="decimal-pad"
                placeholderTextColor={colors.text.secondary}
                editable={
                  !autoCalculateKwh ||
                  !startBatteryPercentage ||
                  !endBatteryPercentage
                }
              />
              {autoCalculateKwh &&
                startBatteryPercentage &&
                endBatteryPercentage && (
                  <Text style={styles.inputHelper}>
                    Đã tự động tính: {calculateKwhCharged()} kWh (dựa trên chênh
                    lệch pin)
                  </Text>
                )}
            </View>

            {/* Notes */}
            <View style={styles.inputGroup}>
              <View style={styles.inputLabelRow}>
                <AntDesign
                  name="file-text"
                  size={16}
                  color={colors.text.secondary}
                />
                <Text style={styles.inputLabel}>Ghi chú (tùy chọn)</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="Nhập ghi chú về quá trình sạc..."
                value={notes}
                onChangeText={setNotes}
                placeholderTextColor={colors.text.secondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Charging Date Info */}
            <View style={styles.dateInfoRow}>
              <AntDesign
                name="calendar"
                size={14}
                color={colors.text.secondary}
              />
              <Text style={styles.dateInfoText}>
                Thời gian sạc: {new Date().toLocaleString("vi-VN")}
              </Text>
            </View>

            {kwhCharged && parseFloat(kwhCharged) > 0 && chargingRate && (
              <View style={styles.estimatedFeeContainer}>
                <View style={styles.divider} />
                <View style={styles.estimatedFeeRow}>
                  <View style={styles.estimatedFeeLeft}>
                    <Text style={styles.estimatedFeeLabel}>Phí ước tính:</Text>
                    <Text style={styles.estimatedFeeDetails}>
                      {kwhCharged} kWh × {formatVnd(chargingRate.ratePerKwh)}
                    </Text>
                  </View>
                  <Text style={styles.estimatedFeeValue}>
                    {formatVnd(calculateEstimatedFee())}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Create Charging Record Button */}
        {chargingData &&
          startBatteryPercentage &&
          endBatteryPercentage &&
          kwhCharged && (
            <TouchableOpacity
              style={[
                styles.createButton,
                creating && styles.createButtonDisabled,
              ]}
              onPress={handleCreateChargingRecord}
              disabled={creating}
            >
              {creating ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <AntDesign name="plus-circle" size={20} color="#000" />
              )}
              <Text style={styles.createButtonText}>
                {creating ? "Đang tạo..." : "Tạo bản ghi sạc"}
              </Text>
            </TouchableOpacity>
          )}
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
  card: {
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    marginHorizontal: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#2E2E2E",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#C9B6FF",
  },
  cardHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  cardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 4,
  },
  rateCardHeader: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
  },
  rateMainInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  rateValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    flex: 1,
  },
  rateValue: {
    color: "#C9B6FF",
    fontSize: 28,
    fontWeight: "800",
  },
  rateUnit: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  timeSlotBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    alignSelf: "flex-start",
  },
  timeSlotBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  rateDescriptionContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#2A2A2A",
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  rateDescription: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  estimatedFeeContainer: {
    marginTop: 8,
  },
  estimatedFeeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
  },
  estimatedFeeLeft: {
    flex: 1,
  },
  estimatedFeeLabel: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  estimatedFeeDetails: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  estimatedFeeValue: {
    color: "#22C55E",
    fontSize: 20,
    fontWeight: "800",
  },
  rateUnavailableContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 12,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    justifyContent: "center",
  },
  rateUnavailableText: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  inputSection: {
    marginTop: 4,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  inputLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    fontWeight: "500",
    flex: 1,
  },
  inputHelper: {
    color: colors.text.secondary,
    fontSize: 11,
    marginTop: 4,
    fontStyle: "italic",
  },
  inputRow: {
    flexDirection: "row",
    gap: 8,
  },
  textInput: {
    flex: 1,
    backgroundColor: "#2A2A2A",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  inputButton: {
    backgroundColor: "#C9B6FF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 50,
  },
  inputButtonDisabled: {
    opacity: 0.6,
  },
  infoRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 4,
  },
  infoValue: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  infoValueSmall: {
    color: colors.text.primary,
    fontSize: 12,
    fontWeight: "500",
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: "#2A2A2A",
    marginVertical: 12,
  },
  statusBadge: {
    backgroundColor: "#2A2A2A",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  statusBadgeActive: {
    backgroundColor: "#052e1a",
    borderWidth: 1,
    borderColor: "#22C55E",
  },
  statusBadgeText: {
    color: "#22C55E",
    fontSize: 11,
    fontWeight: "700",
  },
  vehicleInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  vehicleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2A1E3A",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleModel: {
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  vehiclePlate: {
    color: "#C9B6FF",
    fontSize: 14,
    fontWeight: "600",
  },
  batteryInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  batteryIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#052e1a",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  batteryDetails: {
    flex: 1,
  },
  batteryLabel: {
    color: colors.text.secondary,
    fontSize: 12,
    marginBottom: 2,
  },
  batteryValue: {
    color: "#22C55E",
    fontSize: 18,
    fontWeight: "700",
  },
  lastChargingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  lastChargingText: {
    color: colors.text.secondary,
    fontSize: 11,
  },
  infoBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2A1E3A",
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#3A2A4A",
  },
  infoBannerText: {
    color: colors.text.secondary,
    fontSize: 12,
    flex: 1,
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  toggleButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: "#2A2A2A",
    borderWidth: 1,
    borderColor: "#3A3A3A",
  },
  toggleButtonText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontWeight: "600",
  },
  dateInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#2A2A2A",
  },
  dateInfoText: {
    color: colors.text.secondary,
    fontSize: 11,
    fontStyle: "italic",
  },
  createButton: {
    backgroundColor: "#C9B6FF",
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    marginTop: 8,
    marginBottom: 24,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: "#000",
    fontWeight: "800",
    fontSize: 16,
  },
});
