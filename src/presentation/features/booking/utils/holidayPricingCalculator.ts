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

export interface PartialDayDetail {
    date: Date;
    hours: number;
    isHoliday: boolean;
    holiday?: HolidayPricing;
    basePrice: number;
    surchargeAmount: number;
    totalPrice: number;
    type: "start" | "end";
}

export interface FourComponentResult {
    // Start Partial
    startPartial: PartialDayDetail | null;
    startPartialAmount: number;

    // B - Normal Full Days
    normalFullDays: number;
    normalFullDaysAmount: number;

    // C - Holiday Full Days
    holidayFullDays: HolidayDay[];
    holidayFullDaysAmount: number;

    // End Partial
    endPartial: PartialDayDetail | null;
    endPartialAmount: number;

    // Totals
    baseRentalFee: number;
    discountAmount: number;
    holidaySurcharge: number;
    totalRentalFee: number;
    membershipDiscountAmount: number;
}

export interface ProgressiveTierBreakdown {
    discountedHours: number;
    regularHours: number;
    discountTier: "yearly" | "monthly" | "none";
}

/**
 * Constants
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
 * Determine discount tier qualification
 */
const determineDiscountTier = (totalHours: number): {
    discountTier: "yearly" | "monthly" | "none";
    appliesTo: "all" | "none";
} => {
    const totalDays = totalHours / HOURS_PER_DAY;

    if (totalDays >= YEARLY_THRESHOLD_DAYS) {
        return { discountTier: "yearly", appliesTo: "all" };
    }

    if (totalDays >= MONTHLY_THRESHOLD_DAYS) {
        return { discountTier: "monthly", appliesTo: "all" };
    }

    return { discountTier: "none", appliesTo: "none" };
};

/**
 * NEW: Calculate 4-component rental fee
 * 
 * D = StartPartial + B + C + EndPartial + insurance + deposit
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param dailyRate - Price per day (A)
 * @param totalHours - Total rental hours
 * @param holidays - List of holiday pricings
 * @param configDiscountRate - Config discount rate (e.g., 0.90 for 10% off)
 * @param membershipDiscountPercentage - Membership discount % (e.g., 5 for 5%)
 */
