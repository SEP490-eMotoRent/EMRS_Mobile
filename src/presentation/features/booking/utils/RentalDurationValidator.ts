/**
 * Rental Duration Validator - Hourly Pricing System
 * 
 * Pure utility functions for validating and calculating rental durations.
 * Supports hourly pricing with progressive tier discounts.
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
 * Business rule: Minimum rental duration in hours (24 hours = 1 day)
 */
export const MINIMUM_RENTAL_HOURS = 24;

/**
 * Threshold for monthly discount (30 days)
 */
export const MONTHLY_THRESHOLD_DAYS = 30;

/**
 * Threshold for yearly discount (365 days)
 */
export const YEARLY_THRESHOLD_DAYS = 365;

/**
 * Validate rental duration against business rules
 * 
 * Rules:
 * - End date/time must be after start date/time (no negative durations)
 * - Minimum rental duration must be met (24 hours / 1 day)
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param minHours - Minimum required hours (default: 24)
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

    // Rule 2: Minimum rental duration (24 hours = 1 day)
    if (totalHours < minHours) {
        const minDays = Math.floor(minHours / 24);
        return {
            isValid: false,
            error: `Thời gian thuê tối thiểu là ${minDays} ngày`,
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
 * @returns Duration broken down into days, hours, and total hours
 */
export const calculateRentalDuration = (
    startDate: Date,
    endDate: Date
): RentalDuration => {
    const diffMs = endDate.getTime() - startDate.getTime();
    const totalHours = diffMs / (1000 * 60 * 60);
    const days = Math.floor(totalHours / 24);
    const hours = Math.floor(totalHours % 24);

    return {
        days,
        hours,
        totalHours, // Exact hours (can be decimal)
    };
};

/**
 * Calculate progressive tier breakdown for discounts
 * 
 * Examples:
 * - 70 days → 60 days discounted (2 months), 10 days regular
 * - 400 days → 365 days discounted (1 year), 35 days regular
 * - 45 days → 30 days discounted (1 month), 15 days regular
 * 
 * @param totalHours - Total rental hours
 * @returns Breakdown of discounted and regular hours with applicable discount rate
 */
export const calculateProgressiveTiers = (
    totalHours: number
): {
    discountedHours: number;
    regularHours: number;
    discountTier: "yearly" | "monthly" | "none";
    fullPeriods: number;
} => {
    const totalDays = totalHours / 24;

    // Check for yearly discount (365+ days)
    if (totalDays >= YEARLY_THRESHOLD_DAYS) {
        const fullYears = Math.floor(totalDays / YEARLY_THRESHOLD_DAYS);
        const discountedDays = fullYears * YEARLY_THRESHOLD_DAYS;
        const remainingDays = totalDays - discountedDays;

        return {
            discountedHours: discountedDays * 24,
            regularHours: remainingDays * 24,
            discountTier: "yearly",
            fullPeriods: fullYears,
        };
    }

    // Check for monthly discount (30-364 days)
    if (totalDays >= MONTHLY_THRESHOLD_DAYS) {
        const fullMonths = Math.floor(totalDays / MONTHLY_THRESHOLD_DAYS);
        const discountedDays = fullMonths * MONTHLY_THRESHOLD_DAYS;
        const remainingDays = totalDays - discountedDays;

        return {
            discountedHours: discountedDays * 24,
            regularHours: remainingDays * 24,
            discountTier: "monthly",
            fullPeriods: fullMonths,
        };
    }

    // No discount (< 30 days)
    return {
        discountedHours: 0,
        regularHours: totalHours,
        discountTier: "none",
        fullPeriods: 0,
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