import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { BookingStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { DurationText } from "../../atoms/text/DurationText";
import { DateTimeSelector } from "../../molecules/DateTimeSelector";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummary } from "../../organisms/booking/BookingSummary";

type RoutePropType = RouteProp<BookingStackParamList, 'ConfirmRentalDuration'>;
type NavigationPropType = StackNavigationProp<BookingStackParamList, 'ConfirmRentalDuration'>;

export const ConfirmRentalDurationScreen: React.FC = () => {
    const route = useRoute<RoutePropType>();
    const navigation = useNavigation<NavigationPropType>();
    const { vehicleId } = route.params;
    
    const [startDate, setStartDate] = useState("Sep 01 5:00 PM");
    const [endDate, setEndDate] = useState("Sep 07 5:00 PM");
    const [duration, setDuration] = useState("7 Ngày 0 Giờ");
    const [rentalDays, setRentalDays] = useState(7);

    console.log("Booking vehicle ID:", vehicleId);

    const handleBack = () => {
        navigation.goBack();
    };

    const parseTime = (timeStr: string) => {
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return { hours: 0, minutes: 0 };
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        if (period === 'PM' && hours !== 12) {
            hours += 12;
        } else if (period === 'AM' && hours === 12) {
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
        const months = ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"];
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
            startDate,
            endDate,
            duration,
            rentalDays,
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
                <DateTimeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                />
                <DurationText duration={duration} />
                <BookingSummary
                    rentalDays={rentalDays}
                    rentalPrice="1,050,000đ"
                    securityDeposit="2,000,000đ"
                    total="3,150,000đ"
                />
            </ScrollView>

            <View style={styles.footer}>
                <PrimaryButton title="Tiếp tục" onPress={handleContinue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    scrollView: { flex: 1 },
    content: { padding: 16, paddingBottom: 100 },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
});