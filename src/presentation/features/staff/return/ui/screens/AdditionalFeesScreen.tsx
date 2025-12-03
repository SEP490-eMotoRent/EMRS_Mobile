import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator,
  Modal,
  Animated,
} from "react-native";
import { colors } from "../../../../../common/theme/colors";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { StaffStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { ScreenHeader } from "../../../../../common/components/organisms/ScreenHeader";
import { StepProgressBar } from "../atoms";
import { SafeAreaView } from "react-native-safe-area-context";
import sl from "../../../../../../core/di/InjectionContainer";
import { unwrapResponse } from "../../../../../../core/network/APIResponse";
import Toast from "react-native-toast-message";
import { DamageType } from "../../../../../../data/models/additionalFee/DamageTypesResponse";
import { GetDamageTypesUseCase } from "../../../../../../domain/usecases/additionalFee/GetDamageTypesUseCase";
import { AddDamageFeeUseCase } from "../../../../../../domain/usecases/additionalFee/AddDamageFeeUseCase";
import { AddCleaningFeeUseCase } from "../../../../../../domain/usecases/additionalFee/AddCleaningFeeUseCase";
import { AddLateReturnFeeUseCase } from "../../../../../../domain/usecases/additionalFee/AddLateReturnFeeUseCase";
import { AddCrossBranchUseCase } from "../../../../../../domain/usecases/additionalFee/AddCrossBranchUseCase";
import { AddExcessKmFeeUseCase } from "../../../../../../domain/usecases/additionalFee/AddExcessKmFeeUseCase";
import { Booking } from "../../../../../../domain/entities/booking/Booking";
import { GetBookingByIdUseCase } from "../../../../../../domain/usecases/booking/GetBookingByIdUseCase";
import { GetAdditionalPricingConfigUseCase } from "../../../../../../domain/usecases/configuration/GetAdditionalPricingConfigUseCase";
import { Configuration } from "../../../../../../domain/entities/configuration/Configuration";

type AdditionalFeesScreenNavigationProp = StackNavigationProp<
  StaffStackParamList,
  "AdditionalFees"
>;

type AdditionalFeesScreenRouteProp = RouteProp<
  StaffStackParamList,
  "AdditionalFees"
>;

interface AdditionalFeesBreakdown {
  feeType: string;
  amount: number;
  description: string;
}

interface DamageFee {
  damageType: string;
  amount: number;
  additionalNotes: string;
}

export const AdditionalFeesScreen: React.FC = () => {
  const navigation = useNavigation<AdditionalFeesScreenNavigationProp>();
  const route = useRoute<AdditionalFeesScreenRouteProp>();
  const { bookingId } = route.params || {};
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customFees, setCustomFees] = useState<AdditionalFeesBreakdown[]>([]);
  const [damageFees, setDamageFees] = useState<DamageFee[]>([]);
  const [Booking, setBooking] = useState<Booking>(null);
  const [openTypeIdx, setOpenTypeIdx] = useState<number | null>(null);
  const [openDamageIdx, setOpenDamageIdx] = useState<number | null>(null);
  const [damageTypeOptions, setDamageTypeOptions] = useState<DamageType[]>([]);
  const [expandedDamageCards, setExpandedDamageCards] = useState<Set<number>>(
    new Set()
  );
  const [expandedCustomCards, setExpandedCustomCards] = useState<Set<number>>(
    new Set()
  );
  const [damageAmountErrors, setDamageAmountErrors] = useState<
    Record<number, string>
  >({});
  const [additionalPricingConfig, setAdditionalPricingConfig] = useState<
    Configuration[]
  >([]);
  const shakeAnimations = useRef<Map<number, Animated.Value>>(new Map());

  /**
   * Helpers đọc giá trị cấu hình từ API (Configuration)
   * Dựa trên field type (18 - 27) và value trả về
   */
  const getConfigNumericValue = (
    type: number,
    defaultValue: number
  ): number => {
    if (!additionalPricingConfig || additionalPricingConfig.length === 0) {
      return defaultValue;
    }

    const found = additionalPricingConfig.find(
      (cfg) => !cfg.isDeleted && cfg.type === type
    );

    return found ? found.getNumericValue() : defaultValue;
  };

  // Giá giờ cho phí trả xe trễ (type = 18)
  const getLateReturnHourlyRate = () =>
    getConfigNumericValue(
      18,
      30000 // fallback nếu chưa có cấu hình
    );

  // Phí vệ sinh cố định (type = 19)
  const getCleaningFeeAmount = () =>
    getConfigNumericValue(
      19,
      50000 // fallback nếu chưa có cấu hình
    );

  // Phí trả khác chi nhánh cố định (type = 21)
  const getCrossBranchFeeAmount = () =>
    getConfigNumericValue(
      21,
      200000 // fallback nếu chưa có cấu hình
    );

  // Get excess km configuration based on vehicle category
  const getExcessKmConfig = () => {
    const rawCategory =
      Booking?.vehicle?.vehicleModel?.category ||
      Booking?.vehicleModel?.category ||
      "STANDARD";

    const category = (rawCategory || "STANDARD").toUpperCase() as
      | "ECONOMY"
      | "STANDARD"
      | "PREMIUM";

    // Map category -> type cấu hình cho giá/km và giới hạn km/ngày
    const categoryTypeMap: Record<
      "ECONOMY" | "STANDARD" | "PREMIUM",
      {
        priceType: number;
        limitType: number;
        defaultPrice: number;
        defaultLimit: number;
      }
    > = {
      ECONOMY: {
        priceType: 22,
        limitType: 25,
        defaultPrice: 2500,
        defaultLimit: 70,
      },
      STANDARD: {
        priceType: 23,
        limitType: 26,
        defaultPrice: 3500,
        defaultLimit: 100,
      },
      PREMIUM: {
        priceType: 24,
        limitType: 27,
        defaultPrice: 4500,
        defaultLimit: 150,
      },
    };

    const mapEntry = categoryTypeMap[category] ?? categoryTypeMap["STANDARD"];

    const pricePerKm = getConfigNumericValue(
      mapEntry.priceType,
      mapEntry.defaultPrice
    );

    const dailyLimit = getConfigNumericValue(
      mapEntry.limitType,
      mapEntry.defaultLimit
    );

    return { dailyLimit, pricePerKm };
  };

  // Calculate excess km fee
  const calculateExcessKmFee = (): {
    excessKm: number;
    fee: number;
    details: string;
  } => {
    if (!Booking) {
      return { excessKm: 0, fee: 0, details: "" };
    }

    const receipts = Booking.rentalReceipts || [];
    const receipt = receipts.length > 0 ? receipts[receipts.length - 1] : null;
    if (!receipt || !receipt.startOdometerKm || !receipt.endOdometerKm) {
      return { excessKm: 0, fee: 0, details: "" };
    }

    const totalKm = receipt.endOdometerKm - receipt.startOdometerKm;

    if (!Booking.startDatetime || !Booking.endDatetime) {
      return { excessKm: 0, fee: 0, details: "" };
    }

    const startTime = new Date(Booking.startDatetime).getTime();
    const endTime = new Date(Booking.endDatetime).getTime();
    const rentalDays = Math.ceil((endTime - startTime) / (1000 * 60 * 60 * 24));

    const config = getExcessKmConfig();
    const freeKmLimit = rentalDays * config.dailyLimit;
    const excessKm = Math.max(0, totalKm - freeKmLimit);
    const fee = excessKm * config.pricePerKm;
    const details = `Đi ${totalKm} km / ${freeKmLimit} km miễn phí (${rentalDays} ngày × ${config.dailyLimit} km/ngày)`;

    return { excessKm, fee, details };
  };

  useEffect(() => {
    const fetchData = async () => {
      const getAdditionalPricingConfigUseCase =
        new GetAdditionalPricingConfigUseCase(
          sl.get("ConfigurationRepository")
        );
      const getDamageTypesUseCase = new GetDamageTypesUseCase(
        sl.get("AdditionalFeeRepository")
      );
      const getBookingUseCase = new GetBookingByIdUseCase(
        sl.get("BookingRepository")
      );

      try {
        const [additionalPricingConfig, damageTypes, booking] =
          await Promise.all([
            getAdditionalPricingConfigUseCase.execute(),
            getDamageTypesUseCase.execute(),
            getBookingUseCase.execute(bookingId),
          ]);

        setAdditionalPricingConfig(additionalPricingConfig);
        setDamageTypeOptions(damageTypes);
        setBooking(booking);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (bookingId) {
      fetchData();
    }
  }, [bookingId]);

  const allFeeTypeOptions = [
    {
      value: "CLEANING",
      label: "Phí vệ sinh",
      icon: "clear",
      color: "#7CFFCB",
      price: getCleaningFeeAmount(),
    },
    {
      value: "LATE_RETURN",
      label: "Phí trả muộn",
      icon: "clock-circle",
      color: "#FFD666",
      pricePerHour: getLateReturnHourlyRate(),
    },
    {
      value: "CROSS_BRANCH",
      label: "Phí trả khác chi nhánh",
      icon: "swap",
      color: "#7DB3FF",
      price: getCrossBranchFeeAmount(),
    },
    {
      value: "EXCESS_KM",
      label: "Phí vượt km",
      icon: "dashboard",
      color: "#C9B6FF",
      price: 0,
    },
  ];

  // Calculate available fees based on booking data
  const getAvailableFeeOptions = () => {
    if (!Booking) return allFeeTypeOptions;

    const available: typeof allFeeTypeOptions = [];

    // Cleaning fee - always available
    available.push(allFeeTypeOptions.find((opt) => opt.value === "CLEANING")!);

    // Cross-branch fee - only if different branches
    if (
      Booking.handoverBranch?.id &&
      Booking.returnBranch?.id &&
      Booking.handoverBranch.id !== Booking.returnBranch.id
    ) {
      available.push(
        allFeeTypeOptions.find((opt) => opt.value === "CROSS_BRANCH")!
      );
    }

    // Late-return fee - only if actual return is after end datetime
    if (Booking.endDatetime && Booking.actualReturnDatetime) {
      const endTime = new Date(Booking.endDatetime).getTime();
      const actualReturnTime = new Date(Booking.actualReturnDatetime).getTime();

      if (actualReturnTime > endTime) {
        available.push(
          allFeeTypeOptions.find((opt) => opt.value === "LATE_RETURN")!
        );
      }
    }

    // Excess KM - only if excessKm > 0
    const { excessKm } = calculateExcessKmFee();
    if (excessKm > 0) {
      available.push(
        allFeeTypeOptions.find((opt) => opt.value === "EXCESS_KM")!
      );
    }

    return available;
  };

  const feeTypeOptions = getAvailableFeeOptions();

  // Calculate late return fee amount
  const calculateLateReturnFee = (): number => {
    if (!Booking?.endDatetime || !Booking?.actualReturnDatetime) return 0;

    const endTime = new Date(Booking.endDatetime).getTime();
    const actualReturnTime = new Date(Booking.actualReturnDatetime).getTime();

    if (actualReturnTime <= endTime) return 0;

    const hoursLate = Math.ceil(
      (actualReturnTime - endTime) / (1000 * 60 * 60)
    );
    return hoursLate * getLateReturnHourlyRate();
  };

  // Get late return hours
  const getLateReturnHours = (): number => {
    if (!Booking?.endDatetime || !Booking?.actualReturnDatetime) return 0;

    const endTime = new Date(Booking.endDatetime).getTime();
    const actualReturnTime = new Date(Booking.actualReturnDatetime).getTime();

    if (actualReturnTime <= endTime) return 0;

    return Math.ceil((actualReturnTime - endTime) / (1000 * 60 * 60));
  };

  // Check if has cross-branch fee
  const hasCrossBranchFee = (): boolean => {
    if (!Booking) return false;
    return (
      Booking.handoverBranch?.id &&
      Booking.returnBranch?.id &&
      Booking.handoverBranch.id !== Booking.returnBranch.id
    );
  };

  const getFeeTypeInfo = (feeType: string) => {
    return (
      allFeeTypeOptions.find((opt) => opt.value === feeType) || {
        value: feeType,
        label: feeType,
        icon: "file-text",
        color: "#9CA3AF",
        price: 0,
      }
    );
  };

  const getFeePrice = (feeType: string): string => {
    if (feeType === "LATE_RETURN") {
      const amount = calculateLateReturnFee();
      return amount > 0 ? formatCurrency(amount) : "";
    }

    if (feeType === "EXCESS_KM") {
      const { fee } = calculateExcessKmFee();
      return fee > 0 ? formatCurrency(fee) : "";
    }

    const feeInfo = allFeeTypeOptions.find((opt) => opt.value === feeType);
    if (feeInfo?.price) {
      return formatCurrency(feeInfo.price);
    }

    return "";
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
  };

  const addAdditionalFeesHandler = async () => {
    if (isSubmitting) return;

    // Validate bookingId
    if (!bookingId) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin booking");
      return;
    }

    // Validate that at least one fee is added
    if (damageFees.length === 0 && customFees.length === 0) {
      Alert.alert("Thông báo", "Vui lòng thêm ít nhất một loại phí phát sinh");
      return;
    }

    // Validate damage fees
    const invalidDamageFees = damageFees.filter((fee) => {
      if (!fee.damageType || !fee.amount || fee.amount <= 0) {
        return true;
      }
      // Check min/max validation
      const error = validateDamageAmount(fee.amount, fee.damageType);
      return error !== null;
    });
    if (invalidDamageFees.length > 0) {
      Alert.alert(
        "Lỗi",
        "Vui lòng điền đầy đủ thông tin và đảm bảo số tiền nằm trong khoảng cho phép cho tất cả các phí hư hỏng"
      );
      return;
    }

    // Check if there are any validation errors
    if (Object.keys(damageAmountErrors).length > 0) {
      Alert.alert("Lỗi", "Vui lòng sửa các lỗi validation cho số tiền hư hỏng");
      return;
    }

    // Validate custom fees
    const invalidCustomFees = customFees.filter((fee) => !fee.feeType);
    if (invalidCustomFees.length > 0) {
      Alert.alert("Lỗi", "Vui lòng chọn loại phí cho tất cả các phí bổ sung");
      return;
    }

    try {
      setIsSubmitting(true);

      // Process damage fees
      const addDamageFeeUseCase = new AddDamageFeeUseCase(
        sl.get("AdditionalFeeRepository")
      );

      for (const damageFee of damageFees) {
        const damageResponse = await addDamageFeeUseCase.execute({
          bookingId,
          damageType: damageFee.damageType,
          amount: damageFee.amount,
          additionalNotes: damageFee.additionalNotes || "",
        });
        unwrapResponse(damageResponse);
      }

      // Process custom fees based on feeType
      for (const customFee of customFees) {
        let useCase;
        switch (customFee.feeType) {
          case "CLEANING":
            useCase = new AddCleaningFeeUseCase(
              sl.get("AdditionalFeeRepository")
            );
            await useCase.execute({ bookingId });
            break;
          case "LATE_RETURN":
            useCase = new AddLateReturnFeeUseCase(
              sl.get("AdditionalFeeRepository")
            );
            await useCase.execute({ bookingId });
            break;
          case "CROSS_BRANCH":
            useCase = new AddCrossBranchUseCase(
              sl.get("AdditionalFeeRepository")
            );
            await useCase.execute({ bookingId });
            break;
          case "EXCESS_KM":
            useCase = new AddExcessKmFeeUseCase(
              sl.get("AdditionalFeeRepository")
            );
            await useCase.execute({ bookingId });
            break;
          default:
            console.warn(`Unknown fee type: ${customFee.feeType}`);
            continue;
        }
      }

      // Show success message
      Toast.show({
        text1: "Thành công",
        text2: `Đã thêm ${
          damageFees.length + customFees.length
        } loại phí phát sinh`,
        type: "success",
      });

      // Navigate back after a short delay

      const receipts = Booking.rentalReceipts || [];
      const lastReceipt =
        receipts.length > 0 ? receipts[receipts.length - 1] : null;
      setTimeout(() => {
        navigation.navigate("ReturnReport", {
          bookingId: bookingId,
          rentalReceiptId: lastReceipt?.id || "",
          settlement: {
            baseRentalFee: 0,
            depositAmount: 0,
            totalAmount: 0,
            totalChargingFee: 0,
            totalAdditionalFees: 0,
            refundAmount: 0,
            feesBreakdown: {
              cleaningFee: 0,
              crossBranchFee: 0,
              damageFee: 0,
              excessKmFee: 0,
              lateReturnFee: 0,
            },
          },
        });
      }, 1500);
    } catch (error: any) {
      console.error("Error adding additional fees:", error);
      Alert.alert(
        "Lỗi",
        `Không thể thêm phí phát sinh: ${
          error.message || "Đã xảy ra lỗi không xác định"
        }`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate custom fees total based on fee types
  const subtotalCustomFees = customFees.reduce((sum, fee) => {
    if (!fee.feeType) return sum;

    if (fee.feeType === "LATE_RETURN") {
      return sum + calculateLateReturnFee();
    }

    if (fee.feeType === "EXCESS_KM") {
      return sum + calculateExcessKmFee().fee;
    }

    const feeInfo = allFeeTypeOptions.find((opt) => opt.value === fee.feeType);
    if (feeInfo?.price) {
      return sum + feeInfo.price;
    }

    return sum;
  }, 0);

  const subtotalDamageFees = damageFees.reduce(
    (sum, f) => sum + (f.amount || 0),
    0
  );
  const subtotalFees = subtotalCustomFees + subtotalDamageFees;

  const addFeeRow = () => {
    if (isSubmitting) return;
    const newIndex = customFees.length;
    setCustomFees((prev) => [
      ...prev,
      { feeType: "", amount: 0, description: "" },
    ]);
    // Auto expand new card
    setExpandedCustomCards((prev) => new Set(prev).add(newIndex));
  };

  // Shake animation function for error text
  const shakeError = (index: number) => {
    if (!shakeAnimations.current.has(index)) {
      shakeAnimations.current.set(index, new Animated.Value(0));
    }

    const animValue = shakeAnimations.current.get(index)!;
    animValue.setValue(0);

    Animated.sequence([
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(animValue, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const toggleDamageCard = (index: number) => {
    // Không cho phép đóng nếu có lỗi validation
    if (expandedDamageCards.has(index) && damageAmountErrors[index]) {
      shakeError(index);
      return;
    }

    setExpandedDamageCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleCustomCard = (index: number) => {
    setExpandedCustomCards((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const removeFeeRow = (index: number) => {
    if (isSubmitting) return;
    setCustomFees((prev) => prev.filter((_, i) => i !== index));
  };

  const addDamageRow = () => {
    if (isSubmitting) return;
    const newIndex = damageFees.length;
    setDamageFees((prev) => [
      ...prev,
      { damageType: "", amount: 0, additionalNotes: "" },
    ]);
    // Auto expand new card
    setExpandedDamageCards((prev) => new Set(prev).add(newIndex));
  };

  const removeDamageRow = (index: number) => {
    if (isSubmitting) return;
    setDamageFees((prev) => prev.filter((_, i) => i !== index));
  };

  const validateDamageAmount = (
    amount: number,
    damageType: string
  ): string | null => {
    if (!damageType) return null;

    const damageTypeInfo = damageTypeOptions.find(
      (opt) => opt.damageType === damageType
    );
    if (!damageTypeInfo) return null;

    const { minAmount, maxAmount } = damageTypeInfo;

    if (amount < minAmount) {
      return `Số tiền phải tối thiểu ${formatCurrency(minAmount)}`;
    }

    if (maxAmount > 0 && amount > maxAmount) {
      return `Số tiền không được vượt quá ${formatCurrency(maxAmount)}`;
    }

    return null;
  };

  const updateDamageField = (
    index: number,
    key: keyof DamageFee,
    value: string
  ) => {
    setDamageFees((prev) => {
      const next = [...prev];
      if (key === "amount") {
        const num = parseInt(value || "0", 10);
        const amount = isNaN(num) ? 0 : num;
        next[index].amount = amount;

        // Validate amount
        const error = validateDamageAmount(amount, next[index].damageType);
        setDamageAmountErrors((prevErrors) => {
          if (error) {
            return { ...prevErrors, [index]: error };
          } else {
            const newErrors = { ...prevErrors };
            delete newErrors[index];
            return newErrors;
          }
        });
      } else if (key === "damageType") {
        next[index].damageType = value;

        // Re-validate amount when damage type changes
        if (next[index].amount > 0) {
          const error = validateDamageAmount(next[index].amount, value);
          setDamageAmountErrors((prevErrors) => {
            if (error) {
              return { ...prevErrors, [index]: error };
            } else {
              const newErrors = { ...prevErrors };
              delete newErrors[index];
              return newErrors;
            }
          });
        }
      } else if (key === "additionalNotes") {
        next[index].additionalNotes = value;
      }
      return next;
    });
  };

  const updateFeeField = (
    index: number,
    key: keyof AdditionalFeesBreakdown,
    value: string
  ) => {
    setCustomFees((prev) => {
      const next = [...prev];
      if (key === "amount") {
        const num = parseInt(value || "0", 10);
        next[index].amount = isNaN(num) ? 0 : num;
      } else if (key === "feeType") {
        next[index].feeType = value;
      } else if (key === "description") {
        next[index].description = value;
      }
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenHeader
          title="Phí bổ sung"
          subtitle=""
          submeta=""
          onBack={() => navigation.goBack()}
          showBackButton={true}
        />

        <StepProgressBar currentStep={4} totalSteps={4} />

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroLeft}>
            <View style={styles.heroIcon}>
              <AntDesign name="wallet" size={24} color="#14121F" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.heroTitle}>Phí bổ sung</Text>
              <Text style={styles.heroSubtitle}>
                Thêm các loại phí phát sinh trong quá trình thuê xe
              </Text>
            </View>
          </View>
        </View>

        {/* Damage Fees Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={styles.sectionIconContainer}>
              <AntDesign name="warning" size={18} color="#FF6B6B" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Phí hư hỏng</Text>
              <Text style={styles.sectionSubtitle}>
                {damageFees.length}{" "}
                {damageFees.length === 1 ? "hư hỏng" : "hư hỏng"} đã thêm
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabled]}
            onPress={addDamageRow}
            disabled={isSubmitting}
          >
            <AntDesign name="plus" size={16} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {damageFees.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <AntDesign name="warning" size={32} color={colors.text.secondary} />
            <Text style={styles.emptyStateText}>Chưa có hư hỏng nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Nhấn nút + để thêm hư hỏng
            </Text>
          </View>
        ) : (
          damageFees.map((damage, index) => {
            const isExpanded = expandedDamageCards.has(index);
            return (
              <View key={index} style={styles.damageCard}>
                <View style={styles.damageCardHeader}>
                  <View style={styles.damageCardHeaderLeft}>
                    <View style={styles.damageBadge}>
                      <AntDesign name="warning" size={14} color="#FF6B6B" />
                      <Text style={styles.damageBadgeText}>
                        Hư hỏng #{index + 1}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.damageCardHeaderRight}>
                    <TouchableOpacity
                      style={styles.collapseBtn}
                      onPress={() => toggleDamageCard(index)}
                      disabled={isSubmitting}
                    >
                      <AntDesign
                        name={isExpanded ? "up" : "down"}
                        size={16}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeDamageBtn}
                      onPress={() => {
                        removeDamageRow(index);
                        setExpandedDamageCards((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(index);
                          return newSet;
                        });
                      }}
                      disabled={isSubmitting}
                    >
                      <AntDesign
                        name="close-circle"
                        size={20}
                        color="#FF6B6B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {!isExpanded && damage.damageType && (
                  <Text style={styles.damageCardSummary}>
                    {damageTypeOptions.find(
                      (opt) => opt.damageType === damage.damageType
                    )?.displayText || damage.damageType}
                    {damage.amount > 0 && ` · ${formatCurrency(damage.amount)}`}
                  </Text>
                )}
                {isExpanded && (
                  <View style={styles.damageForm}>
                    <View style={styles.damageFormRow}>
                      <Text style={styles.damageInputLabel}>Loại hư hỏng</Text>
                      <TouchableOpacity
                        style={[
                          styles.damageSelectBox,
                          isSubmitting && styles.disabled,
                        ]}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                        onPress={() =>
                          setOpenDamageIdx(
                            openDamageIdx === index ? null : index
                          )
                        }
                      >
                        <Text style={styles.damageSelectText}>
                          {damage.damageType || "Chọn loại hư hỏng"}
                        </Text>
                        <AntDesign
                          name={openDamageIdx === index ? "up" : "down"}
                          size={14}
                          color={colors.text.secondary}
                        />
                      </TouchableOpacity>
                      {openDamageIdx === index && (
                        <View style={styles.damageDropdown}>
                          <ScrollView
                            style={styles.damageDropdownScroll}
                            nestedScrollEnabled={true}
                            showsVerticalScrollIndicator={true}
                          >
                            {damageTypeOptions.map((opt) => (
                              <TouchableOpacity
                                key={opt.damageType}
                                style={styles.damageDropdownItem}
                                onPress={() => {
                                  updateDamageField(
                                    index,
                                    "damageType",
                                    opt.damageType
                                  );
                                  setOpenDamageIdx(null);
                                }}
                              >
                                <Text style={styles.damageDropdownItemText}>
                                  {opt.displayText}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                    </View>

                    <View style={styles.damageFormRow}>
                      <View style={styles.damageInputLabelRow}>
                        <Text style={styles.damageInputLabel}>
                          Số tiền (VND)
                        </Text>
                        {damage.damageType &&
                          (() => {
                            const damageTypeInfo = damageTypeOptions.find(
                              (opt) => opt.damageType === damage.damageType
                            );
                            if (damageTypeInfo) {
                              const { minAmount, maxAmount } = damageTypeInfo;
                              const rangeText =
                                maxAmount > 0
                                  ? `${formatCurrency(
                                      minAmount
                                    )} - ${formatCurrency(maxAmount)}`
                                  : `Tối thiểu ${formatCurrency(minAmount)}`;
                              return (
                                <Text style={styles.damageInputHelperText}>
                                  ({rangeText})
                                </Text>
                              );
                            }
                            return null;
                          })()}
                      </View>
                      <View style={styles.damageAmountInputContainer}>
                        <TextInput
                          style={[
                            styles.damageAmountInput,
                            damageAmountErrors[index] &&
                              styles.damageAmountInputError,
                          ]}
                          placeholder="0"
                          placeholderTextColor={colors.text.secondary}
                          keyboardType="numeric"
                          value={String(damage.amount || 0)}
                          onChangeText={(t) =>
                            updateDamageField(index, "amount", t)
                          }
                          editable={!isSubmitting}
                        />
                        <View style={styles.damageAmountBadge}>
                          <Text style={styles.damageAmountBadgeText}>VND</Text>
                        </View>
                      </View>
                      {damageAmountErrors[index] &&
                        (() => {
                          if (!shakeAnimations.current.has(index)) {
                            shakeAnimations.current.set(
                              index,
                              new Animated.Value(0)
                            );
                          }
                          const animValue = shakeAnimations.current.get(index)!;

                          return (
                            <Animated.View
                              style={{
                                transform: [{ translateX: animValue }],
                              }}
                            >
                              <Text style={styles.damageAmountErrorText}>
                                {damageAmountErrors[index]}
                              </Text>
                            </Animated.View>
                          );
                        })()}
                    </View>

                    <View style={styles.damageFormRow}>
                      <Text style={styles.damageInputLabel}>
                        Ghi chú bổ sung
                      </Text>
                      <TextInput
                        style={[styles.damageNotesInput, styles.damageTextArea]}
                        placeholder="Mô tả chi tiết về hư hỏng..."
                        placeholderTextColor={colors.text.secondary}
                        value={damage.additionalNotes}
                        onChangeText={(t) =>
                          updateDamageField(index, "additionalNotes", t)
                        }
                        editable={!isSubmitting}
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Additional Fees Section */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View
              style={[
                styles.sectionIconContainer,
                { backgroundColor: "rgba(201,182,255,0.15)" },
              ]}
            >
              <AntDesign name="plus-circle" size={18} color="#C9B6FF" />
            </View>
            <View>
              <Text style={styles.sectionTitle}>Phí bổ sung khác</Text>
              <Text style={styles.sectionSubtitle}>
                {customFees.length} {customFees.length === 1 ? "phí" : "phí"} đã
                thêm
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addButton, isSubmitting && styles.disabled]}
            onPress={addFeeRow}
            disabled={isSubmitting}
          >
            <AntDesign name="plus" size={16} color="#C9B6FF" />
          </TouchableOpacity>
        </View>

        {customFees.length === 0 ? (
          <View style={styles.emptyStateCard}>
            <AntDesign
              name="file-text"
              size={32}
              color={colors.text.secondary}
            />
            <Text style={styles.emptyStateText}>Chưa có phí bổ sung nào</Text>
            <Text style={styles.emptyStateSubtext}>
              Nhấn nút + để thêm phí bổ sung
            </Text>
          </View>
        ) : (
          customFees.map((fee, index) => {
            const feeInfo = getFeeTypeInfo(fee.feeType);
            const isExpanded = expandedCustomCards.has(index);
            return (
              <View key={index} style={styles.feeCard}>
                <View style={styles.feeCardHeader}>
                  <View style={styles.feeCardHeaderLeft}>
                    <View
                      style={[
                        styles.feeIconContainer,
                        { backgroundColor: `${feeInfo.color}20` },
                      ]}
                    >
                      <AntDesign
                        name={feeInfo.icon as any}
                        size={18}
                        color={feeInfo.color}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.feeCardTitle}>
                        {fee.feeType ? feeInfo.label : "Chọn loại phí"}
                      </Text>
                      {fee.feeType && (
                        <Text
                          style={[
                            styles.feeCardAmount,
                            { color: feeInfo.color },
                          ]}
                        >
                          {getFeePrice(fee.feeType)}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.feeCardHeaderRight}>
                    <TouchableOpacity
                      style={styles.collapseBtn}
                      onPress={() => toggleCustomCard(index)}
                      disabled={isSubmitting}
                    >
                      <AntDesign
                        name={isExpanded ? "up" : "down"}
                        size={16}
                        color={colors.text.secondary}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.removeFeeBtn}
                      onPress={() => {
                        removeFeeRow(index);
                        setExpandedCustomCards((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(index);
                          return newSet;
                        });
                      }}
                      disabled={isSubmitting}
                    >
                      <AntDesign
                        name="close-circle"
                        size={20}
                        color="#FF6B6B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {isExpanded && (
                  <View style={styles.feeCardBody}>
                    <View style={styles.feeFormRow}>
                      <Text style={styles.feeInputLabel}>Loại phí</Text>
                      <TouchableOpacity
                        style={[
                          styles.feeSelectBox,
                          isSubmitting && styles.disabled,
                        ]}
                        activeOpacity={0.8}
                        disabled={isSubmitting}
                        onPress={() =>
                          setOpenTypeIdx(openTypeIdx === index ? null : index)
                        }
                      >
                        <Text style={styles.feeSelectText}>
                          {fee.feeType || "Chọn loại phí"}
                        </Text>
                        <AntDesign
                          name={openTypeIdx === index ? "up" : "down"}
                          size={14}
                          color={colors.text.secondary}
                        />
                      </TouchableOpacity>
                      {openTypeIdx === index && (
                        <View style={styles.feeDropdown}>
                          {feeTypeOptions.map((opt) => (
                            <TouchableOpacity
                              key={opt.value}
                              style={styles.feeDropdownItem}
                              onPress={() => {
                                updateFeeField(index, "feeType", opt.value);
                                setOpenTypeIdx(null);
                              }}
                            >
                              <View style={styles.feeDropdownItemLeft}>
                                <View
                                  style={[
                                    styles.feeDropdownIcon,
                                    { backgroundColor: `${opt.color}20` },
                                  ]}
                                >
                                  <AntDesign
                                    name={opt.icon as any}
                                    size={14}
                                    color={opt.color}
                                  />
                                </View>
                                <View style={{ flex: 1 }}>
                                  <Text style={styles.feeDropdownItemText}>
                                    {opt.label}
                                  </Text>
                                  {opt.value === "LATE_RETURN" &&
                                  Booking?.endDatetime &&
                                  Booking?.actualReturnDatetime ? (
                                    <Text
                                      style={[
                                        styles.feeDropdownItemPrice,
                                        { color: opt.color },
                                      ]}
                                    >
                                      {getFeePrice(opt.value)}
                                    </Text>
                                  ) : opt.value === "EXCESS_KM" ? (
                                    <Text
                                      style={[
                                        styles.feeDropdownItemPrice,
                                        { color: opt.color },
                                      ]}
                                    >
                                      {getFeePrice(opt.value) || "Tính tự động"}
                                    </Text>
                                  ) : opt.price ? (
                                    <Text
                                      style={[
                                        styles.feeDropdownItemPrice,
                                        { color: opt.color },
                                      ]}
                                    >
                                      {formatCurrency(opt.price)}
                                    </Text>
                                  ) : null}
                                </View>
                              </View>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}

        {/* Damage Fees Summary Card */}
        {damageFees.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryHeaderIcon}>
                <AntDesign name="warning" size={20} color="#FF6B6B" />
              </View>
              <Text style={styles.summaryHeaderTitle}>Phí hư hỏng</Text>
            </View>

            {damageFees.map((damage, index) => {
              const damageTypeInfo = damageTypeOptions.find(
                (opt) => opt.damageType === damage.damageType
              );
              return (
                <View key={index} style={styles.summaryRow}>
                  <View style={styles.summaryRowLeft}>
                    <AntDesign name="warning" size={14} color="#FF6B6B" />
                    <View style={{ flex: 1 }}>
                      <Text style={styles.summaryLabel}>
                        Phí hư hỏng #{index + 1}
                      </Text>
                      {damageTypeInfo && (
                        <Text style={styles.summaryNote}>
                          {damageTypeInfo.displayText}
                          {damage.additionalNotes &&
                            ` - ${damage.additionalNotes}`}
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={[styles.summaryValue, { color: "#FF6B6B" }]}>
                    {formatCurrency(damage.amount || 0)}
                  </Text>
                </View>
              );
            })}

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Tổng phí hư hỏng</Text>
              <Text style={[styles.summaryTotalValue, { color: "#FF6B6B" }]}>
                {formatCurrency(subtotalDamageFees)}
              </Text>
            </View>
          </View>
        )}

        {/* Additional Fees Summary Card */}
        {(customFees.length > 0 || subtotalFees > 0) && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryHeaderIcon}>
                <AntDesign name="calculator" size={20} color="#C9B6FF" />
              </View>
              <Text style={styles.summaryHeaderTitle}>Phí bổ sung khác</Text>
            </View>

            {/* Custom Fees Breakdown */}
            {customFees.length > 0 && (
              <>
                {customFees.map((fee, index) => {
                  const feeInfo = getFeeTypeInfo(fee.feeType);
                  let note = "";

                  if (fee.feeType === "CROSS_BRANCH" && hasCrossBranchFee()) {
                    note = `${Booking?.handoverBranch?.branchName || "N/A"} → ${
                      Booking?.returnBranch?.branchName || "N/A"
                    }`;
                  } else if (fee.feeType === "LATE_RETURN") {
                    const hours = getLateReturnHours();
                    if (hours > 0) {
                      note = `Trả muộn ${hours} giờ`;
                    }
                  } else if (fee.feeType === "EXCESS_KM") {
                    const { excessKm, details } = calculateExcessKmFee();
                    const detailText = details || "Chưa có dữ liệu quãng đường";
                    note =
                      excessKm > 0
                        ? `${detailText} · Vượt ${excessKm} km`
                        : `${detailText} · Không vượt km`;
                  }

                  let feeAmount = 0;
                  if (fee.feeType === "LATE_RETURN") {
                    feeAmount = calculateLateReturnFee();
                  } else if (fee.feeType === "EXCESS_KM") {
                    feeAmount = calculateExcessKmFee().fee;
                  } else {
                    feeAmount = feeInfo.price || 0;
                  }

                  return (
                    <View key={index} style={styles.summaryRow}>
                      <View style={styles.summaryRowLeft}>
                        <AntDesign
                          name={feeInfo.icon as any}
                          size={14}
                          color={feeInfo.color}
                        />
                        <View style={{ flex: 1 }}>
                          <Text style={styles.summaryLabel}>
                            {feeInfo.label}
                          </Text>
                          {note && (
                            <Text style={styles.summaryNote}>{note}</Text>
                          )}
                        </View>
                      </View>
                      <Text
                        style={[styles.summaryValue, { color: feeInfo.color }]}
                      >
                        {formatCurrency(feeAmount)}
                      </Text>
                    </View>
                  );
                })}

                <View style={styles.summaryRow}>
                  <View style={styles.summaryRowLeft}>
                    <AntDesign name="plus-circle" size={14} color="#C9B6FF" />
                    <Text style={styles.summaryLabel}>Tổng phí bổ sung</Text>
                  </View>
                  <Text style={[styles.summaryValue, { color: "#C9B6FF" }]}>
                    {formatCurrency(subtotalCustomFees)}
                  </Text>
                </View>
              </>
            )}

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>
                Tổng phí bổ sung khác
              </Text>
              <Text style={styles.summaryTotalValue}>
                {formatCurrency(subtotalCustomFees)}
              </Text>
            </View>
          </View>
        )}

        {/* Overall Combined Summary Card */}
        {subtotalFees > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View style={styles.summaryHeaderIcon}>
                <AntDesign name="wallet" size={20} color="#7CFFCB" />
              </View>
              <Text style={styles.summaryHeaderTitle}>Tổng phí phát sinh</Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryRowLeft}>
                <AntDesign name="warning" size={14} color="#FF6B6B" />
                <Text style={styles.summaryLabel}>Phí hư hỏng</Text>
              </View>
              <Text style={[styles.summaryValue, { color: "#FF6B6B" }]}>
                {formatCurrency(subtotalDamageFees)}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryRowLeft}>
                <AntDesign name="plus-circle" size={14} color="#C9B6FF" />
                <Text style={styles.summaryLabel}>Phí bổ sung khác</Text>
              </View>
              <Text style={[styles.summaryValue, { color: "#C9B6FF" }]}>
                {formatCurrency(subtotalCustomFees)}
              </Text>
            </View>

            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotalLabel}>Tổng cộng</Text>
              <Text style={styles.summaryTotalValue}>
                {formatCurrency(subtotalFees)}
              </Text>
            </View>
          </View>
        )}

        {/* Generate Report Button */}
        <TouchableOpacity
          style={[styles.generateButton, isSubmitting && styles.disabled]}
          onPress={addAdditionalFeesHandler}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <ActivityIndicator
                size="small"
                color="#000"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.generateButtonText}>Đang tạo...</Text>
            </>
          ) : (
            <Text style={styles.generateButtonText}>Thêm phí phát sinh</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Loading Modal while submitting */}
      <Modal transparent visible={isSubmitting} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <ActivityIndicator size="large" color="#C9B6FF" />
            <Text style={styles.modalTitle}>Đang thêm phí phát sinh</Text>
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
  scrollContent: {
    paddingBottom: 40,
  },
  heroCard: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#14121F",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.5)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  heroIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#FFD666",
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    color: colors.text.primary,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 4,
  },
  heroSubtitle: {
    color: colors.text.secondary,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  sectionIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(255,107,107,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  emptyStateCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 32,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#2A2D36",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    color: colors.text.primary,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    color: colors.text.secondary,
    fontSize: 12,
    textAlign: "center",
  },
  damageCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  damageCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  damageCardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  damageCardSummary: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FF6B6B",
    marginBottom: 8,
  },
  collapseBtn: {
    padding: 4,
  },
  damageBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageBadgeText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "600",
  },
  removeDamageBtn: {
    padding: 4,
  },
  damageForm: {
    gap: 12,
  },
  damageFormRow: {
    marginBottom: 4,
  },
  damageInputLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  damageInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    fontWeight: "600",
  },
  damageInputHelperText: {
    fontSize: 11,
    color: colors.text.secondary,
    opacity: 0.7,
    fontStyle: "italic",
  },
  damageSelectBox: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  damageSelectText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  damageDropdown: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    marginTop: 8,
    maxHeight: 200,
    overflow: "hidden",
  },
  damageDropdownScroll: {
    maxHeight: 200,
  },
  damageDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D36",
  },
  damageDropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  damageAmountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  damageAmountInput: {
    flex: 1,
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 16,
    fontWeight: "600",
    borderWidth: 1,
    borderColor: "#2A2D36",
  },
  damageAmountInputError: {
    borderColor: "#FF6B6B",
    borderWidth: 1.5,
  },
  damageAmountErrorText: {
    fontSize: 11,
    color: "#FF6B6B",
    marginTop: 6,
    marginLeft: 4,
    fontWeight: "500",
  },
  damageAmountBadge: {
    backgroundColor: "rgba(255,107,107,0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,107,107,0.3)",
  },
  damageAmountBadgeText: {
    color: "#FF6B6B",
    fontSize: 12,
    fontWeight: "700",
  },
  damageNotesInput: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    padding: 14,
    color: colors.text.primary,
    fontSize: 14,
    borderWidth: 1,
    borderColor: "#2A2D36",
    minHeight: 80,
    textAlignVertical: "top",
  },
  damageTextArea: {
    minHeight: 80,
  },
  feeCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
  },
  feeCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  feeCardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  feeCardHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  feeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  feeCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 2,
  },
  feeCardAmount: {
    fontSize: 13,
    fontWeight: "600",
    color: "#C9B6FF",
  },
  removeFeeBtn: {
    padding: 4,
  },
  feeCardBody: {
    gap: 12,
  },
  feeFormRow: {
    marginBottom: 4,
  },
  feeInputLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 8,
    fontWeight: "600",
  },
  feeSelectBox: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  feeSelectText: {
    color: colors.text.primary,
    fontSize: 14,
    flex: 1,
  },
  feeDropdown: {
    backgroundColor: "#11131A",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2A2D36",
    marginTop: 8,
    overflow: "hidden",
  },
  feeDropdownItem: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2D36",
  },
  feeDropdownItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  feeDropdownIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  feeDropdownItemText: {
    color: colors.text.primary,
    fontSize: 14,
  },
  feeDropdownItemPrice: {
    color: colors.text.secondary,
    fontSize: 12,
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: "#1A1D26",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(201,182,255,0.3)",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  summaryHeaderIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(201,182,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryHeaderTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  summaryRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  summaryNote: {
    fontSize: 11,
    color: colors.text.secondary,
    marginTop: 2,
    fontStyle: "italic",
    opacity: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: "#2A2D36",
    marginVertical: 12,
  },
  summaryTotalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
  summaryTotalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#C9B6FF",
  },
  generateButton: {
    backgroundColor: "#C9B6FF",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  generateButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.6,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalCard: {
    width: 280,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: "#222",
    borderRadius: 16,
    alignItems: "center",
    gap: 12,
  },
  modalTitle: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
  },
});
