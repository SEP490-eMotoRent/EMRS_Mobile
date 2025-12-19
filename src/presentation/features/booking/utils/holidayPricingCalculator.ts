import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";

export interface HolidayDay {
    date: Date;
    holiday: HolidayPricing;
    dayIndex: number;
    isInDiscountedPeriod: boolean;
    basePrice: number;
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
 * UPDATED: Determine discount tier (QUALIFICATION-BASED, not progressive)
 * 
 * NEW RULE: If you qualify for a tier, ALL days get that discount
 * 
 * Examples:
 * - 70 days → ALL 70 days get monthly discount (not 60+10)
 * - 400 days → ALL 400 days get yearly discount (not 365+35)
 * - 25 days → NO discount
 */
const determineDiscountTier = (totalHours: number): {
    discountTier: "yearly" | "monthly" | "none";
    appliesTo: "all" | "none";
} => {
    const totalDays = totalHours / HOURS_PER_DAY;

    // Check for yearly qualification
    if (totalDays >= YEARLY_THRESHOLD_DAYS) {
        return {
            discountTier: "yearly",
            appliesTo: "all",
        };
    }

    // Check for monthly qualification
    if (totalDays >= MONTHLY_THRESHOLD_DAYS) {
        return {
            discountTier: "monthly",
            appliesTo: "all",
        };
    }

    // No discount qualification
    return {
        discountTier: "none",
        appliesTo: "none",
    };
};

// ============================================================================
// COMMENTED OUT: OLD PROGRESSIVE TIER LOGIC
// ============================================================================
/*
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
*/

/**
 * UPDATED: Calculate combined pricing with TIER QUALIFICATION
 * NOW USING WHITEBOARD FORMULA (Tier Qualification + Subtractive Discounts)
 * 
 * Whiteboard Formula:
 * A = Base price per day (gốc thuê)
 * B = Normal days price = A × (1 - %mem - %monthly) × (ngày - λ + giờ/24)
 * C = Holiday days price = A × (1 + %holiday - %mem - %monthly)
 * D = B + C
 * 
 * Where:
 * - λ (lambda) = number of holiday days
 * - %mem = membership discount percentage (as decimal)
 * - %monthly = monthly/yearly discount percentage (as decimal)
 * - %holiday = holiday surcharge percentage (as decimal)
 * 
 * KEY CHANGES:
 * 1. TIER QUALIFICATION: All days get discount if qualified (not progressive chunks)
 * 2. SUBTRACTIVE DISCOUNTS: (1 - %mem - %monthly)
 * 3. ADDITIVE HOLIDAY SURCHARGE: (1 + %holiday - %mem - %monthly)
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param dailyRate - Price per day (24 hours)
 * @param totalHours - Total rental hours
 * @param holidays - List of holiday pricings
 * @param configDiscountRate - Configuration discount rate (e.g., 0.90 for 10% monthly discount)
 * @param membershipDiscountPercentage - Membership discount percentage (e.g., 5 for 5%)
 */
export const calculateCombinedRentalFee = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    totalHours: number,
    holidays: HolidayPricing[],
    configDiscountRate: number,
    membershipDiscountPercentage: number = 0
): {
    baseRentalFee: number;
    discountAmount: number;
    holidaySurcharge: number;
    totalRentalFee: number;
    holidayDays: HolidayDay[];
    progressiveTierBreakdown: ProgressiveTierBreakdown;
    membershipDiscountAmount: number;
} => {
    // Step 1: Calculate hourly rate and total days
    const hourlyRate = dailyRate / HOURS_PER_DAY;
    const totalDays = totalHours / HOURS_PER_DAY;

    // Step 2: Determine discount tier qualification (NEW APPROACH)
    const tierQualification = determineDiscountTier(totalHours);
    
    // For backward compatibility, create a tier breakdown object
    const tierBreakdown: ProgressiveTierBreakdown = {
        discountedHours: tierQualification.appliesTo === "all" ? totalHours : 0,
        regularHours: tierQualification.appliesTo === "none" ? totalHours : 0,
        discountTier: tierQualification.discountTier,
    };

    // Step 3: Find holiday days (λ)
    const rentalDates = getDatesInRange(startDate, endDate);
    const holidayDays: HolidayDay[] = [];
    
    rentalDates.forEach((date, dayIndex) => {
        const holiday = findHolidayForDate(date, holidays);
        if (holiday) {
            holidayDays.push({
                date,
                holiday,
                dayIndex,
                isInDiscountedPeriod: tierQualification.appliesTo === "all",
                basePrice: 0,
                surchargeAmount: 0,
                totalPrice: 0,
            });
        }
    });

    const lambda = holidayDays.length;

    // Step 4: Calculate SUBTRACTIVE discount rate (WHITEBOARD FORMULA)
    const configDiscountPercentage = (1 - configDiscountRate) * 100;
    const configDiscountDecimal = configDiscountPercentage / 100;
    const membershipDiscountDecimal = membershipDiscountPercentage / 100;
    const combinedDiscountRate = 1 - membershipDiscountDecimal - configDiscountDecimal;

    console.log("💰 [WHITEBOARD] Discount calculation:", {
        configDiscount: `${configDiscountPercentage.toFixed(1)}%`,
        membershipDiscount: `${membershipDiscountPercentage}%`,
        combinedRate: combinedDiscountRate.toFixed(3),
        totalDiscount: `${((1 - combinedDiscountRate) * 100).toFixed(1)}%`,
        method: "SUBTRACTIVE (1 - %mem - %monthly)",
        tierQualification: tierQualification.discountTier,
        appliesTo: tierQualification.appliesTo,
    });

    // Step 5: Calculate B - Normal days (ALL DAYS GET DISCOUNT IF QUALIFIED)
    const normalDaysCount = totalDays - lambda;
    const normalDaysFee = Math.round(dailyRate * normalDaysCount * combinedDiscountRate);
    
    // Calculate discount amount
    const totalBeforeDiscount = dailyRate * normalDaysCount;
    const discountAmount = Math.round(totalBeforeDiscount * (1 - combinedDiscountRate));
    
    console.log("🔵 [WHITEBOARD] Normal days (B):", {
        normalDays: normalDaysCount.toFixed(2),
        normalDaysFee: normalDaysFee.toLocaleString(),
        allDaysDiscounted: tierQualification.appliesTo === "all",
    });

    // ========================================================================
    // COMMENTED OUT: OLD PROGRESSIVE TIER LOGIC
    // ========================================================================
    /*
    // Step 5: Calculate B - Normal days with progressive pricing
    let normalDaysFee = 0;
    let discountAmount = 0;

    if (discountedHours > 0) {
        // Has progressive discount
        const discountedDays = discountedHours / HOURS_PER_DAY;
        const regularDays = regularHours / HOURS_PER_DAY;
        
        // Distribute holiday days across periods proportionally
        const holidayInDiscountedPeriod = Math.min(
            lambda, 
            Math.floor(lambda * (discountedDays / totalDays))
        );
        const holidayInRegularPeriod = lambda - holidayInDiscountedPeriod;
        
        const discountedNormalDays = discountedDays - holidayInDiscountedPeriod;
        const regularNormalDays = regularDays - holidayInRegularPeriod;
        
        // Calculate normal days fee with combined discount
        const discountedPortion = dailyRate * discountedNormalDays * combinedDiscountRate;
        const regularPortion = dailyRate * regularNormalDays * combinedDiscountRate; // ❌ OLD: Applied discount to regular days too
        
        normalDaysFee = Math.round(discountedPortion + regularPortion);
        
        // Calculate discount amount
        const totalBeforeDiscount = dailyRate * (totalDays - lambda);
        discountAmount = Math.round(totalBeforeDiscount * (1 - combinedDiscountRate));
        
        console.log("🔵 [WHITEBOARD] Normal days (B):", {
            discountedNormalDays: discountedNormalDays.toFixed(2),
            regularNormalDays: regularNormalDays.toFixed(2),
            normalDaysFee: normalDaysFee.toLocaleString(),
        });
    } else {
        // No progressive discount
        const normalDaysCount = totalDays - lambda;
        normalDaysFee = Math.round(dailyRate * normalDaysCount * combinedDiscountRate);
        
        const totalBeforeDiscount = dailyRate * normalDaysCount;
        discountAmount = Math.round(totalBeforeDiscount * (1 - combinedDiscountRate));
        
        console.log("🔵 [WHITEBOARD] Normal days (B):", {
            normalDays: normalDaysCount,
            normalDaysFee: normalDaysFee.toLocaleString(),
        });
    }
    */

    // Step 6: Calculate C - Holiday days with ADDITIVE surcharge (WHITEBOARD FORMULA)
    let holidayDaysFee = 0;
    let totalHolidaySurcharge = 0;
    
    holidayDays.forEach((holidayDay, index) => {
        const holidayMultiplier = holidayDay.holiday.priceMultiplier;
        const holidaySurchargePercentage = holidayMultiplier - 1; // e.g., 1.5 → 0.5 (50%)
        
        // WHITEBOARD: C = A × (1 + %holiday - %mem - %monthly)
        const holidayRate = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
        const holidayTotalPrice = Math.round(dailyRate * holidayRate);
        
        // Base price with discounts applied (what the day would cost without holiday)
        const holidayBasePrice = Math.round(dailyRate * combinedDiscountRate);
        const surchargeAmount = holidayTotalPrice - holidayBasePrice;
        
        holidayDay.basePrice = holidayBasePrice;
        holidayDay.totalPrice = holidayTotalPrice;
        holidayDay.surchargeAmount = surchargeAmount;
        
        holidayDaysFee += holidayTotalPrice;
        totalHolidaySurcharge += surchargeAmount;
    });
    
    if (lambda > 0) {
        console.log("🔴 [WHITEBOARD] Holiday days (C):", {
            holidayDays: lambda,
            holidayDaysFee: holidayDaysFee.toLocaleString(),
            totalSurcharge: totalHolidaySurcharge.toLocaleString(),
            formula: "A × (1 + %holiday - %mem - %monthly)",
        });
    }

    // ========================================================================
    // REMOVED: OLD MULTIPLICATIVE HOLIDAY LOGIC
    // ========================================================================
    // const holidayTotalPrice = Math.round(dailyRate * holidayMultiplier * combinedDiscountRate);
    // ❌ This was WRONG - should be additive, not multiplicative

    // Step 7: Calculate D - Total rental fee
    const totalRentalFee = normalDaysFee + holidayDaysFee;
    
    // Calculate base without any discounts for display
    const baseWithoutDiscounts = Math.round(dailyRate * totalDays);
    const totalDiscountAmount = baseWithoutDiscounts - totalRentalFee + totalHolidaySurcharge;
    const membershipDiscountAmount = Math.round(dailyRate * totalDays * membershipDiscountDecimal);
    
    console.log("💚 [WHITEBOARD] Final (D = B + C):", {
        normalDaysFee: normalDaysFee.toLocaleString(),
        holidayDaysFee: holidayDaysFee.toLocaleString(),
        totalRentalFee: totalRentalFee.toLocaleString(),
    });

    return {
        baseRentalFee: baseWithoutDiscounts,
        discountAmount: totalDiscountAmount,
        holidaySurcharge: totalHolidaySurcharge,
        totalRentalFee: totalRentalFee,
        holidayDays,
        progressiveTierBreakdown: tierBreakdown,
        membershipDiscountAmount,
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