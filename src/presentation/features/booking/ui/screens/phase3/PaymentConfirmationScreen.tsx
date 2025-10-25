import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, View } from "react-native";
import sl from "../../../../../../core/di/InjectionContainer";
import { CreateBookingUseCase } from "../../../../../../domain/usecases/booking/CreateBookingUseCase";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useAppSelector } from "../../../../authentication/store/hooks";
import { useCreateBooking } from "../../../hooks/useCreateBooking";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummaryCard } from "../../organisms/BookingSummaryCard";
import { CostBreakdown } from "../../organisms/CostBreakdown";
import { PaymentMethodCard } from "../../organisms/PaymentMethodCard";
import { PaymentNotices } from "../../organisms/PaymentNotices";

type RoutePropType = RouteProp<BookingStackParamList, 'PaymentConfirmation'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'PaymentConfirmation'>;

export const PaymentConfirmationScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    
    const {
        vehicleId,
        startDate,
        endDate,
        duration,
        rentalDays,
        branchName,
        insurancePlan,
        rentalFee,
        insuranceFee,
        securityDeposit,
        serviceFee,
        total,
    } = route.params;

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("wallet");

    // ✅ Get user from Redux
    const user = useAppSelector((state) => state.auth.user);
    const userId = user?.id;

    // ✅ Get booking use case
    const createBookingUseCase = useMemo(() => 
        sl.get<CreateBookingUseCase>("CreateBookingUseCase"), 
        []
    );
    
    const { createBooking, loading: bookingLoading, error: bookingError } = useCreateBooking(createBookingUseCase);

    const handleBack = () => {
        navigation.goBack();
    };

    // ✅ Parse date strings to Date objects
    const parseDateString = (dateStr: string): Date => {
        // "Nov 02 6:00 PM" format
        const months: { [key: string]: number } = {
            Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
            Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
        };
        
        const match = dateStr.match(/(\w+)\s+(\d+)\s+(\d+):(\d+)\s*(AM|PM)/);
        if (!match) return new Date();
        
        const [, month, day, hours, minutes, period] = match;
        let hour = parseInt(hours);
        
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;
        
        const year = new Date().getFullYear();
        return new Date(year, months[month], parseInt(day), hour, parseInt(minutes));
    };

    const parsePrice = (price: string): number => {
        return parseInt(price.replace(/[^0-9]/g, "")) || 0;
    };

    const handlePayment = async () => {
        console.log("Processing payment for vehicle:", vehicleId);
        console.log("Total amount:", total);

        // ✅ Validate user is logged in
        if (!userId) {
            Alert.alert("Error", "Please log in to continue booking");
            return;
        }

        try {
            const startDateTime = parseDateString(startDate);
            const endDateTime = parseDateString(endDate);
            
            // ✅ Log parsed dates
            console.log("📅 Start:", startDate, "→", startDateTime.toISOString());
            console.log("📅 End:", endDate, "→", endDateTime.toISOString());

            const bookingData = {
                vehicleModelId: vehicleId,
                startDatetime: startDateTime,
                endDatetime: endDateTime,
                rentalDays: rentalDays,
                rentalHours: 0,
                baseRentalFee: parsePrice(rentalFee),
                depositAmount: parsePrice(securityDeposit),
                rentingRate: 1.0,
                averageRentalPrice: parsePrice(rentalFee) / rentalDays,
                totalRentalFee: parsePrice(total),
                renterId: userId, // ✅ Use actual user ID
            };

            // ✅ Log complete booking data
            console.log("📦 Booking Data:", JSON.stringify(bookingData, null, 2));

            // ✅ Create booking via API
            const booking = await createBooking(bookingData);

            console.log("✅ Booking created:", booking.id);

            // ✅ Navigate to completion screen
            navigation.navigate('DigitalContract', {
                vehicleId,
                vehicleName: "VinFast Evo200",
                startDate,
                endDate,
                duration,
                rentalDays,
                branchName,
                insurancePlan,
                totalAmount: total,
                securityDeposit,
                contractNumber: booking.id,
            });
        } catch (err: any) {
            console.error("❌ Booking creation failed:", err);
            console.error("❌ Error details:", err.response?.data || err.message);
            Alert.alert(
                "Booking Failed",
                err.message || "Unable to create booking. Please try again.",
                [{ text: "OK" }]
            );
        }
    };
    
    const totalAmount = parsePrice(total);
    const currentBalance = 5000000;
    const afterBalance = currentBalance - totalAmount;
    const isSufficient = afterBalance >= 0;

    return (
        <View style={styles.container}>
            <PageHeader title="Payment Confirmation" onBack={handleBack} />
            <ProgressIndicator currentStep={3} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <BookingSummaryCard
                    vehicleName="VinFast Evo200"
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
                    title={bookingLoading ? "Processing..." : `Pay ${total} with Wallet`}
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