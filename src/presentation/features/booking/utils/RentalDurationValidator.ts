/**
 * Rental Duration Validator
 * 
 * Pure utility functions for validating and calculating rental durations.
 * Handles business rules like minimum rental periods and date range validation.
 */

export interface DurationValidationResult {
    isValid: boolean;
    error: string | null;
    totalHours: number;
}

export interface RentalDuration {
    days: number;
    hours: number;
    totalHours: number;
}

export interface TimeComponents {
    hours: number;
    minutes: number;
}

/**
 * Business rule: Minimum rental duration in hours
 */
export const MINIMUM_RENTAL_HOURS = 3;

/**
 * Validate rental duration against business rules
 * 
 * Rules:
 * - End date/time must be after start date/time (no negative durations)
 * - Minimum rental duration must be met
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param minHours - Minimum required hours (default: 3)
 * @returns Validation result with error message if invalid
 */
export const validateRentalDuration = (
    startDate: Date,
    endDate: Date,
    minHours: number = MINIMUM_RENTAL_HOURS
): DurationValidationResult => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const totalHours = diffMs / (1000 * 60 * 60);

    // Rule 1: No negative durations
    if (diffMs < 0) {
        return {
            isValid: false,
            error: "Thời gian trả xe phải sau thời gian nhận xe",
            totalHours: 0,
        };
    }

    // Rule 2: Minimum rental duration
    if (totalHours < minHours) {
        return {
            isValid: false,
            error: `Thời gian thuê tối thiểu là ${minHours} giờ`,
            totalHours,
        };
    }

    return {
        isValid: true,
        error: null,
        totalHours,
    };
};

/**
 * Calculate rental duration in days and hours
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @returns Duration broken down into days and hours
 */
export const calculateRentalDuration = (
    startDate: Date,
    endDate: Date
): RentalDuration => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24;

    return {
        days,
        hours,
        totalHours,
    };
};

/**
 * Parse time string in 12-hour format (SA/CH or AM/PM)
 * 
 * Supports formats:
 * - "10:30 SA" (Vietnamese morning)
 * - "2:45 CH" (Vietnamese afternoon)
 * - "10:30 AM" (English morning)
 * - "2:45 PM" (English afternoon)
 * 
 * @param timeStr - Time string to parse
 * @returns Hours and minutes in 24-hour format
 */
export const parseTime = (timeStr: string): TimeComponents => {
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM|SA|CH)/i);
    
    if (!match) {
        return { hours: 0, minutes: 0 };
    }

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const period = match[3].toUpperCase();

    // Convert to 24-hour format
    if ((period === 'PM' || period === 'CH') && hours !== 12) {
        hours += 12;
    } else if ((period === 'AM' || period === 'SA') && hours === 12) {
        hours = 0;
    }

    return { hours, minutes };
};

/**
 * Format duration for display in Vietnamese
 * 
 * @param days - Number of days
 * @param hours - Number of hours
 * @returns Formatted string like "3 Ngày 5 Giờ"
 */
export const formatDuration = (days: number, hours: number): string => {
    return `${days} Ngày ${hours} Giờ`;
};

/**
 * Calculate rental days for pricing (minimum 1 day)
 * 
 * @param days - Calculated days from duration
 * @returns Rental days for pricing (never less than 1)
 */
export const calculateRentalDays = (days: number): number => {
    return days > 0 ? days : 1;
};