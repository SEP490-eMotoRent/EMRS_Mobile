import AsyncStorage from '@react-native-async-storage/async-storage';
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { container } from "../../../../../../core/di/ServiceContainer";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { useWallet } from '../../../../profile/hooks/wallet/useWallet';
import { useCreateBooking } from "../../../hooks/useCreateBooking";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummaryCard } from "../../organisms/booking/BookingSummaryCard";
import { CostBreakdown } from "../../organisms/CostBreakdown";
import { PaymentMethodCard } from "../../organisms/payment/PaymentMethodCard";
import { PaymentNotices } from "../../organisms/payment/PaymentNotices";
import { SafeAreaView } from "react-native-safe-area-context";

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
    // ==================== 1. HOOKS ====================
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();

    const { balance: walletBalance, loading: walletLoading, refresh: refreshWallet } = useWallet();

    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id;

    const { createBooking, loading: bookingLoading } = useCreateBooking(container.booking.create.standard);

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"wallet" | "vnpay" | "zalopay">("wallet");

    // ==================== 2. EARLY RETURN ====================
    if (walletLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#00ff00" />
                <Text style={styles.loadingText}>Đang tải số dư ví...</Text>
            </View>
        );
    }

    // ==================== 3. DATA & CALCULATIONS ====================
    const safeBalance = walletBalance ?? 0;

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
        baseRentalFee,
        rentingRate,
        averageRentalPrice,
        vehicleCategory,
        holidaySurcharge,
        holidayDayCount,
        membershipDiscountPercentage,
        membershipDiscountAmount,
        membershipTier,
    } = route.params;

    const parsePrice = (price: string): number => {
        return parseInt(price.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const rental = parsePrice(rentalFee);
    const insurance = parsePrice(insuranceFee);
    const deposit = parsePrice(securityDeposit);
    
    const totalAmount = rental + insurance + deposit;
    const passedTotal = parsePrice(total);

    if (totalAmount !== passedTotal) {
        console.warn("⚠️ Total mismatch detected!");
        console.warn("Our calculation:", totalAmount);
        console.warn("Passed from prev screen:", passedTotal);
        console.warn("Difference:", Math.abs(totalAmount - passedTotal));
    } else {
        console.log("✅ Total verification passed:", totalAmount);
    }

    const afterBalance = safeBalance - totalAmount;
    const isSufficient = afterBalance >= 0;

    const totalAmountFormatted = `${totalAmount.toLocaleString('vi-VN')}đ`;

    console.log("Payment Confirmation - Amounts:", {
        baseRentalFee,
        rentingRate,
        rental,
        averageRentalPrice,
        insurance,
        deposit,
        totalAmount,
        vehicleCategory,
        holidaySurcharge,
        holidayDayCount,
        membershipTier,
        membershipDiscountPercentage,
        membershipDiscountAmount,
    });

    const parseDateString = (dateStr: string): Date => {
        const monthNames: { [key: string]: number } = {
            "Tháng 1": 0, "Tháng 2": 1, "Tháng 3": 2, "Tháng 4": 3,
            "Tháng 5": 4, "Tháng 6": 5, "Tháng 7": 6, "Tháng 8": 7,
            "Tháng 9": 8, "Tháng 10": 9, "Tháng 11": 10, "Tháng 12": 11
        };

        const match = dateStr.match(/(Tháng \d+)\s+(\d+)\s+(\d+):(\d+)\s*(AM|PM|SA|CH)/i);
        if (!match) {
            console.error("❌ Failed to parse date:", dateStr);
            throw new Error(`Invalid date format: ${dateStr}`);
        }

        const [, monthStr, day, hours, minutes, period] = match;
        const monthIndex = monthNames[monthStr];
        
        if (monthIndex === undefined) {
            throw new Error(`Invalid month: ${monthStr}`);
        }

        let hour = parseInt(hours, 10);
        
        const isPM = period.toUpperCase() === 'PM' || period.toUpperCase() === 'CH';
        const isAM = period.toUpperCase() === 'AM' || period.toUpperCase() === 'SA';
        
        if (isPM && hour !== 12) {
            hour += 12;
        }
        if (isAM && hour === 12) {
            hour = 0;
        }

        const year = new Date().getFullYear();
        const date = new Date(year, monthIndex, parseInt(day, 10), hour, parseInt(minutes, 10), 0, 0);
        
        console.log("✅ Parsed date:", {
            input: dateStr,
            output: date.toISOString(),
        });
        
        return date;
    };

    // ==================== 4. PAYMENT HANDLER ====================
    const handlePayment = async () => {
        if (!userId) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập");
            return;
        }

        try {
            const startDateTime = parseDateString(startDate);
            const endDateTime = parseDateString(endDate);

            let finalInsurancePackageId: string | undefined = undefined;
            
            if (insurancePlanId && insurancePlanId !== "none") {
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(insurancePlanId)) {
                    finalInsurancePackageId = insurancePlanId;
                } else {
                    console.warn("⚠️ Invalid insurance package ID format:", insurancePlanId);
                    finalInsurancePackageId = insurancePlanId;
                }
            }

            const bookingInput = {
                vehicleModelId: vehicleId,
                startDatetime: startDateTime,
                endDatetime: endDateTime,
                handoverBranchId: branchId,
                rentalDays,
                rentalHours: 0,
                baseRentalFee: baseRentalFee,
                depositAmount: deposit,
                rentingRate: rentingRate,
                averageRentalPrice: averageRentalPrice,
                insurancePackageId: finalInsurancePackageId,
                totalRentalFee: rental,
                renterId: userId,
                holidaySurcharge: holidaySurcharge || 0,
                holidayDayCount: holidayDayCount || 0,
                membershipDiscountPercentage: membershipDiscountPercentage || 0,
                membershipDiscountAmount: membershipDiscountAmount || 0,
                membershipTier: membershipTier || "BRONZE",
            };

            console.log("📋 Complete booking input:", JSON.stringify(bookingInput, null, 2));

            // ========== WALLET PAYMENT ==========
            if (selectedPaymentMethod === "wallet") {
                const booking = await createBooking(bookingInput);
                await refreshWallet();

                navigation.replace("DigitalContract", {
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl: vehicleImageUrl || "",
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit,
                    contractNumber: booking.bookingCode || booking.id,
                });
            } 
            // ========== VNPAY PAYMENT ==========
            else if (selectedPaymentMethod === "vnpay") {
                const result = await container.booking.create.vnpay.execute(bookingInput);

                console.log("✅ VNPay booking created:", {
                    bookingId: result.booking.id,
                    bookingCode: result.booking.bookingCode,
                    vnpayUrl: result.vnpayUrl,
                });

                const context: BookingContext = {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit,
                };

                const STORAGE_KEY = `vnpay_payment_context_${result.booking.id}`;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(context));

                navigation.navigate("VNPayWebView", {
                    vnpayUrl: result.vnpayUrl,
                    bookingId: result.booking.id,
                    expiresAt: result.expiresAt,
                    vehicleName,
                    totalAmount: totalAmountFormatted,
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
            // ========== ZALOPAY PAYMENT ==========
            else if (selectedPaymentMethod === "zalopay") {
                console.log("🔄 Creating ZaloPay booking...");
                
                const result = await container.booking.create.zalopay.execute(bookingInput);

                console.log("✅ ZaloPay booking created:", {
                    bookingId: result.booking.id,
                    zaloPayUrl: result.vnpayUrl,
                });

                const context: BookingContext = {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit,
                };

                const STORAGE_KEY = `zalopay_payment_context_${result.booking.id}`;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(context));

                navigation.navigate("ZaloPayResult", {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate,
                    endDate,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit,
                });

                setTimeout(async () => {
                    console.log("📱 Opening ZaloPay app with URL:", result.vnpayUrl);
                    
                    const canOpen = await Linking.canOpenURL(result.vnpayUrl);
                    if (canOpen) {
                        await Linking.openURL(result.vnpayUrl);
                    } else {
                        Alert.alert(
                            "Lỗi",
                            "Không thể mở ZaloPay. Vui lòng cài đặt ứng dụng ZaloPay để tiếp tục.",
                            [{ 
                                text: "OK", 
                                onPress: () => navigation.goBack() 
                            }]
                        );
                    }
                }, 500);
            }
        } catch (error: any) {
            console.error("❌ Payment failed:", error);
            Alert.alert("Lỗi thanh toán", error.message || "Đã xảy ra lỗi khi xử lý thanh toán");
        }
    };

    // ==================== 5. BUTTON TITLE LOGIC ====================
    const getButtonTitle = (): string => {
        if (bookingLoading) {
            return "Đang xử lý...";
        }
        
        switch (selectedPaymentMethod) {
            case "wallet":
                return `Thanh toán ${totalAmountFormatted}`;
            case "vnpay":
                return `Thanh toán ${totalAmountFormatted}`;
            case "zalopay":
                return `Thanh toán ${totalAmountFormatted}`;
            default:
                return `Thanh toán ${totalAmountFormatted}`;
        }
    };

    // ==================== 6. RENDER ====================
    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Xác nhận thanh toán" onBack={() => navigation.goBack()} />
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* ========== BOOKING SUMMARY ========== */}
                <BookingSummaryCard
                    vehicleName={vehicleName}
                    rentalPeriod={`${startDate} - ${endDate}`}
                    duration={duration}
                    branchName={branchName}
                    insurancePlan={insurancePlan}
                />

                {/* ========== COST BREAKDOWN (MOVED UP) ========== */}
                <CostBreakdown
                    rentalFee={rentalFee}
                    insuranceFee={insuranceFee}
                    securityDeposit={securityDeposit}
                    total={totalAmountFormatted}
                    holidaySurcharge={holidaySurcharge}
                    holidayDayCount={holidayDayCount}
                />

                {/* ========== PAYMENT METHOD SECTION ========== */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
                    
                    {/* ========== WALLET PAYMENT OPTION ========== */}
                    <PaymentMethodCard
                        isSelected={selectedPaymentMethod === "wallet"}
                        onSelect={() => setSelectedPaymentMethod("wallet")}
                        currentBalance={`${safeBalance.toLocaleString()}đ`}
                        afterBalance={`${afterBalance.toLocaleString()}đ`}
                        isSufficient={isSufficient}
                    />

                    {/* ========== VNPAY PAYMENT OPTION ========== */}
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPaymentMethod === "vnpay" && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPaymentMethod("vnpay")}
                    >
                        <View style={styles.paymentOptionRow}>
                            <View style={styles.radioButton}>
                                {selectedPaymentMethod === "vnpay" && <View style={styles.radioButtonInner} />}
                            </View>
                            <View style={styles.paymentOptionContent}>
                                <View style={styles.paymentOptionHeader}>
                                    <Text style={styles.paymentOptionTitle}>VNPay</Text>
                                    <View style={styles.vnpayBadge}>
                                        <Text style={styles.vnpayBadgeText}>Phổ biến</Text>
                                    </View>
                                </View>
                                <Text style={styles.paymentOptionDesc}>Thanh toán qua cổng VNPay</Text>
                                <Text style={styles.paymentMethodsText}>
                                    ATM • Visa • MasterCard • JCB • QR Code
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>

                    {/* ========== ZALOPAY PAYMENT OPTION ========== */}
                    <TouchableOpacity
                        style={[
                            styles.paymentOption,
                            selectedPaymentMethod === "zalopay" && styles.paymentOptionSelected,
                        ]}
                        onPress={() => setSelectedPaymentMethod("zalopay")}
                    >
                        <View style={styles.paymentOptionRow}>
                            <View style={styles.radioButton}>
                                {selectedPaymentMethod === "zalopay" && <View style={styles.radioButtonInner} />}
                            </View>
                            <View style={styles.paymentOptionContent}>
                                <View style={styles.paymentOptionHeader}>
                                    <Text style={styles.paymentOptionTitle}>ZaloPay</Text>
                                    <View style={styles.zaloPayBadge}>
                                        <Text style={styles.zaloPayBadgeText}>Mới</Text>
                                    </View>
                                </View>
                                <Text style={styles.paymentOptionDesc}>Thanh toán qua ứng dụng ZaloPay</Text>
                                <Text style={styles.paymentMethodsText}>
                                    Ví ZaloPay • Thẻ ATM • Visa • MasterCard
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* ========== PAYMENT NOTICES ========== */}
                <PaymentNotices />
            </ScrollView>

            {/* ========== STICKY FOOTER WITH PAYMENT BUTTON ========== */}
            <View style={styles.footer}>
                <View style={styles.totalPreview}>
                    <Text style={styles.totalPreviewLabel}>Tổng thanh toán</Text>
                    <Text style={styles.totalPreviewAmount}>{totalAmountFormatted}</Text>
                </View>
                
                <PrimaryButton
                    title={getButtonTitle()}
                    onPress={handlePayment}
                    disabled={
                        bookingLoading ||
                        (selectedPaymentMethod === "wallet" && !isSufficient)
                    }
                    loading={bookingLoading}
                />
            </View>
        </SafeAreaView>
    );
};

