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
import { PricingBreakdown } from "../../organisms/booking/PricingBreakdown";
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

    const { balance: walletBalance, loading: walletLoading, refresh: refreshWallet } = useWallet();
    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id;

    const { createBooking, loading: bookingLoading } = useCreateBooking(container.booking.create.standard);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"wallet" | "vnpay" | "zalopay">("wallet");

    if (walletLoading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#00ff00" />
                <Text style={styles.loadingText}>Đang tải số dư ví...</Text>
            </View>
        );
    }

    const safeBalance = walletBalance ?? 0;

    const {
        vehicleId,
        vehicleName,
        vehicleImageUrl,
        branchId,
        branchName,
        pricePerDay,
        
        // ISO strings for backend
        startDateISO,
        endDateISO,
        
        // Display strings for UI
        startDateDisplay,
        endDateDisplay,
        
        duration,
        rentalDays,
        insurancePlan,
        insurancePlanId,
        
        // Numbers for calculations
        rentalFeeAmount,
        insuranceFeeAmount,
        securityDepositAmount,
        
        // Formatted strings for display
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

    const totalAmount = rentalFeeAmount + insuranceFeeAmount + securityDepositAmount;
    const passedTotal = parsePrice(total);

    if (totalAmount !== passedTotal) {
        console.warn("Total mismatch detected!");
        console.warn("Our calculation:", totalAmount);
        console.warn("Passed from prev screen:", passedTotal);
    } else {
        console.log("Total verification passed:", totalAmount);
    }

    const afterBalance = safeBalance - totalAmount;
    const isSufficient = afterBalance >= 0;
    const totalAmountFormatted = `${totalAmount.toLocaleString('vi-VN')}đ`;

    console.log("Frontend pricing breakdown:", {
        holidaySurcharge,
        holidayDayCount,
        membershipDiscountPercentage,
        membershipDiscountAmount,
        membershipTier,
        baseRentalFee,
        rentingRate,
        averageRentalPrice,
        totalAmount,
    });

    const parseDateString = (isoDate: string | null, displayDate: string): Date => {
        try {
            if (isoDate && isoDate.includes('-')) {
                console.log('Parsing as ISO string:', isoDate);
                
                const timeMatch = displayDate.match(/(\d+):(\d+)\s*(AM|PM|SA|CH)/i);
                if (!timeMatch) {
                    throw new Error(`Cannot extract time from: ${displayDate}`);
                }
                
                const [, hoursStr, minutes, period] = timeMatch;
                let hours = parseInt(hoursStr, 10);
                
                const isPM = period.toUpperCase() === 'PM' || period.toUpperCase() === 'CH';
                const isAM = period.toUpperCase() === 'AM' || period.toUpperCase() === 'SA';
                
                if (isPM && hours !== 12) hours += 12;
                if (isAM && hours === 12) hours = 0;
                
                const date = new Date(isoDate);
                date.setHours(hours, parseInt(minutes, 10), 0, 0);
                
                console.log("Parsed date successfully:", {
                    isoDate,
                    displayDate,
                    result: date.toISOString(),
                });
                
                return date;
            }
            
            console.warn('ISO date not available, trying Vietnamese format:', displayDate);
            
            const monthNames: { [key: string]: number } = {
                "Tháng 1": 0, "Tháng 2": 1, "Tháng 3": 2, "Tháng 4": 3,
                "Tháng 5": 4, "Tháng 6": 5, "Tháng 7": 6, "Tháng 8": 7,
                "Tháng 9": 8, "Tháng 10": 9, "Tháng 11": 10, "Tháng 12": 11
            };

            const match = displayDate.match(/(Tháng \d+)\s+(\d+)\s+(\d+):(\d+)\s*(AM|PM|SA|CH)/i);
            if (!match) {
                throw new Error(`Cannot parse Vietnamese date: ${displayDate}`);
            }

            const [, monthStr, day, hours, minutes, period] = match;
            const monthIndex = monthNames[monthStr];
            
            if (monthIndex === undefined) {
                throw new Error(`Invalid month: ${monthStr}`);
            }

            let hour = parseInt(hours, 10);
            const isPM = period.toUpperCase() === 'PM' || period.toUpperCase() === 'CH';
            const isAM = period.toUpperCase() === 'AM' || period.toUpperCase() === 'SA';
            
            if (isPM && hour !== 12) hour += 12;
            if (isAM && hour === 12) hour = 0;

            const year = new Date().getFullYear();
            const date = new Date(year, monthIndex, parseInt(day, 10), hour, parseInt(minutes, 10), 0, 0);
            
            console.log("Parsed Vietnamese date:", {
                input: displayDate,
                output: date.toISOString(),
            });
            
            return date;
        } catch (error: any) {
            console.error("Date parsing failed:", error.message);
            throw new Error(`Invalid date format: ${displayDate}`);
        }
    };

    const handlePayment = async () => {
        if (!userId) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập");
            return;
        }

        try {
            const startDateTime = parseDateString(startDateISO, startDateDisplay);
            const endDateTime = parseDateString(endDateISO, endDateDisplay);

            let finalInsurancePackageId: string | undefined = undefined;
            
            if (insurancePlanId && insurancePlanId !== "none") {
                if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(insurancePlanId)) {
                    finalInsurancePackageId = insurancePlanId;
                } else {
                    console.warn("Invalid insurance package ID format:", insurancePlanId);
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
                depositAmount: securityDepositAmount,
                rentingRate: rentingRate,
                averageRentalPrice: averageRentalPrice,
                insurancePackageId: finalInsurancePackageId,
                totalRentalFee: rentalFeeAmount,
            };

            console.log("Sending to backend:", JSON.stringify(bookingInput, null, 2));

            if (selectedPaymentMethod === "wallet") {
                const booking = await createBooking(bookingInput);
                await refreshWallet();

                console.log("Wallet booking created:", {
                    id: booking.id,
                    bookingCode: booking.bookingCode,
                    status: booking.bookingStatus,
                });

                const contractNumber = booking.bookingCode || booking.id;
                
                if (!booking.bookingCode) {
                    console.warn("No bookingCode returned, using booking ID instead");
                }

                navigation.replace("DigitalContract", {
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl: vehicleImageUrl || "",
                    startDate: startDateDisplay,
                    endDate: endDateDisplay,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit: `${securityDepositAmount.toLocaleString()}đ`,
                    contractNumber: contractNumber,
                });
            } 
            else if (selectedPaymentMethod === "vnpay") {
                const result = await container.booking.create.vnpay.execute(bookingInput);

                console.log("VNPay booking created:", {
                    bookingId: result.booking.id,
                    vnpayUrl: result.vnpayUrl,
                });

                const context: BookingContext = {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate: startDateDisplay,
                    endDate: endDateDisplay,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit: `${securityDepositAmount.toLocaleString()}đ`,
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
                    startDate: startDateDisplay,
                    endDate: endDateDisplay,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    securityDeposit: `${securityDepositAmount.toLocaleString()}đ`,
                });
            } 
            else if (selectedPaymentMethod === "zalopay") {
                console.log("Creating ZaloPay booking...");
                
                const result = await container.booking.create.zalopay.execute(bookingInput);

                console.log("ZaloPay booking created:", {
                    bookingId: result.booking.id,
                    zaloPayUrl: result.vnpayUrl,
                });

                const context: BookingContext = {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate: startDateDisplay,
                    endDate: endDateDisplay,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit: `${securityDepositAmount.toLocaleString()}đ`,
                };

                const STORAGE_KEY = `zalopay_payment_context_${result.booking.id}`;
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(context));

                navigation.navigate("ZaloPayResult", {
                    bookingId: result.booking.id,
                    vehicleId,
                    vehicleName,
                    vehicleImageUrl,
                    startDate: startDateDisplay,
                    endDate: endDateDisplay,
                    duration,
                    rentalDays,
                    branchName,
                    insurancePlan,
                    totalAmount: totalAmountFormatted,
                    securityDeposit: `${securityDepositAmount.toLocaleString()}đ`,
                });

                setTimeout(async () => {
                    console.log("Opening ZaloPay app with URL:", result.vnpayUrl);
                    
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
            console.error("Payment failed:", error);
            Alert.alert("Lỗi thanh toán", error.message || "Đã xảy ra lỗi khi xử lý thanh toán");
        }
    };

    const getButtonTitle = (): string => {
        if (bookingLoading) {
            return "Đang xử lý...";
        }
        return `Thanh toán ${totalAmountFormatted}`;
    };

    return (
        <View style={styles.container}>
            <PageHeader title="Xác nhận thanh toán" onBack={() => navigation.goBack()} />
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView} 
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <BookingSummaryCard
                    vehicleName={vehicleName}
                    rentalPeriod={`${startDateDisplay} - ${endDateDisplay}`}
                    duration={duration}
                    branchName={branchName}
                    insurancePlan={insurancePlan}
                />

                {/* NEW: Unified PricingBreakdown Component (Simple Mode) */}
                <PricingBreakdown
                    // Rental subtotal
                    rentalSubtotal={rentalFeeAmount}
                    
                    // Surcharges
                    holidaySurcharge={holidaySurcharge > 0 ? {
                        amount: holidaySurcharge,
                        dayCount: holidayDayCount,
                    } : undefined}
                    
                    // Insurance
                    insuranceFee={insuranceFeeAmount}
                    insuranceName={insurancePlan}
                    
                    // Deposit
                    securityDeposit={securityDepositAmount}
                    
                    // Total
                    total={totalAmount}
                    
                    // Simple breakdown
                    showDetailedBreakdown={false}
                />

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Chọn phương thức thanh toán</Text>
                    
                    <PaymentMethodCard
                        isSelected={selectedPaymentMethod === "wallet"}
                        onSelect={() => setSelectedPaymentMethod("wallet")}
                        currentBalance={`${safeBalance.toLocaleString()}đ`}
                        afterBalance={`${afterBalance.toLocaleString()}đ`}
                        isSufficient={isSufficient}
                    />

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

                <PaymentNotices />
            </ScrollView>

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
        </View>
    );
};

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
        paddingBottom: 32,
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