import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";

export interface HolidayDay {
    date: Date;
    holiday: HolidayPricing;
    dayIndex: number; // Index in rental period (0-based)
    isInDiscountedPeriod: boolean; // Whether this day falls in discounted period
    basePrice: number; // Daily rate (discounted or regular)
    surchargeAmount: number;
    totalPrice: number;
}

export interface HolidayPricingResult {
    /** Days that fall on holidays */
    holidayDays: HolidayDay[];
    /** Total number of holiday days */
    holidayDayCount: number;
    /** Total surcharge amount */
    totalSurcharge: number;
    /** Base rental fee without surcharge */
    baseRentalFee: number;
    /** Total rental fee with surcharge */
    totalRentalFee: number;
    /** Highest multiplier found */
    maxMultiplier: number;
    /** Summary for display */
    summary: string;
}

export interface ProgressiveTierBreakdown {
    discountedHours: number;
    regularHours: number;
    discountTier: "yearly" | "monthly" | "none";
}

/**
 * Constants for tier thresholds
 */
const MONTHLY_THRESHOLD_DAYS = 30;
const YEARLY_THRESHOLD_DAYS = 365;
const HOURS_PER_DAY = 24;

/**
 * Check if two dates are the same day (ignoring time)
 */
const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

/**
 * Get all dates in a range (inclusive of any day the rental touches)
 * 
 * Business rule: If the rental period overlaps with a day even partially,
 * that day should be included for holiday calculations.
 * 
 * Example:
 * - Pickup: April 30, 10:00 AM
 * - Return: May 1, 10:00 PM
 * - Result: [April 30, May 1] ✅ Both days included
 */
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    // Use <= to include the end date if rental extends into it
    while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    return dates;
};

/**
 * Find holiday for a specific date
 */
const findHolidayForDate = (
    date: Date,
    holidays: HolidayPricing[]
): HolidayPricing | null => {
    for (const holiday of holidays) {
        if (holiday.holidayDate && isSameDay(date, holiday.holidayDate)) {
            return holiday;
        }
    }
    return null;
};

/**
 * Calculate progressive tier breakdown
 * 
 * Examples:
 * - 70 days → 60 days discounted (2 × 30), 10 days regular
 * - 400 days → 365 days discounted (1 × 365), 35 days regular
 */
const calculateProgressiveTiers = (totalHours: number): ProgressiveTierBreakdown => {
    const totalDays = totalHours / HOURS_PER_DAY;

    // Check for yearly discount
    if (totalDays >= YEARLY_THRESHOLD_DAYS) {
        const fullYears = Math.floor(totalDays / YEARLY_THRESHOLD_DAYS);
        const discountedDays = fullYears * YEARLY_THRESHOLD_DAYS;
        const remainingDays = totalDays - discountedDays;

        return {
            discountedHours: discountedDays * HOURS_PER_DAY,
            regularHours: remainingDays * HOURS_PER_DAY,
            discountTier: "yearly",
        };
    }

    // Check for monthly discount
    if (totalDays >= MONTHLY_THRESHOLD_DAYS) {
        const fullMonths = Math.floor(totalDays / MONTHLY_THRESHOLD_DAYS);
        const discountedDays = fullMonths * MONTHLY_THRESHOLD_DAYS;
        const remainingDays = totalDays - discountedDays;

        return {
            discountedHours: discountedDays * HOURS_PER_DAY,
            regularHours: remainingDays * HOURS_PER_DAY,
            discountTier: "monthly",
        };
    }

    // No discount
    return {
        discountedHours: 0,
        regularHours: totalHours,
        discountTier: "none",
    };
};

/**
 * Calculate combined pricing with Progressive Tier Hourly Pricing
 * 
 * Formula:
 * 1. Divide rental into discounted period + regular period
 * 2. Calculate hourly rate: Daily_Price ÷ 24
 * 3. Discounted portion: Hourly_Rate × Discounted_Hours × (1 - Discount_Rate)
 * 4. Regular portion: Hourly_Rate × Regular_Hours
 * 5. Holiday surcharge: Applied to the rate of the specific day
 * 
 * Example (70 days):
 * - 60 days (2 months) get 10% discount
 * - 10 days regular price
 * - Total = (4,167đ × 1,440h × 0.90) + (4,167đ × 240h)
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param dailyRate - Price per day (24 hours)
 * @param totalHours - Total rental hours
 * @param holidays - List of holiday pricings
 * @param configDiscountRate - Configuration discount rate (e.g., 0.90 for 10% monthly discount)
 */
