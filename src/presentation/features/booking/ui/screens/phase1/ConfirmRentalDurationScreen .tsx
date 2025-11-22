import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { useRentalPricing } from "../../../hooks/useRentalPricing";
import { VehicleCategory } from "../../../hooks/useRentingRate";
import { DateTimeSelector } from "../../molecules/DateTimeSelector";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummary } from "../../organisms/booking/BookingSummary";

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

    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const formatInitialDate = (date: Date) => {
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const period = hours >= 12 ? 'CH' : 'SA';
        const displayHours = hours % 12 || 12;
        const timeStr = `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${timeStr}`;
    };
    
    const [startDate, setStartDate] = useState(formatInitialDate(now));
    const [endDate, setEndDate] = useState(formatInitialDate(weekLater));
    const [duration, setDuration] = useState("7 Ngày 0 Giờ");
    const [rentalDays, setRentalDays] = useState(7);
    
    const [startDateTime, setStartDateTime] = useState<Date>(now);
    const [endDateTime, setEndDateTime] = useState<Date>(weekLater);

    const category = (vehicleCategory?.toUpperCase() || "ECONOMY") as VehicleCategory;

    const {
        rentingRate,
        discountPercentage,
        durationType,
        // Membership
        membershipDiscountPercentage,
        membershipTier,
        membershipDiscountAmount,
        // Holiday
        holidayDays,
        holidaySurcharge,
        hasHolidaySurcharge,
        // Amounts
        baseRentalFee,
        discountAmount,
        totalRentalFee,
        averageRentalPrice,
        loading,
    } = useRentalPricing(
        startDateTime,
        endDateTime,
        pricePerDay,
        rentalDays,
        category
    );

    const total = useMemo(() => totalRentalFee + securityDeposit, [totalRentalFee, securityDeposit]);

    const hasDiscount = discountPercentage > 0;
    const hasMembershipDiscount = membershipDiscountPercentage > 0;

    console.log("📊 Rental calculation:", {
        category,
        rentalDays,
        durationType,
        rentingRate,
        discountPercentage: `${discountPercentage}%`,
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

    const parseTime = (timeStr: string) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM|SA|CH)/i);
        if (!match) return { hours: 0, minutes: 0 };
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if ((period === 'PM' || period === 'CH') && hours !== 12) {
            hours += 12;
        } else if ((period === 'AM' || period === 'SA') && hours === 12) {
            hours = 0;
        }
        
        return { hours, minutes };
    };

    const calculateDuration = (startDateStr: string, endDateStr: string, startTimeStr: string, endTimeStr: string) => {
        const startTime = parseTime(startTimeStr);
        const endTime = parseTime(endTimeStr);
        
        const start = new Date(startDateStr);
        start.setHours(startTime.hours, startTime.minutes, 0, 0);
        
        const end = new Date(endDateStr);
        end.setHours(endTime.hours, endTime.minutes, 0, 0);
        
        const diffMs = end.getTime() - start.getTime();
        const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        
        return { days, hours };
    };

    const formatDateDisplay = (dateStr: string, timeStr: string) => {
        const date = new Date(dateStr);
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", 
                       "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${timeStr}`;
    };

    const handleDateRangeChange = (dateRange: string) => {
        console.log("Date range changed:", dateRange);
        
        const match = dateRange.match(/(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})\s*\((.+?)\s*-\s*(.+?)\)/);
        
        if (match) {
            const [, startDateStr, endDateStr, startTimeStr, endTimeStr] = match;
            
            const formattedStart = formatDateDisplay(startDateStr, startTimeStr);
            const formattedEnd = formatDateDisplay(endDateStr, endTimeStr);
            
            setStartDate(formattedStart);
            setEndDate(formattedEnd);
            
            const startTime = parseTime(startTimeStr);
            const endTime = parseTime(endTimeStr);
            
            const newStartDate = new Date(startDateStr);
            newStartDate.setHours(startTime.hours, startTime.minutes, 0, 0);
            setStartDateTime(newStartDate);
            
            const newEndDate = new Date(endDateStr);
            newEndDate.setHours(endTime.hours, endTime.minutes, 0, 0);
            setEndDateTime(newEndDate);
            
            const { days, hours } = calculateDuration(startDateStr, endDateStr, startTimeStr, endTimeStr);
            
            setDuration(`${days} Ngày ${hours} Giờ`);
            setRentalDays(days > 0 ? days : 1);
        }
    };

    const handleContinue = () => {
        console.log("Continue to next step for vehicle:", vehicleId);
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
            rentalDays,
            rentalPrice: totalRentalFee,
            baseRentalFee,
            rentingRate,
            averageRentalPrice,
            vehicleCategory: category,
            holidaySurcharge,
            holidayDayCount: holidayDays.length,
            // Pass membership data
            membershipDiscountPercentage,
            membershipDiscountAmount,
            membershipTier,
        });
    };

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

    const getGroupedHolidays = (): { name: string; count: number; multiplier: number; totalSurcharge: number }[] => {
        const grouped = holidayDays.reduce((acc, day) => {
            const name = day.holiday.holidayName;
            if (!acc[name]) {
                acc[name] = {
                    name,
                    count: 0,
                    multiplier: day.holiday.priceMultiplier,
                    totalSurcharge: 0,
                };
            }
            acc[name].count++;
            acc[name].totalSurcharge += day.surchargeAmount;
            return acc;
        }, {} as Record<string, { name: string; count: number; multiplier: number; totalSurcharge: number }>);
        
        return Object.values(grouped);
    };
    
    return (
        <View style={styles.container}>
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
                />

                {/* Current Membership Indicator */}
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

                {/* Config Discount Banner */}
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
                            <Text style={styles.discountSavings}>
                                Tiết kiệm: {discountAmount.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                )}

                {/* Membership Discount Banner */}
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

                {/* Holiday Surcharge Banner */}
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
                            <Text style={styles.holidaySurchargeAmount}>
                                +{holidaySurcharge.toLocaleString()}đ
                            </Text>
                        </View>
                        
                        <View style={styles.holidayList}>
                            {getGroupedHolidays().map((item, index) => (
                                <View key={index} style={styles.holidayListItem}>
                                    <Text style={styles.holidayBullet}>•</Text>
                                    <Text style={styles.holidayItemText}>
                                        {item.name} {item.count > 1 ? `(${item.count} ngày)` : ''}
                                    </Text>
                                    <Text style={styles.holidayItemAmount}>
                                        +{item.totalSurcharge.toLocaleString()}đ
                                    </Text>
                                </View>
                            ))}
                        </View>
                    </View>
                )}
                
                <BookingSummary
                    rentalDays={rentalDays}
                    rentalPrice={`${totalRentalFee.toLocaleString()}đ`}
                    securityDeposit={`${securityDeposit.toLocaleString()}đ`}
                    total={`${total.toLocaleString()}đ`}
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton 
                    title="Tiếp tục" 
                    onPress={handleContinue}
                    disabled={loading}
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
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
    // Membership Indicator (always visible)
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
    // Config Discount Banner
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
    discountSavings: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
    },
    // Membership Discount Banner
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
    // Holiday Surcharge Banner
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
    holidayList: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: "#ef444440",
    },
    holidayListItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 4,
    },
    holidayBullet: {
        color: "#fca5a5",
        fontSize: 12,
        marginRight: 8,
        width: 12,
    },
    holidayItemText: {
        color: "#fca5a5",
        fontSize: 13,
        flex: 1,
    },
    holidayItemAmount: {
        color: "#ef4444",
        fontSize: 12,
        fontWeight: "600",
        minWidth: 80,
        textAlign: "right",
    },
});