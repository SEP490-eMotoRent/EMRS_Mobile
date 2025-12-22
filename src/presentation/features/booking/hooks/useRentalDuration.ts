import { useEffect, useState } from "react";
import {
    calculateProgressiveTiers,
    calculateRentalDuration,
    formatDuration,
    parseTime,
    validateRentalDuration,
} from "../utils/RentalDurationValidator";

/**
 * Hook for managing rental duration state and validation
 * 
 * Handles:
 * - Duration calculation with exact hours (hourly pricing)
 * - Validation against business rules (minimum 24 hours)
 * - Progressive tier calculation for discounts
 * - Date/time parsing and formatting
 * - Error state management
 * 
 * @param initialDateRangeISO - Initial date range in ISO format
 * @returns Duration state, validation errors, and update handlers
 */
export const useRentalDuration = (initialDateRangeISO?: string) => {
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [duration, setDuration] = useState<string>("");
    const [totalHours, setTotalHours] = useState<number>(0);
    const [startDateTime, setStartDateTime] = useState<Date>(new Date());
    const [endDateTime, setEndDateTime] = useState<Date>(new Date());
    const [startDateISO, setStartDateISO] = useState<string | null>(null);
    const [endDateISO, setEndDateISO] = useState<string | null>(null);
    const [durationError, setDurationError] = useState<string | null>(null);

    /**
     * Format date for Vietnamese display
     * Example: "Tháng 12 17 10:00 SA"
     */
    const formatDateDisplay = (dateStr: string, timeStr: string): string => {
        const date = new Date(dateStr);
        const months = [
            "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
            "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
        ];
        return `${months[date.getMonth()]} ${String(date.getDate()).padStart(2, '0')} ${timeStr}`;
    };

    /**
     * Handle date range change from DateTimeSelector
     * 
     * Expected format: "2024-12-17 - 2024-12-18 (10:00 SA - 6:00 CH)"
     */
    const handleDateRangeChange = (dateRange: string) => {
        // console.log("📅 Date range changed:", dateRange);

        const match = dateRange.match(/(\d{4}-\d{2}-\d{2})\s*-\s*(\d{4}-\d{2}-\d{2})\s*\((.+?)\s*-\s*(.+?)\)/);

        if (!match) {
            // console.warn("⚠️ Invalid date range format:", dateRange);
            return;
        }

        const [, startDateStr, endDateStr, startTimeStr, endTimeStr] = match;

        // Update ISO dates
        setStartDateISO(startDateStr);
        setEndDateISO(endDateStr);

        // Update display dates
        const formattedStart = formatDateDisplay(startDateStr, startTimeStr);
        const formattedEnd = formatDateDisplay(endDateStr, endTimeStr);
        setStartDate(formattedStart);
        setEndDate(formattedEnd);

        // Parse times and create Date objects
        const startTime = parseTime(startTimeStr);
        const endTime = parseTime(endTimeStr);

        const newStartDate = new Date(startDateStr);
        newStartDate.setHours(startTime.hours, startTime.minutes, 0, 0);
        setStartDateTime(newStartDate);

        const newEndDate = new Date(endDateStr);
        newEndDate.setHours(endTime.hours, endTime.minutes, 0, 0);
        setEndDateTime(newEndDate);

        // Validate duration
        const validation = validateRentalDuration(newStartDate, newEndDate);

        if (!validation.isValid) {
            setDurationError(validation.error);
            setDuration("--");
            setTotalHours(0);
            // console.warn("⚠️ Invalid duration:", validation.error);
            return;
        }

        // Clear errors and calculate duration
        setDurationError(null);
        const rentalDuration = calculateRentalDuration(newStartDate, newEndDate);
        setDuration(formatDuration(rentalDuration.days, rentalDuration.hours));
        setTotalHours(rentalDuration.totalHours);

        // Calculate progressive tiers for logging
        const tiers = calculateProgressiveTiers(rentalDuration.totalHours);

        // console.log("✅ Duration calculated:", {
        //     days: rentalDuration.days,
        //     hours: rentalDuration.hours,
        //     totalHours: rentalDuration.totalHours,
        //     progressiveTiers: {
        //         tier: tiers.discountTier,
        //         discountedHours: tiers.discountedHours,
        //         regularHours: tiers.regularHours,
        //         fullPeriods: tiers.fullPeriods,
        //     },
        // });
    };

    /**
     * Validate current duration (useful before navigation)
     */
    const validateCurrentDuration = (): boolean => {
        const validation = validateRentalDuration(startDateTime, endDateTime);
        
        if (!validation.isValid) {
            setDurationError(validation.error);
            // console.warn("⚠️ Validation failed:", validation.error);
            return false;
        }

        setDurationError(null);
        return true;
    };

    /**
     * Initialize from initial date range if provided
     */
    useEffect(() => {
        if (initialDateRangeISO) {
            // console.log("🔄 Auto-populating from initial date range:", initialDateRangeISO);
            handleDateRangeChange(initialDateRangeISO);
        }
    }, [initialDateRangeISO]);

    return {
        // Display values
        startDate,
        endDate,
        duration,
        totalHours, // For hourly pricing

        // Date objects
        startDateTime,
        endDateTime,

        // ISO dates
        startDateISO,
        endDateISO,

        // Validation
        durationError,
        isValid: durationError === null && totalHours > 0,

        // Handlers
        handleDateRangeChange,
        validateCurrentDuration,
    };
};