export const calculateCombinedRentalFee = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    totalHours: number,
    holidays: HolidayPricing[],
    configDiscountRate: number,
    membershipDiscountPercentage: number = 0
): FourComponentResult => {
    const hourlyRate = dailyRate / HOURS_PER_DAY;

    // Determine discount tier
    const tierQualification = determineDiscountTier(totalHours);
    const configDiscountPercentage = (1 - configDiscountRate) * 100;
    const configDiscountDecimal = configDiscountPercentage / 100;
    const membershipDiscountDecimal = membershipDiscountPercentage / 100;
    const combinedDiscountRate = 1 - membershipDiscountDecimal - configDiscountDecimal;

    console.log("🔧 [4-COMPONENT] Discount setup:", {
        configDiscount: `${configDiscountPercentage.toFixed(1)}%`,
        membershipDiscount: `${membershipDiscountPercentage}%`,
        combinedRate: combinedDiscountRate.toFixed(3),
        tierQualification: tierQualification.discountTier,
    });

    // ========================================================================
    // STEP 1: Calculate StartPartial
    // ========================================================================
    let startPartial: PartialDayDetail | null = null;
    let startPartialAmount = 0;

    const startHour = startDate.getHours();
    const startRemainingHours = 24 - startHour;

    // Check if start date is a holiday
    const startDateNormalized = new Date(startDate);
    startDateNormalized.setHours(0, 0, 0, 0);
    const startHoliday = findHolidayForDate(startDateNormalized, holidays);

    if (isSameDay(startDate, endDate)) {
        // Same day rental - only calculate total hours
        const sameDayHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        
        let multiplier = combinedDiscountRate; // Default: normal
        if (startHoliday) {
            const holidaySurchargePercentage = startHoliday.priceMultiplier - 1;
            multiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
        }

        const totalPrice = Math.round(hourlyRate * sameDayHours * multiplier);
        const basePrice = Math.round(hourlyRate * sameDayHours * combinedDiscountRate);
        const surcharge = startHoliday ? totalPrice - basePrice : 0;

        startPartial = {
            date: startDateNormalized,
            hours: sameDayHours,
            isHoliday: !!startHoliday,
            holiday: startHoliday || undefined,
            basePrice,
            surchargeAmount: surcharge,
            totalPrice,
            type: "start",
        };
        startPartialAmount = totalPrice;

        console.log("🟡 [StartPartial - Same Day]:", {
            hours: sameDayHours,
            isHoliday: !!startHoliday,
            amount: startPartialAmount,
        });

        // Same day rental - no B, C, or EndPartial
        return {
            startPartial,
            startPartialAmount,
            normalFullDays: 0,
            normalFullDaysAmount: 0,
            holidayFullDays: [],
            holidayFullDaysAmount: 0,
            endPartial: null,
            endPartialAmount: 0,
            baseRentalFee: Math.round(hourlyRate * sameDayHours),
            discountAmount: 0,
            holidaySurcharge: surcharge,
            totalRentalFee: startPartialAmount,
            membershipDiscountAmount: Math.round(hourlyRate * sameDayHours * membershipDiscountDecimal),
        };
    }

    // Multi-day rental - calculate start partial
    let multiplier = combinedDiscountRate; // Default: normal day
    if (startHoliday) {
        const holidaySurchargePercentage = startHoliday.priceMultiplier - 1;
        multiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
    }

    const startTotalPrice = Math.round(hourlyRate * startRemainingHours * multiplier);
    const startBasePrice = Math.round(hourlyRate * startRemainingHours * combinedDiscountRate);
    const startSurcharge = startHoliday ? startTotalPrice - startBasePrice : 0;

    startPartial = {
        date: startDateNormalized,
        hours: startRemainingHours,
        isHoliday: !!startHoliday,
        holiday: startHoliday || undefined,
        basePrice: startBasePrice,
        surchargeAmount: startSurcharge,
        totalPrice: startTotalPrice,
        type: "start",
    };
    startPartialAmount = startTotalPrice;

    console.log("🟡 [StartPartial]:", {
        date: startDateNormalized.toDateString(),
        hours: startRemainingHours,
        isHoliday: !!startHoliday,
        amount: startPartialAmount,
    });

    // ========================================================================
    // STEP 2: Calculate EndPartial
    // ========================================================================
    let endPartial: PartialDayDetail | null = null;
    let endPartialAmount = 0;

    const endHour = endDate.getHours();
    const endDateNormalized = new Date(endDate);
    endDateNormalized.setHours(0, 0, 0, 0);
    const endHoliday = findHolidayForDate(endDateNormalized, holidays);

    let endMultiplier = combinedDiscountRate; // Default: normal day
    if (endHoliday) {
        const holidaySurchargePercentage = endHoliday.priceMultiplier - 1;
        endMultiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
    }

    const endTotalPrice = Math.round(hourlyRate * endHour * endMultiplier);
    const endBasePrice = Math.round(hourlyRate * endHour * combinedDiscountRate);
    const endSurcharge = endHoliday ? endTotalPrice - endBasePrice : 0;

    endPartial = {
        date: endDateNormalized,
        hours: endHour,
        isHoliday: !!endHoliday,
        holiday: endHoliday || undefined,
        basePrice: endBasePrice,
        surchargeAmount: endSurcharge,
        totalPrice: endTotalPrice,
        type: "end",
    };
    endPartialAmount = endTotalPrice;

    console.log("🟡 [EndPartial]:", {
        date: endDateNormalized.toDateString(),
        hours: endHour,
        isHoliday: !!endHoliday,
        amount: endPartialAmount,
    });

    // ========================================================================
    // STEP 3: Get all FULL days between start and end (exclude partials)
    // ========================================================================
    const fullDayStart = new Date(startDateNormalized);
    fullDayStart.setDate(fullDayStart.getDate() + 1); // Day after start

    const fullDayEnd = new Date(endDateNormalized); // Day of end (but we don't include it)

    const fullDays: Date[] = [];
    const current = new Date(fullDayStart);
    
    while (current < fullDayEnd) {
        fullDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    console.log("📅 [Full Days Between]:", {
        count: fullDays.length,
        range: fullDays.length > 0 
            ? `${fullDays[0].toDateString()} → ${fullDays[fullDays.length - 1].toDateString()}`
            : "none",
    });

    // ========================================================================
    // STEP 4: Separate B (normal full days) and C (holiday full days)
    // ========================================================================
    const holidayFullDays: HolidayDay[] = [];
    let normalFullDaysCount = 0;

    fullDays.forEach((day, index) => {
        const holiday = findHolidayForDate(day, holidays);
        
        if (holiday) {
            // This is a holiday full day (C)
            const holidaySurchargePercentage = holiday.priceMultiplier - 1;
            const holidayRate = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
            const holidayTotalPrice = Math.round(dailyRate * holidayRate);
            const holidayBasePrice = Math.round(dailyRate * combinedDiscountRate);
            const surchargeAmount = holidayTotalPrice - holidayBasePrice;

            holidayFullDays.push({
                date: day,
                holiday,
                dayIndex: index,
                isInDiscountedPeriod: tierQualification.appliesTo === "all",
                basePrice: holidayBasePrice,
                surchargeAmount,
                totalPrice: holidayTotalPrice,
            });
        } else {
            // This is a normal full day (B)
            normalFullDaysCount++;
        }
    });

    const normalFullDaysAmount = Math.round(dailyRate * normalFullDaysCount * combinedDiscountRate);
    const holidayFullDaysAmount = holidayFullDays.reduce((sum, h) => sum + h.totalPrice, 0);

    console.log("🔵 [B - Normal Full Days]:", {
        count: normalFullDaysCount,
        amount: normalFullDaysAmount,
    });

    console.log("🔴 [C - Holiday Full Days]:", {
        count: holidayFullDays.length,
        amount: holidayFullDaysAmount,
    });

    // ========================================================================
    // STEP 5: Calculate totals
    // ========================================================================
    const totalRentalFee = startPartialAmount + normalFullDaysAmount + holidayFullDaysAmount + endPartialAmount;
    const totalDays = totalHours / HOURS_PER_DAY;
    const baseWithoutDiscounts = Math.round(dailyRate * totalDays);
    const totalHolidaySurcharge = startSurcharge + endSurcharge + holidayFullDays.reduce((sum, h) => sum + h.surchargeAmount, 0);
    const membershipDiscountAmount = Math.round(dailyRate * totalDays * membershipDiscountDecimal);

    console.log("💚 [TOTAL - 4 Components]:", {
        startPartial: startPartialAmount,
        B: normalFullDaysAmount,
        C: holidayFullDaysAmount,
        endPartial: endPartialAmount,
        total: totalRentalFee,
    });

    return {
        startPartial,
        startPartialAmount,
        normalFullDays: normalFullDaysCount,
        normalFullDaysAmount,
        holidayFullDays,
        holidayFullDaysAmount,
        endPartial,
        endPartialAmount,
        baseRentalFee: baseWithoutDiscounts,
        discountAmount: baseWithoutDiscounts - totalRentalFee + totalHolidaySurcharge,
        holidaySurcharge: totalHolidaySurcharge,
        totalRentalFee,
        membershipDiscountAmount,
    };
};

/**
 * Legacy function for backward compatibility
 */
export const calculateHolidayPricing = (): any => {
    throw new Error("Use calculateCombinedRentalFee instead");
};

export const formatHolidaySurchargeDisplay = (): string => {
    throw new Error("Use calculateCombinedRentalFee instead");
};