import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
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
        serviceFee,
        total,
    } = route.params;

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wallet");

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

    
    const { createBooking, loading: bookingLoading, error: bookingError } = useCreateBooking(createBookingUseCase);

    console.log("Payment Confirmation - Vehicle:", vehicleName);
    console.log("Branch ID:", branchId);
    console.log("Branch Name:", branchName);

    const handleBack = () => {
        navigation.goBack();
    };

    const parseDateString = (dateStr: string): Date => {
        // Vietnamese month names
        const monthNames: { [key: string]: number } = {
            "Tháng 1": 0, "Tháng 2": 1, "Tháng 3": 2, "Tháng 4": 3,
            "Tháng 5": 4, "Tháng 6": 5, "Tháng 7": 6, "Tháng 8": 7,
            "Tháng 9": 8, "Tháng 10": 9, "Tháng 11": 10, "Tháng 12": 11
        };
        
        // Match Vietnamese format: "Tháng 11 09 10:00 AM"
        const match = dateStr.match(/(Tháng \d+)\s+(\d+)\s+(\d+):(\d+)\s*(AM|PM)/);
        
        if (!match) {
            console.error("❌ Failed to parse date:", dateStr);
            throw new Error(`Invalid date format: ${dateStr}`);
        }
        
        const [, monthStr, day, hours, minutes, period] = match;
        
        const monthIndex = monthNames[monthStr];
        if (monthIndex === undefined) {
            console.error("❌ Unknown month:", monthStr);
            throw new Error(`Unknown month: ${monthStr}`);
        }
        
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const year = new Date().getFullYear();
        const date = new Date(year, monthIndex, parseInt(day), hour, parseInt(minutes), 0, 0);
        
        console.log("✅ Parsed date:", {
            input: dateStr,
            output: date.toISOString(),
            year, month: monthIndex, day, hour, minutes
        });
        
        return date;
    };
    const parsePrice = (price: string): number => {
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };

    const handlePayment = async () => {
        console.log("Processing payment for vehicle:", vehicleName);
        console.log("Payment method:", selectedPaymentMethod);
        console.log("Total amount:", total);

        if (!userId) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập để tiếp tục đặt xe");
            return;
        }

        try {
            const startDateTime = parseDateString(startDate);
            const endDateTime = parseDateString(endDate);
            
            console.log("Start:", startDate, "→", startDateTime.toISOString());
            console.log("End:", endDate, "→", endDateTime.toISOString());
            console.log("Using branch ID:", branchId);

            const isValidGuid = (str: string) => {
                const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                return guidRegex.test(str);
            };

            const insurancePackageId =
                insurancePlanId && isValidGuid(insurancePlanId)
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

            console.log("Booking Data:", JSON.stringify(bookingInput, null, 2));

            // ✅ WALLET PAYMENT (existing)
            if (selectedPaymentMethod === "wallet") {
                const booking = await createBooking(bookingInput);

                console.log("Booking created successfully with wallet!");
                console.log("Booking ID:", booking.id);
                console.log("Booking Code:", booking.bookingCode);
                console.log("Booking Status:", booking.bookingStatus);

                navigation.navigate('DigitalContract', {
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
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
            // ✅ VNPAY PAYMENT (new)
            // else if (selectedPaymentMethod === "vnpay") {
            //     const result: VNPayBookingResultWithExpiry = await createVNPayBookingUseCase.execute(bookingInput);

            //     console.log("VNPay booking created successfully!");
            //     console.log("Booking ID:", result.booking.id);
            //     console.log("VNPay URL:", result.vnpayUrl);
            //     console.log("Expires at:", result.expiresAt);

            //     // Navigate to VNPay WebView
            //     navigation.navigate('VNPayWebView', {
            //         vnpayUrl: result.vnpayUrl,
            //         bookingId: result.booking.id,
            //         expiresAt: result.expiresAt,
            //         vehicleName,
            //         totalAmount: total,
            //     });
            // }

        } catch (err: any) {
            console.error("Booking creation failed:", err);
            console.error("Error details:", err.response?.data || err.message);
            
            let errorMessage = "Không thể tạo đặt xe. Vui lòng thử lại.";
            
            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            Alert.alert(
                "Đặt xe thất bại",
                errorMessage,
                [{ text: "OK" }]
            );
        }
    };
    
    const totalAmount = parsePrice(total);
    // TODO: Get actual balance from wallet API when implemented
    const currentBalance = 5000000;
    const afterBalance = currentBalance - totalAmount;
    const isSufficient = afterBalance >= 0;

    return (
        <View style={styles.container}>
            <PageHeader title="Xác nhận thanh toán" onBack={handleBack} />
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <BookingSummaryCard
                    vehicleName={vehicleName}
                    rentalPeriod={`${startDate} - ${endDate}`}
                    duration={duration}
                    branchName={branchName}
                    insurancePlan={insurancePlan}
                />

                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.sectionDivider} />
                        <View style={styles.sectionTitleContainer}>
                            <View style={styles.titleBackground}>
                                <View style={styles.sectionTitle} />
                            </View>
                        </View>
                    </View>
                    
                    <PaymentMethodCard
                        isSelected={selectedPaymentMethod === "wallet"}
                        onSelect={() => setSelectedPaymentMethod("wallet")}
                        currentBalance={`${currentBalance.toLocaleString()}đ`}
                        afterBalance={`${afterBalance.toLocaleString()}đ`}
                        isSufficient={isSufficient}
                    />
                </View>

                <CostBreakdown
                    rentalFee={rentalFee}
                    insuranceFee={insuranceFee}
                    securityDeposit={securityDeposit}
                    serviceFee={serviceFee}
                    total={total}
                />

                <PaymentNotices />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton
                    title={bookingLoading ? "Đang xử lý..." : `Thanh toán ${total} bằng Ví`}
                    onPress={handlePayment}
                    disabled={bookingLoading || !isSufficient}
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
    sectionHeader: { position: "relative", height: 1, marginBottom: 16 },
    sectionDivider: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#333" },
    sectionTitleContainer: { position: "absolute", left: 0, right: 0, top: -10, alignItems: "flex-start", paddingLeft: 16 },
    titleBackground: { backgroundColor: "#000", paddingHorizontal: 8 },
    sectionTitle: { height: 20 },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
});