export const calculateCombinedRentalFee = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    totalHours: number,
    holidays: HolidayPricing[],
    configDiscountRate: number
): {
    baseRentalFee: number;
    discountAmount: number;
    holidaySurcharge: number;
    totalRentalFee: number;
    holidayDays: HolidayDay[];
    progressiveTierBreakdown: ProgressiveTierBreakdown;
} => {
    // Step 1: Calculate hourly rate
    const hourlyRate = dailyRate / HOURS_PER_DAY;

    // Step 2: Calculate progressive tier breakdown
    const tierBreakdown = calculateProgressiveTiers(totalHours);
    const { discountedHours, regularHours } = tierBreakdown;

    // Step 3: Calculate base rental with progressive pricing
    let baseRentalFee: number;
    let discountAmount: number;

    if (discountedHours > 0) {
        // Has discounted period
        const discountedPortion = hourlyRate * discountedHours * configDiscountRate;
        const regularPortion = hourlyRate * regularHours;
        const totalBeforeDiscount = hourlyRate * totalHours;

        baseRentalFee = Math.round(discountedPortion + regularPortion);
        discountAmount = Math.round(totalBeforeDiscount - baseRentalFee);
    } else {
        // No discount
        baseRentalFee = Math.round(hourlyRate * totalHours);
        discountAmount = 0;
    }

    // Step 4: Calculate holiday surcharge
    const rentalDates = getDatesInRange(startDate, endDate);
    const discountedDaysCount = discountedHours / HOURS_PER_DAY;
    const holidayDays: HolidayDay[] = [];
    let totalSurcharge = 0;
    let maxMultiplier = 1;

    rentalDates.forEach((date, dayIndex) => {
        const holiday = findHolidayForDate(date, holidays);

        if (holiday) {
            // Determine if this day is in discounted period
            const isInDiscountedPeriod = dayIndex < discountedDaysCount;

            // Calculate the daily rate for this day
            const dailyRateForThisDay = isInDiscountedPeriod
                ? hourlyRate * HOURS_PER_DAY * configDiscountRate
                : hourlyRate * HOURS_PER_DAY;

            // Calculate surcharge (rounded)
            const surchargeAmount = Math.round(dailyRateForThisDay * (holiday.priceMultiplier - 1));
            const totalPrice = Math.round(dailyRateForThisDay * holiday.priceMultiplier);

            holidayDays.push({
                date,
                holiday,
                dayIndex,
                isInDiscountedPeriod,
                basePrice: Math.round(dailyRateForThisDay),
                surchargeAmount,
                totalPrice,
            });

            totalSurcharge += surchargeAmount;

            if (holiday.priceMultiplier > maxMultiplier) {
                maxMultiplier = holiday.priceMultiplier;
            }
        }
    });

    const totalRentalFee = baseRentalFee + totalSurcharge;

    return {
        baseRentalFee,
        discountAmount,
        holidaySurcharge: totalSurcharge,
        totalRentalFee,
        holidayDays,
        progressiveTierBreakdown: tierBreakdown,
    };
};

/**
 * Calculate holiday pricing for a rental period (legacy, for backward compatibility)
 */
export const calculateHolidayPricing = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    holidays: HolidayPricing[]
): HolidayPricingResult => {
    const rentalDates = getDatesInRange(startDate, endDate);
    const holidayDays: HolidayDay[] = [];
    let totalSurcharge = 0;
    let maxMultiplier = 1;

    rentalDates.forEach((date, index) => {
        const holiday = findHolidayForDate(date, holidays);

        if (holiday) {
            const surchargeAmount = Math.round(dailyRate * (holiday.priceMultiplier - 1));
            const totalPrice = Math.round(dailyRate * holiday.priceMultiplier);

            holidayDays.push({
                date,
                holiday,
                dayIndex: index,
                isInDiscountedPeriod: false,
                basePrice: dailyRate,
                surchargeAmount,
                totalPrice,
            });

            totalSurcharge += surchargeAmount;

            if (holiday.priceMultiplier > maxMultiplier) {
                maxMultiplier = holiday.priceMultiplier;
            }
        }
    });

    const totalDays = rentalDates.length;
    const baseRentalFee = totalDays * dailyRate;
    const totalRentalFee = baseRentalFee + totalSurcharge;

    // Build summary
    let summary = "";
    if (holidayDays.length > 0) {
        const uniqueHolidays = [...new Set(holidayDays.map(h => h.holiday.holidayName))];
        summary = `${holidayDays.length} ngày lễ (${uniqueHolidays.join(", ")})`;
    }

    return {
        holidayDays,
        holidayDayCount: holidayDays.length,
        totalSurcharge,
        baseRentalFee,
        totalRentalFee,
        maxMultiplier,
        summary,
    };
};

/**
 * Format holiday surcharge for display
 */
export const formatHolidaySurchargeDisplay = (
    holidayDays: HolidayDay[]
): string => {
    if (holidayDays.length === 0) return "";

    const grouped = holidayDays.reduce((acc, day) => {
        const name = day.holiday.holidayName;
        if (!acc[name]) {
            acc[name] = {
                name,
                days: 0,
                multiplier: day.holiday.priceMultiplier,
                totalSurcharge: 0,
            };
        }
        acc[name].days++;
        acc[name].totalSurcharge += day.surchargeAmount;
        return acc;
    }, {} as Record<string, { name: string; days: number; multiplier: number; totalSurcharge: number }>);

    return Object.values(grouped)
        .map(g => `${g.name}: ${g.days} ngày (+${Math.round((g.multiplier - 1) * 100)}%)`)
        .join("\n");
};