import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { PrimaryButton } from "../../../../../common/components/atoms/buttons/PrimaryButton";
import { HomeStackParamList } from "../../../../../shared/navigation/StackParameters/types";
import { DurationText } from "../../atoms/text/DurationText";
import { DateTimeSelector } from "../../molecules/DateTimeSelector";
import { PageHeader } from "../../molecules/PageHeader";
import { ProgressIndicator } from "../../molecules/ProgressIndicator";
import { BookingSummary } from "../../organisms/BookingSummary";

type ConfirmRentalDurationRouteProp = RouteProp<HomeStackParamList, 'ConfirmRentalDuration'>;
type ConfirmRentalDurationNavigationProp = StackNavigationProp<HomeStackParamList, 'ConfirmRentalDuration'>;

export const ConfirmRentalDurationScreen: React.FC = () => {
    const route = useRoute<ConfirmRentalDurationRouteProp>();
    const navigation = useNavigation<ConfirmRentalDurationNavigationProp>();
    const { vehicleId } = route.params;
    
    const [startDate, setStartDate] = useState("Sep 01 5:00 PM");
    const [endDate, setEndDate] = useState("Sep 07 5:00 PM");
    const [duration, setDuration] = useState("7 Days 0 Hours");
    const [rentalDays, setRentalDays] = useState(7);

    console.log("Booking vehicle ID:", vehicleId);

    const handleBack = () => {
        navigation.goBack();
    };

    const parseTime = (timeStr: string) => {
        // Parse "6:00 PM" or "10:00 AM"
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
        if (!match) return { hours: 0, minutes: 0 };
        
        let hours = parseInt(match[1]);
        const minutes = parseInt(match[2]);
        const period = match[3].toUpperCase();
        
        // Convert to 24-hour format
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
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${timeStr}`;
    };

    const handleDateRangeChange = (dateRange: string) => {
        console.log("Date range changed:", dateRange);
        
        // Parse: "2025-10-27 - 2025-11-01 (6:00 PM - 10:00 AM)"
        const match = dateRange.match(/(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})\s*\((.+?)\s*-\s*(.+?)\)/);
        
        if (match) {
            const [, startDateStr, endDateStr, startTimeStr, endTimeStr] = match;
            
            // Format display strings
            const formattedStart = formatDateDisplay(startDateStr, startTimeStr);
            const formattedEnd = formatDateDisplay(endDateStr, endTimeStr);
            
            setStartDate(formattedStart);
            setEndDate(formattedEnd);
            
            // Calculate duration with proper time parsing
            const { days, hours } = calculateDuration(startDateStr, endDateStr, startTimeStr, endTimeStr);
            
            setDuration(`${days} Days ${hours} Hours`);
            setRentalDays(days > 0 ? days : 1); // Minimum 1 day for rental
        }
    };

    const handleContinue = () => {
        console.log("Continue to next step for vehicle:", vehicleId);
        // TODO: Navigate to next booking step (step 2)
        // navigation.navigate('BookingStep2', { vehicleId });
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <PageHeader title="Renting Duration" onBack={handleBack} />

            {/* Progress Indicator */}
            <ProgressIndicator currentStep={1} totalSteps={4} />

            {/* Scrollable Content */}
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Date Time Selector */}
                <DateTimeSelector
                    startDate={startDate}
                    endDate={endDate}
                    onDateRangeChange={handleDateRangeChange}
                />

                {/* Duration Display */}
                <DurationText duration={duration} />

                {/* Booking Summary */}
                <BookingSummary
                    rentalDays={rentalDays}
                    rentalPrice="1,050,000đ"
                    securityDeposit="2,000,000đ"
                    total="3,150,000đ"
                />
            </ScrollView>

            {/* Continue Button */}
            <View style={styles.footer}>
                <PrimaryButton title="Continue" onPress={handleContinue} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    footer: {
        padding: 16,
        paddingBottom: 32,
        backgroundColor: "#000",
        borderTopWidth: 1,
        borderTopColor: "#1a1a1a",
    },
});