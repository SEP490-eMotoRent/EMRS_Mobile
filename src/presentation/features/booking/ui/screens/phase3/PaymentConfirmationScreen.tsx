import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import sl from "../../../../../../core/di/InjectionContainer";
import { CreateBookingUseCase } from "../../../../../../domain/usecases/booking/CreateBookingUseCase";
import { CreateVNPayBookingUseCase, VNPayBookingResultWithExpiry } from "../../../../../../domain/usecases/booking/CreateVNPayBookingUseCase";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { useCreateBooking } from "../../../hooks/useCreateBooking";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummaryCard } from "../../organisms/booking/BookingSummaryCard";
import { CostBreakdown } from "../../organisms/CostBreakdown";
import { PaymentMethodCard } from "../../organisms/payment/PaymentMethodCard";
import { PaymentNotices } from "../../organisms/payment/PaymentNotices";

type RoutePropType = RouteProp<BookingStackParamList, 'PaymentConfirmation'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'PaymentConfirmation'>;

interface BookingContext {
    bookingId?: string;
    vehicleId: string;
    vehicleName: string;
    vehicleImageUrl?: string;
    startDate: string;
    endDate: string;
    duration: string;
    rentalDays: number;
    branchName: string;
    insurancePlan: string;
    totalAmount: string;
    securityDeposit: string;
}

