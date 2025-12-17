import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { DateHelper } from "../../../../../../domain/helpers/DateHelper";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useRentalDuration } from "../../../hooks/useRentalDuration";
import { useRentalPricing } from "../../../hooks/useRentalPricing";
import { VehicleCategory } from "../../../hooks/useRentingRate";
import { DateTimeSelector } from "../../molecules/DateTimeSelector";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummary } from "../../organisms/booking/BookingSummary";
import { SafeAreaView } from "react-native-safe-area-context";

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
    
    const [isHolidayListExpanded, setIsHolidayListExpanded] = useState(false);

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
        totalHours, // For hourly pricing
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
        totalHours, // Pass total hours for hourly pricing
        category
    );

    const total = useMemo(() => totalRentalFee + securityDeposit, [totalRentalFee, securityDeposit]);
    const hasDiscount = discountPercentage > 0;
    const hasMembershipDiscount = membershipDiscountPercentage > 0;

    // Calculate display days for booking summary
    // const displayDays = Math.ceil(totalHours / 24);
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
        // Final validation before navigation
        if (!validateCurrentDuration()) {
            console.warn("⚠️ Cannot continue with invalid duration");
            return;
        }

        console.log("✅ Continuing to insurance plans for vehicle:", vehicleId);
        navigation.navigate('InsurancePlans', { 
            vehicleId,
            vehicleName,
            vehicleImageUrl,
            branchId,
            branchName,
            pricePerDay,
            securityDeposit,
            startDate,
            endDate,
            duration,
            rentalDays: displayDays,
            rentalPrice: totalRentalFee,
            baseRentalFee,
            rentingRate,
            averageRentalPrice,
            vehicleCategory: category,
            holidaySurcharge,
            holidayDayCount: holidayDays.length,
            membershipDiscountPercentage,
            membershipDiscountAmount,
            membershipTier,
        });
    };

    /**
     * UI Helper Functions
     */
    const getDiscountLabel = (): string => {
        if (durationType === "monthly") return "Giảm giá thuê tháng";
        if (durationType === "yearly") return "Giảm giá thuê năm";
        return "";
    };

    const getCategoryLabel = (cat: VehicleCategory): string => {
        switch (cat) {
            case "ECONOMY": return "Phổ thông";
            case "STANDARD": return "Trung cấp";
            case "PREMIUM": return "Cao cấp";
            default: return cat;
        }
    };

    const getMembershipTierLabel = (tier: string): string => {
        switch (tier.toUpperCase()) {
            case "BRONZE": return "Đồng";
            case "SILVER": return "Bạc";
            case "GOLD": return "Vàng";
            case "PLATINUM": return "Bạch Kim";
            case "DIAMOND": return "Kim Cương";
            default: return tier;
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

    const getMaxMultiplierPercentage = (): number => {
        if (holidayDays.length === 0) return 0;
        const maxMultiplier = Math.max(...holidayDays.map(h => h.holiday.priceMultiplier));
        return Math.round((maxMultiplier - 1) * 100);
    };

    const getGroupedHolidays = (): { 
        name: string; 
        count: number; 
        surchargePercentage: number; 
        totalPricePerDay: number;
        totalSurcharge: number;
    }[] => {
        const grouped = holidayDays.reduce((acc, day) => {
            const name = day.holiday.holidayName;
            if (!acc[name]) {
                acc[name] = {
                    name,
                    count: 0,
                    surchargePercentage: Math.round((day.holiday.priceMultiplier - 1) * 100),
                    totalPricePerDay: day.totalPrice, // Base + surcharge for one day
                    totalSurcharge: 0,
                };
            }
            acc[name].count++;
            acc[name].totalSurcharge += day.surchargeAmount;
            return acc;
        }, {} as Record<string, { 
            name: string; 
            count: number; 
            surchargePercentage: number; 
            totalPricePerDay: number;
            totalSurcharge: number;
        }>);
        
        return Object.values(grouped);
    };

    const toggleHolidayList = () => {
        setIsHolidayListExpanded(!isHolidayListExpanded);
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

                <View style={styles.membershipIndicator}>
                    <Text style={styles.membershipIndicatorIcon}>
                        {getMembershipIcon(membershipTier)}
                    </Text>
                    <Text style={styles.membershipIndicatorText}>
                        Hạng thành viên: {getMembershipTierLabel(membershipTier)}
                    </Text>
                    {membershipDiscountPercentage > 0 && (
                        <View style={styles.membershipDiscountBadge}>
                            <Text style={styles.membershipDiscountBadgeText}>
                                -{membershipDiscountPercentage}%
                            </Text>
                        </View>
                    )}
                </View>

                {hasDiscount && (
                    <View style={styles.discountBanner}>
                        <View style={styles.discountIconContainer}>
                            <Text style={styles.discountIcon}>🎉</Text>
                        </View>
                        <View style={styles.discountContent}>
                            <Text style={styles.discountTitle}>{getDiscountLabel()}</Text>
                            <Text style={styles.discountText}>
                                Giảm {discountPercentage}% cho xe {getCategoryLabel(category)}
                            </Text>
                            {progressiveTierBreakdown.discountTier !== "none" && (
                                <Text style={styles.discountDetails}>
                                    {Math.floor(progressiveTierBreakdown.discountedHours / 24)} ngày giảm giá, {" "}
                                    {Math.ceil(progressiveTierBreakdown.regularHours / 24)} ngày giá thường
                                </Text>
                            )}
                            <Text style={styles.discountSavings}>
                                Tiết kiệm: {discountAmount.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                )}

                {hasMembershipDiscount && (
                    <View style={styles.membershipBanner}>
                        <View style={styles.membershipIconContainer}>
                            <Text style={styles.membershipIcon}>👑</Text>
                        </View>
                        <View style={styles.membershipContent}>
                            <Text style={styles.membershipTitle}>
                                Ưu đãi thành viên {getMembershipTierLabel(membershipTier)}
                            </Text>
                            <Text style={styles.membershipText}>
                                Giảm thêm {membershipDiscountPercentage}% cho đơn hàng
                            </Text>
                            <Text style={styles.membershipSavings}>
                                Tiết kiệm: {membershipDiscountAmount.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                )}

                {hasHolidaySurcharge && (
                    <View style={styles.holidayBanner}>
                        <View style={styles.holidayHeader}>
                            <View style={styles.holidayIconContainer}>
                                <Text style={styles.holidayIcon}>🎊</Text>
                            </View>
                            <View style={styles.holidayHeaderText}>
                                <Text style={styles.holidayTitle}>Phụ thu ngày lễ</Text>
                                <Text style={styles.holidaySummary}>
                                    {holidayDays.length} ngày lễ (+{getMaxMultiplierPercentage()}%)
                                </Text>
                            </View>
                            <View style={styles.holidayRightSection}>
                                <Text style={styles.holidaySurchargeAmount}>
                                    +{holidaySurcharge.toLocaleString()}đ
                                </Text>
                                <TouchableOpacity 
                                    onPress={toggleHolidayList}
                                    activeOpacity={0.7}
                                    style={styles.holidayToggleButton}
                                >
                                    <Text style={styles.holidayToggleText}>
                                        {isHolidayListExpanded ? 'Ẩn đi' : 'Xem thêm'}
                                    </Text>
                                    <Text style={styles.holidayToggleIcon}>
                                        {isHolidayListExpanded ? '▲' : '▼'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        
                        {isHolidayListExpanded && (
                            <View style={styles.holidayList}>
                                {getGroupedHolidays().map((item, index) => (
                                    <View key={index} style={styles.holidayListItem}>
                                        <View style={styles.holidayItemContent}>
                                            <Text style={styles.holidayItemName}>
                                                • {item.name} {item.count > 1 ? `(${item.count} ngày)` : ''}
                                            </Text>
                                            <Text style={styles.holidayItemSurcharge}>
                                                Phụ thu {item.surchargePercentage}%
                                            </Text>
                                        </View>
                                        <Text style={styles.holidayItemTotal}>
                                            {item.totalPricePerDay.toLocaleString()}đ/ngày
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                )}
                
                <BookingSummary
                    rentalDays={displayDays}
                    rentalDurationText={rentalDurationText}
                    rentalPrice={`${totalRentalFee.toLocaleString()}đ`}
                    securityDeposit={`${securityDeposit.toLocaleString()}đ`}
                    total={`${total.toLocaleString()}đ`}
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
    membershipIndicator: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#1a1a1a",
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: "flex-start",
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    membershipIndicatorIcon: {
        fontSize: 14,
        marginRight: 6,
    },
    membershipIndicatorText: {
        color: "#999",
        fontSize: 12,
        fontWeight: "500",
    },
    membershipDiscountBadge: {
        backgroundColor: "#6366f1",
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        marginLeft: 8,
    },
    membershipDiscountBadgeText: {
        color: "#fff",
        fontSize: 10,
        fontWeight: "700",
    },
    discountBanner: {
        backgroundColor: "#1a2e1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#22c55e",
    },
    discountIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#22c55e20",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    discountIcon: {
        fontSize: 24,
    },
    discountContent: {
        flex: 1,
    },
    discountTitle: {
        color: "#22c55e",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    discountText: {
        color: "#86efac",
        fontSize: 13,
        marginBottom: 4,
    },
    discountDetails: {
        color: "#86efac",
        fontSize: 12,
        marginBottom: 4,
        fontStyle: "italic",
    },
    discountSavings: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    membershipBanner: {
        backgroundColor: "#1a1a2e",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#6366f1",
    },
    membershipIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: "#6366f120",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    membershipIcon: {
        fontSize: 24,
    },
    membershipContent: {
        flex: 1,
    },
    membershipTitle: {
        color: "#6366f1",
        fontSize: 14,
        fontWeight: "700",
        marginBottom: 2,
    },
    membershipText: {
        color: "#a5b4fc",
        fontSize: 13,
        marginBottom: 4,
    },
    membershipSavings: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    holidayBanner: {
        backgroundColor: "#2e1a1a",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#ef4444",
    },
    holidayHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    holidayIconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#ef444420",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    holidayIcon: {
        fontSize: 20,
    },
    holidayHeaderText: {
        flex: 1,
    },
    holidayTitle: {
        color: "#ef4444",
        fontSize: 14,
        fontWeight: "700",
    },
    holidaySummary: {
        color: "#fca5a5",
        fontSize: 12,
        marginTop: 2,
    },
    holidaySurchargeAmount: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "700",
    },
    holidayRightSection: {
        alignItems: "flex-end",
    },
    holidayToggleButton: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },
    holidayToggleText: {
        color: "#fca5a5",
        fontSize: 12,
        fontWeight: "500",
        marginRight: 4,
    },
    holidayToggleIcon: {
        color: "#fca5a5",
        fontSize: 9,
    },
    holidayList: {
        marginTop: 8,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: "#ef444440",
    },
    holidayListItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingVertical: 8,
    },
    holidayItemContent: {
        flex: 1,
        marginRight: 12,
    },
    holidayItemName: {
        color: "#fca5a5",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 4,
    },
    holidayItemSurcharge: {
        color: "#fca5a5",
        fontSize: 11,
        opacity: 0.7,
    },
    holidayItemTotal: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
        textAlign: "right",
    },
});