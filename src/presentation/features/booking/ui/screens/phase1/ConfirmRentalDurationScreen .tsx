import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { calculateRentalFees, useRentingRate, VehicleCategory } from "../../../hooks/useRentingRate";
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

    // ✅ Use renting rate hook
    const category = (vehicleCategory?.toUpperCase() || "ECONOMY") as VehicleCategory;
    const { 
        rentingRate, 
        discountPercentage, 
        durationType,
        loading: rateLoading 
    } = useRentingRate(rentalDays, category);

    // ✅ Calculate fees with discount
    const { baseRentalFee, totalRentalFee, averageRentalPrice, discountAmount } = useMemo(
        () => calculateRentalFees(pricePerDay, rentalDays, rentingRate),
        [pricePerDay, rentalDays, rentingRate]
    );

    const total = useMemo(() => totalRentalFee + securityDeposit, [totalRentalFee, securityDeposit]);

    const hasDiscount = discountPercentage > 0;

    console.log("📊 Rental calculation:", {
        category,
        rentalDays,
        durationType,
        rentingRate,
        discountPercentage: `${discountPercentage}%`,
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

                {/* ✅ Discount Banner */}
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
                    disabled={rateLoading}
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
});