export const PaymentConfirmationScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();

    const {
        vehicleId,
        vehicleName,
        vehicleImageUrl,
        branchId,
        branchName,
        startDate,
        endDate,
        duration,
        rentalDays,
        insurancePlan,
        insurancePlanId,
        rentalFee,
        insuranceFee,
        securityDeposit,
        total,
    } = route.params;

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"wallet" | "vnpay">("wallet");

    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id;

    const createBookingUseCase = useMemo(() =>
        sl.get<CreateBookingUseCase>("CreateBookingUseCase"),
        []
    );

    const createVNPayBookingUseCase = useMemo(() =>
        sl.get<CreateVNPayBookingUseCase>("CreateVNPayBookingUseCase"),
        []
    );

    const { createBooking, loading: bookingLoading } = useCreateBooking(createBookingUseCase);

    const parseDateString = (dateStr: string): Date => {
        const monthNames: { [key: string]: number } = {
            "Tháng 1": 0, "Tháng 2": 1, "Tháng 3": 2, "Tháng 4": 3,
            "Tháng 5": 4, "Tháng 6": 5, "Tháng 7": 6, "Tháng 8": 7,
            "Tháng 9": 8, "Tháng 10": 9, "Tháng 11": 10, "Tháng 12": 11
        };

        const match = dateStr.match(/(Tháng \d+)\s+(\d+)\s+(\d+):(\d+)\s*(AM|PM)/);
        if (!match) throw new Error(`Invalid date: ${dateStr}`);

        const [, monthStr, day, hours, minutes, period] = match;
        const monthIndex = monthNames[monthStr];
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        const year = new Date().getFullYear();
        return new Date(year, monthIndex, parseInt(day), hour, parseInt(minutes), 0, 0);
    };

    const parsePrice = (price: string): number => {
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };

    const vnpayAmount = parsePrice(securityDeposit) + parsePrice(insuranceFee);
    const vnpayAmountFormatted = vnpayAmount.toLocaleString('vi-VN') + 'đ';

    const totalAmount = parsePrice(total);
    const currentBalance = 5_000_000;
    const afterBalance = currentBalance - totalAmount;
    const isSufficient = afterBalance >= 0;

    const handlePayment = async () => {
        if (!userId) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập");
            return;
        }

        try {
            const startDateTime = parseDateString(startDate);
            const endDateTime = parseDateString(endDate);

            const insurancePackageId = insurancePlanId && /^[0-9a-f-]{36}$/i.test(insurancePlanId)
                ? insurancePlanId
                : undefined;

            const bookingInput = {
                vehicleModelId: vehicleId,
                startDatetime: startDateTime,
                endDatetime: endDateTime,
                handoverBranchId: branchId,
                rentalDays: rentalDays,
                rentalHours: 0,
                baseRentalFee: parsePrice(rentalFee),
                depositAmount: parsePrice(securityDeposit),
                rentingRate: 1.0,
                averageRentalPrice: parsePrice(rentalFee) / rentalDays,
                insurancePackageId: insurancePackageId,
                totalRentalFee: parsePrice(total),
                renterId: userId,
            };

            if (selectedPaymentMethod === "wallet") {
                const booking = await createBooking(bookingInput);
                navigation.replace('DigitalContract', {
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl: vehicleImageUrl || "",
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: total,
                    securityDeposit,
                    contractNumber: booking.bookingCode || booking.id,
                });
            }
            else if (selectedPaymentMethod === "vnpay") {
                const result: VNPayBookingResultWithExpiry = await createVNPayBookingUseCase.execute({
                    ...bookingInput,
                    depositAmount: vnpayAmount,
                });

                const context: BookingContext = {
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: vnpayAmountFormatted,
                    securityDeposit,
                };

                const STORAGE_KEY = `vnpay_payment_context_${result.booking.id}`;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(context));

                navigation.navigate('VNPayWebView', {
                    vnpayUrl: result.vnpayUrl,
                    bookingId: result.booking.id,
                    expiresAt: result.expiresAt,
                    vehicleName,
                    totalAmount: vnpayAmountFormatted,
                    vehicleId,
                    vehicleImageUrl: vehicleImageUrl || "",
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    securityDeposit,
                });
            }
        } catch (err: any) {
            const msg = err.response?.data?.message || err.message || "Lỗi không xác định";
            Alert.alert("Đặt xe thất bại", msg, [{ text: "OK" }]);
        }
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Xác nhận thanh toán" onBack={() => navigation.goBack()} />
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                <BookingSummaryCard
                    vehicleName={vehicleName}
                    rentalPeriod={`${startDate} - ${endDate}`}
                    duration={duration}
                    branchName={branchName}
                    insurancePlan={insurancePlan}
                />

                <View style={styles.section}>
                    <PaymentMethodCard
                        isSelected={selectedPaymentMethod === "wallet"}
                        onSelect={() => setSelectedPaymentMethod("wallet")}
                        currentBalance={`${currentBalance.toLocaleString()}đ`}
                        afterBalance={`${afterBalance.toLocaleString()}đ`}
                        isSufficient={isSufficient}
                    />

                    <TouchableOpacity
                        style={[styles.paymentOption, selectedPaymentMethod === "vnpay" && styles.paymentOptionSelected]}
                        onPress={() => setSelectedPaymentMethod("vnpay")}
                    >
                        <View style={styles.paymentOptionRow}>
                            <View style={styles.radioButton}>
                                {selectedPaymentMethod === "vnpay" && <View style={styles.radioButtonInner} />}
                            </View>
                            <View style={styles.paymentOptionContent}>
                                <View style={styles.paymentOptionHeader}>
                                    <Text style={styles.paymentOptionTitle}>VNPay</Text>
                                    <View style={styles.vnpayBadge}><Text style={styles.vnpayBadgeText}>Phổ biến</Text></View>
                                </View>
                                <Text style={styles.paymentOptionDesc}>Thanh toán qua cổng VNPay</Text>
                                <Text style={styles.paymentMethodsText}>ATM • Visa • MasterCard • JCB • QR Code</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <CostBreakdown
                    rentalFee={rentalFee}
                    insuranceFee={insuranceFee}
                    securityDeposit={securityDeposit}
                    total={total}
                />

                <PaymentNotices />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={bookingLoading
                        ? "Đang xử lý..."
                        : selectedPaymentMethod === "wallet"
                            ? `Thanh toán ${total} bằng Ví`
                            : `Thanh toán ${vnpayAmountFormatted} bằng VNPay`
                    }
                    onPress={handlePayment}
                    disabled={bookingLoading || (selectedPaymentMethod === "wallet" && !isSufficient)}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    section: { marginBottom: 20 },
    footer: { padding: 16, paddingBottom: 32, backgroundColor: "#000", borderTopWidth: 1, borderTopColor: "#1a1a1a" },
    paymentOption: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 16, marginTop: 12, borderWidth: 2, borderColor: "#333" },
    paymentOptionSelected: { borderColor: "#4169E1", backgroundColor: "#0f1729" },
    paymentOptionRow: { flexDirection: "row", alignItems: "flex-start" },
    radioButton: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#666", justifyContent: "center", alignItems: "center", marginRight: 12, marginTop: 2 },
    radioButtonInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: "#4169E1" },
    paymentOptionContent: { flex: 1 },
    paymentOptionHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
    paymentOptionTitle: { color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 8 },
    vnpayBadge: { backgroundColor: "#4169E1", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
    vnpayBadgeText: { color: "#fff", fontSize: 11, fontWeight: "600" },
    paymentOptionDesc: { color: "#999", fontSize: 14, marginBottom: 8 },
    paymentMethodsText: { color: "#666", fontSize: 12 },
});