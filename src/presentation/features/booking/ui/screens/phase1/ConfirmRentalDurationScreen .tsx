import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
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
        branchOpenTime,  // ✅ NEW: From navigation params
        branchCloseTime, // ✅ NEW: From navigation params
    } = route.params;
    const navigation = useNavigation<NavigationPropType>();
    
    // ✅ Convert 24-hour format (e.g., "06:00", "22:00") to SA/CH format (e.g., "6:00 SA", "10:00 CH")
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

    // ✅ Use branch operating hours or defaults
    const branchOpenTimeSACH = branchOpenTime ? convertTo12HourFormat(branchOpenTime) : "6:00 SA";
    const branchCloseTimeSACH = branchCloseTime ? convertTo12HourFormat(branchCloseTime) : "10:00 CH";

    // Initialize with current date/time
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

    // Calculate prices dynamically
    const rentalPrice = useMemo(() => pricePerDay * rentalDays, [pricePerDay, rentalDays]);
    const total = useMemo(() => rentalPrice + securityDeposit, [rentalPrice, securityDeposit]);

    console.log("Booking vehicle ID:", vehicleId);
    console.log("Vehicle name:", vehicleName);
    console.log("Branch:", branchName);
    console.log("Branch hours:", branchOpenTime, "-", branchCloseTime);
    console.log("Branch hours (SA/CH):", branchOpenTimeSACH, "-", branchCloseTimeSACH);
    console.log("Price per day:", pricePerDay);
    console.log("Rental days:", rentalDays);
    console.log("Calculated rental price:", rentalPrice);

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
        
        const startDate = new Date(startDateStr);
        startDate.setHours(startTime.hours, startTime.minutes, 0, 0);
        
        const endDate = new Date(endDateStr);
        endDate.setHours(endTime.hours, endTime.minutes, 0, 0);
        
        const diffMs = endDate.getTime() - startDate.getTime();
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
            rentalPrice,
        });
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
                {/* ✅ DateTimeSelector with REAL branch operating hours */}
                <DateTimeSelector
                    startDate={startDate}
                    endDate={endDate}
                    duration={duration}
                    onDateRangeChange={handleDateRangeChange}
                    branchName={branchName}
                    branchOpenTime={branchOpenTimeSACH}   // ✅ Real data: "6:00 SA"
                    branchCloseTime={branchCloseTimeSACH} // ✅ Real data: "10:00 CH"
                />
                
                <BookingSummary
                    rentalDays={rentalDays}
                    rentalPrice={`${rentalPrice.toLocaleString()}đ`}
                    securityDeposit={`${securityDeposit.toLocaleString()}đ`}
                    total={`${total.toLocaleString()}đ`}
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton title="Tiếp tục" onPress={handleContinue} />
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
});