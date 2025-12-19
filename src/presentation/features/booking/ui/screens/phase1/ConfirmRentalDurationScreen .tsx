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

    /**
     * Convert 24-hour time to Vietnamese 12-hour format (SA/CH)
     */
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

    /**
     * Parse initial date range from route params or use defaults
     */
    const initialDateRangeISO = useMemo(() => {
        if (dateRange) {
            console.log('📅 Parsing Vietnamese dateRange:', dateRange);
            return DateHelper.parseVietnameseDateRangeToISO(dateRange);
        }
        console.log('📅 Using default dateRange');
        return DateHelper.getDefaultDateRangeForBooking();
    }, [dateRange]);

    /**
     * Use rental duration hook for state management and validation
     */
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

    /**
     * Use rental pricing hook for progressive tier hourly pricing
     */
    const {
        rentingRate,
        discountPercentage,
        durationType,
        progressiveTierBreakdown,
        membershipDiscountPercentage,
        membershipTier,
        membershipDiscountAmount,
        holidayDays,
        holidaySurcharge,
        hasHolidaySurcharge,
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
    const hasMembershipDiscount = membershipDiscountPercentage > 0;

    // Calculate display days for booking summary
    const displayDays = Math.floor(totalHours / 24);
    const displayHours = Math.floor(totalHours % 24);
    const rentalDurationText = displayHours > 0 
        ? `${displayDays} Ngày ${displayHours} Giờ` 
        : `${displayDays} Ngày`;
    
    console.log("📊 Rental calculation:", {
        category,
        totalHours,
        displayDays,
        durationType,
        rentingRate,
        discountPercentage: `${discountPercentage}%`,
        progressiveTiers: progressiveTierBreakdown,
        membershipTier,
        membershipDiscountPercentage: `${membershipDiscountPercentage}%`,
        membershipDiscountAmount,
        holidayDays: holidayDays.length,
        holidaySurcharge,
        baseRentalFee,
        totalRentalFee,
        discountAmount,
    });

    const handleBack = () => {
        navigation.goBack();
    };

    /**
     * Navigate to insurance plans with final validation
     */
    const handleContinue = () => {
        if (!validateCurrentDuration()) {
            console.warn("Cannot continue with invalid duration");
            return;
        }

        console.log("Continuing to insurance plans for vehicle:", vehicleId);
        navigation.navigate('InsurancePlans', { 
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            branchId,
            branchName,
            pricePerDay,
            securityDeposit,
            
            // Pass ISO strings for backend
            startDateISO: startDateISO,
            endDateISO: endDateISO,
            
            // Pass display strings for UI
            startDateDisplay: startDate,
            endDateDisplay: endDate,
            
            duration,
            rentalDays: displayDays,
            
            // Pass numbers (not formatted strings)
            rentalFeeAmount: totalRentalFee,
            baseRentalFee,
            rentingRate,
            averageRentalPrice,
            
            vehicleCategory: category,
            holidaySurcharge,
            holidayDayCount: holidayDays.length,
            membershipDiscountPercentage,
            membershipDiscountAmount,
            membershipTier,
            
            // Pass discount info for detailed breakdown
            discountPercentage: hasDiscount ? discountPercentage : 0,
            discountAmount: hasDiscount ? discountAmount : 0,
            durationType: durationType,
            
            // NEW: Pass individual holiday days with breakdown data
            holidays: holidayDays.map(day => ({
                name: day.holiday.holidayName,
                count: 1,
                surchargePercentage: Math.round((day.holiday.priceMultiplier - 1) * 100),
                baseAfterDiscount: day.basePrice,        // The 126,000đ
                surchargeAmount: day.surchargeAmount,    // The +63,000đ
                totalPricePerDay: day.totalPrice,        // The 189,000đ
            })),
        });
    };

    /**
     * UI Helper Functions
     */
    const getCategoryLabel = (cat: VehicleCategory): string => {
        switch (cat) {
            case "ECONOMY": return "Phổ thông";
            case "STANDARD": return "Trung cấp";
            case "PREMIUM": return "Cao cấp";
            default: return cat;
        }
    };

    const getMembershipIcon = (tier: string): string => {
        switch (tier.toUpperCase()) {
            case "BRONZE": return "🥉";
            case "SILVER": return "🥈";
            case "GOLD": return "🥇";
            case "PLATINUM": return "💎";
            case "DIAMOND": return "👑";
            default: return "🥉";
        }
    };
    
    // Determine if continue button should be disabled
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
                
                {/* NEW: Unified PricingBreakdown with all banners merged inside */}
                <PricingBreakdown
                    // Per-day pricing
                    originalPricePerDay={pricePerDay}
                    averagePricePerDay={averageRentalPrice}
                    
                    // Base rental
                    baseRentalFee={baseRentalFee}
                    rentalDays={displayDays}
                    
                    // Discounts with full details
                    configDiscount={hasDiscount && durationType !== "daily" ? {
                        percentage: discountPercentage,
                        amount: discountAmount,
                        type: durationType as "monthly" | "yearly",
                        discountedDays: Math.floor(progressiveTierBreakdown.discountedHours / 24),
                        regularDays: Math.ceil(progressiveTierBreakdown.regularHours / 24),
                    } : undefined}
                    
                    membershipDiscount={{
                        percentage: membershipDiscountPercentage,
                        amount: membershipDiscountAmount,
                        tier: membershipTier,
                    }}
                    
                    // Holiday surcharge with individual day breakdown
                    holidaySurcharge={hasHolidaySurcharge ? {
                        amount: holidaySurcharge,
                        dayCount: holidayDays.length,
                        holidays: holidayDays.map(day => ({
                            name: day.holiday.holidayName,
                            count: 1,
                            surchargePercentage: Math.round((day.holiday.priceMultiplier - 1) * 100),
                            baseAfterDiscount: day.basePrice,
                            surchargeAmount: day.surchargeAmount,
                            totalPricePerDay: day.totalPrice,
                        })),
                    } : undefined}
                    
                    // Rental subtotal
                    rentalSubtotal={totalRentalFee}
                    
                    // Additional fees
                    insuranceFee={0}
                    insuranceName="Phí bảo hiểm (chưa chọn)"
                    securityDeposit={securityDeposit}
                    
                    // Final total
                    total={total}
                    
                    // Show full breakdown on this screen
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