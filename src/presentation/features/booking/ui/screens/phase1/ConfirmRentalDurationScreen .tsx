import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DateHelper } from "../../../../../../domain/helpers/DateHelper";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useRentalDuration } from "../../../hooks/useRentalDuration";
import { useRentalPricing } from "../../../hooks/useRentalPricing";
import { VehicleCategory } from "../../../hooks/useRentingRate";
import { DateTimeSelector } from "../../molecules/DateTimeSelector";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { PricingBreakdown } from "../../organisms/booking/PricingBreakdown";

type RoutePropType = RouteProp<BookingStackParamList, 'ConfirmRentalDuration'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'ConfirmRentalDuration'>;
// Helper to convert ISO string back to Date for PricingBreakdown
const convertToDate = (dateString: string): Date => {
    return new Date(dateString);
};

export const ConfirmRentalDurationScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const {
        vehicleId,
        vehicleName,
        vehicleImageUrl,
        branchId,
        branchName,
        pricePerDay,
        securityDeposit,
        branchOpenTime,
        branchCloseTime,
        vehicleCategory,
        dateRange,
    } = route.params;
    const navigation = useNavigation<NavigationPropType>();

    const convertTo12HourFormat = (time24: string): string => {
        const [hourStr, minute] = time24.split(':');
        let hour = parseInt(hourStr);
        const period = hour >= 12 ? 'CH' : 'SA';
        
        if (hour > 12) {
            hour -= 12;
        } else if (hour === 0) {
            hour = 12;
        }
        
        return `${hour}:${minute} ${period}`;
    };

    const branchOpenTimeSACH = branchOpenTime ? convertTo12HourFormat(branchOpenTime) : "6:00 SA";
    const branchCloseTimeSACH = branchCloseTime ? convertTo12HourFormat(branchCloseTime) : "10:00 CH";

    const initialDateRangeISO = useMemo(() => {
        if (dateRange) {
            // console.log('📅 Parsing Vietnamese dateRange:', dateRange);
            return DateHelper.parseVietnameseDateRangeToISO(dateRange);
        }
        // console.log('📅 Using default dateRange');
        return DateHelper.getDefaultDateRangeForBooking();
    }, [dateRange]);

    const {
        startDate,
        endDate,
        duration,
        totalHours,
        startDateTime,
        endDateTime,
        startDateISO,
        endDateISO,
        durationError,
        isValid,
        handleDateRangeChange,
        validateCurrentDuration,
    } = useRentalDuration(initialDateRangeISO);

    const category = (vehicleCategory?.toUpperCase() || "ECONOMY") as VehicleCategory;

    const {
        rentingRate,
        discountPercentage,
        durationType,
        membershipDiscountPercentage,
        membershipTier,
        membershipDiscountAmount,
        
        // 4-Component System
        startPartial,
        startPartialAmount,
        normalFullDays,
        normalFullDaysAmount,
        holidayFullDays,
        holidayFullDaysAmount,
        endPartial,
        endPartialAmount,
        
        // Legacy
        holidaySurcharge,
        baseRentalFee,
        discountAmount,
        totalRentalFee,
        averageRentalPrice,
        loading,
    } = useRentalPricing(
        startDateTime,
        endDateTime,
        pricePerDay,
        totalHours,
        category
    );

    const total = useMemo(() => totalRentalFee + securityDeposit, [totalRentalFee, securityDeposit]);
    const hasDiscount = discountPercentage > 0;

    const displayDays = Math.floor(totalHours / 24);
    const displayHours = Math.floor(totalHours % 24);
    
    // console.log("📊 4-Component Rental:", {
    //     category,
    //     totalHours,
    //     displayDays,
    //     displayHours,
    //     components: {
    //         startPartial: startPartialAmount,
    //         normalFullDays: normalFullDaysAmount,
    //         holidayFullDays: holidayFullDaysAmount,
    //         endPartial: endPartialAmount,
    //     },
    //     total: totalRentalFee,
    // });

    const handleBack = () => {
        navigation.goBack();
    };

    const handleContinue = () => {
        if (!validateCurrentDuration()) {
            // console.warn("Cannot continue with invalid duration");
            return;
        }

        // console.log("Continuing to insurance plans for vehicle:", vehicleId);
        navigation.navigate('InsurancePlans', { 
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            branchId,
            branchName,
            pricePerDay,
            securityDeposit,
            
            startDateISO: startDateISO,
            endDateISO: endDateISO,
            
            startDateDisplay: startDate,
            endDateDisplay: endDate,
            
            duration,
            rentalDays: displayDays,
            rentalHours: displayHours,
            
            rentalFeeAmount: totalRentalFee,
            baseRentalFee,
            rentingRate,
            averageRentalPrice,
            
            vehicleCategory: category,
            holidaySurcharge,
            membershipDiscountPercentage,
            membershipDiscountAmount,
            membershipTier,
            
            discountPercentage: hasDiscount ? discountPercentage : 0,
            discountAmount: hasDiscount ? discountAmount : 0,
            durationType: durationType,
            
            // 4-Component Data
            startPartial: startPartial ? {
                date: startPartial.date.toISOString(),
                hours: startPartial.hours,
                isHoliday: startPartial.isHoliday,
                holiday: startPartial.holiday ? {
                    holidayName: startPartial.holiday.holidayName,
                    priceMultiplier: startPartial.holiday.priceMultiplier,
                } : undefined,
                basePrice: startPartial.basePrice,
                surchargeAmount: startPartial.surchargeAmount,
                totalPrice: startPartial.totalPrice,
                type: startPartial.type,
            } : null,
            startPartialAmount,
            normalFullDays,
            normalFullDaysAmount,
            holidayFullDays: holidayFullDays.map(day => ({
                date: day.date.toISOString(),
                holiday: {
                    holidayName: day.holiday.holidayName,
                    priceMultiplier: day.holiday.priceMultiplier,
                },
                basePrice: day.basePrice,
                surchargeAmount: day.surchargeAmount,
                totalPrice: day.totalPrice,
            })),
            holidayFullDaysAmount,
            endPartial: endPartial ? {
                date: endPartial.date.toISOString(),
                hours: endPartial.hours,
                isHoliday: endPartial.isHoliday,
                holiday: endPartial.holiday ? {
                    holidayName: endPartial.holiday.holidayName,
                    priceMultiplier: endPartial.holiday.priceMultiplier,
                } : undefined,
                basePrice: endPartial.basePrice,
                surchargeAmount: endPartial.surchargeAmount,
                totalPrice: endPartial.totalPrice,
                type: endPartial.type,
            } : null,
            endPartialAmount,
        });
    };
    
    const isContinueDisabled = loading || !isValid;
    
    return (
        <SafeAreaView style={styles.container}>
            <PageHeader title="Thời gian thuê" onBack={handleBack} />
            <ProgressIndicator currentStep={1} totalSteps={4} />

            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <DateTimeSelector
                    startDate={startDate}
                    endDate={endDate}
                    duration={duration}
                    onDateRangeChange={handleDateRangeChange}
                    branchName={branchName}
                    branchOpenTime={branchOpenTimeSACH}
                    branchCloseTime={branchCloseTimeSACH}
                    startDateISO={startDateISO}
                    endDateISO={endDateISO}
                />

                {durationError && (
                    <View style={styles.errorBanner}>
                        <View style={styles.errorIconContainer}>
                            <Text style={styles.errorIcon}>⚠️</Text>
                        </View>
                        <View style={styles.errorContent}>
                            <Text style={styles.errorTitle}>Thời gian không hợp lệ</Text>
                            <Text style={styles.errorText}>{durationError}</Text>
                        </View>
                    </View>
                )}
                
                <PricingBreakdown
                    originalPricePerDay={pricePerDay}
                    averagePricePerDay={averageRentalPrice}
                    
                    // 4-Component System
                    startPartial={startPartial}
                    startPartialAmount={startPartialAmount}
                    normalFullDays={normalFullDays}
                    normalFullDaysAmount={normalFullDaysAmount}
                    holidayFullDays={holidayFullDays}
                    holidayFullDaysAmount={holidayFullDaysAmount}
                    endPartial={endPartial}
                    endPartialAmount={endPartialAmount}
                    
                    configDiscount={hasDiscount && durationType !== "daily" ? {
                        percentage: discountPercentage,
                        amount: discountAmount,
                        type: durationType as "monthly" | "yearly",
                        appliesTo: "all",
                    } : undefined}
                    membershipDiscount={{
                        percentage: membershipDiscountPercentage,
                        amount: membershipDiscountAmount,
                        tier: membershipTier,
                    }}
                    
                    rentalSubtotal={totalRentalFee}
                    insuranceFee={0}
                    insuranceName="Phí bảo hiểm (chưa chọn)"
                    securityDeposit={securityDeposit}
                    total={total}
                    showDetailedBreakdown={true}
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton 
                    title="Tiếp tục" 
                    onPress={handleContinue}
                    disabled={isContinueDisabled}
                />
            </View>
        </SafeAreaView>
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
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    errorBanner: {
        backgroundColor: "#2e1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    errorIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ef444420",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    errorIcon: {
        fontSize: 20,
    },
    errorContent: {
        flex: 1,
    },
    errorTitle: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 4,
    },
    errorText: {
        color: "#fca5a5",
        fontSize: 13,
    },
});