// ==================== 7. STYLES ====================
const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: "#000" 
    },
    scrollView: { 
        flex: 1 
    },
    content: { 
        padding: 16, 
        paddingBottom: 100 
    },
    section: { 
        marginBottom: 20 
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 16,
    },
    footer: {
        padding: 16,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    totalPreview: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#1a1a1a",
    },
    totalPreviewLabel: {
        color: "#999",
        fontSize: 14,
    },
    totalPreviewAmount: {
        color: "#00ff00",
        fontSize: 20,
        fontWeight: "700",
    },
    
    // Payment Option Styles
    paymentOption: {
        backgroundColor: "#1a1a1a",
        borderRadius: 12,
        padding: 16,
        marginTop: 12,
        borderWidth: 2,
        borderColor: "#333",
    },
    paymentOptionSelected: {
        borderColor: "#4169E1",
        backgroundColor: "#0f1729",
    },
    paymentOptionRow: { 
        flexDirection: "row", 
        alignItems: "flex-start" 
    },
    
    // Radio Button Styles
    radioButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#666",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
        marginTop: 2,
    },
    radioButtonInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: "#4169E1",
    },
    
    // Payment Option Content Styles
    paymentOptionContent: { 
        flex: 1 
    },
    paymentOptionHeader: { 
        flexDirection: "row", 
        alignItems: "center", 
        marginBottom: 4 
    },
    paymentOptionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 8,
    },
    paymentOptionDesc: { 
        color: "#999", 
        fontSize: 14, 
        marginBottom: 8 
    },
    paymentMethodsText: { 
        color: "#666", 
        fontSize: 12 
    },
    
    // Badge Styles
    vnpayBadge: {
        backgroundColor: "#4169E1",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    vnpayBadgeText: { 
        color: "#fff", 
        fontSize: 11, 
        fontWeight: "600" 
    },
    zaloPayBadge: {
        backgroundColor: "#00a650",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    zaloPayBadgeText: {
        color: "#fff",
        fontSize: 11,
        fontWeight: "600"
    },
    
    // Loading/Center Styles
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    loadingText: { 
        color: "#aaa", 
        marginTop: 12, 
        fontSize: 16 
    },
});