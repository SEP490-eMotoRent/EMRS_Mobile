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
    startPartial: PartialDayDetail | null;
    startPartialAmount: number;
    normalFullDays: number;
    normalFullDaysAmount: number;
    holidayFullDays: HolidayDay[];
    holidayFullDaysAmount: number;
    endPartial: PartialDayDetail | null;
    endPartialAmount: number;
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

const MONTHLY_THRESHOLD_DAYS = 30;
const YEARLY_THRESHOLD_DAYS = 365;
const HOURS_PER_DAY = 24;

const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

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

    const tierQualification = determineDiscountTier(totalHours);
    const configDiscountPercentage = (1 - configDiscountRate) * 100;
    const configDiscountDecimal = configDiscountPercentage / 100;
    const membershipDiscountDecimal = membershipDiscountPercentage / 100;
    const combinedDiscountRate = 1 - membershipDiscountDecimal - configDiscountDecimal;

    // console.log("🔧 [4-COMPONENT] Discount setup:", {
    //     configDiscount: `${configDiscountPercentage.toFixed(1)}%`,
    //     membershipDiscount: `${membershipDiscountPercentage}%`,
    //     combinedRate: combinedDiscountRate.toFixed(3),
    //     tierQualification: tierQualification.discountTier,
    // });

    // ========================================================================
    // STEP 1: Calculate StartPartial
    // ========================================================================
    let startPartial: PartialDayDetail | null = null;
    let startPartialAmount = 0;

    const startHour = startDate.getHours();
    const startRemainingHours = 24 - startHour;

    const startDateNormalized = new Date(startDate);
    startDateNormalized.setHours(0, 0, 0, 0);
    const startHoliday = findHolidayForDate(startDateNormalized, holidays);

    if (isSameDay(startDate, endDate)) {
        // Same day rental - only calculate total hours
        const sameDayHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
        
        let multiplier = combinedDiscountRate;
        if (startHoliday) {
            const holidaySurchargePercentage = startHoliday.priceMultiplier - 1;
            multiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
        }

        // Keep precision during calculation
        const totalPrice = hourlyRate * sameDayHours * multiplier;
        const basePrice = hourlyRate * sameDayHours * combinedDiscountRate;
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

        // console.log("🟡 [StartPartial - Same Day]:", {
        //     hours: sameDayHours,
        //     isHoliday: !!startHoliday,
        //     amount: startPartialAmount,
        // });

        // Same day rental - no B, C, or EndPartial
        // ROUND ONLY AT RETURN
        return {
            startPartial: {
                ...startPartial,
                basePrice: Math.round(basePrice),
                surchargeAmount: Math.round(surcharge),
                totalPrice: Math.round(totalPrice),
            },
            startPartialAmount: Math.round(startPartialAmount),
            normalFullDays: 0,
            normalFullDaysAmount: 0,
            holidayFullDays: [],
            holidayFullDaysAmount: 0,
            endPartial: null,
            endPartialAmount: 0,
            baseRentalFee: Math.round(hourlyRate * sameDayHours),
            discountAmount: 0,
            holidaySurcharge: Math.round(surcharge),
            totalRentalFee: Math.round(startPartialAmount),
            membershipDiscountAmount: Math.round(hourlyRate * sameDayHours * membershipDiscountDecimal),
        };
    }

    // Multi-day rental - calculate start partial
    let multiplier = combinedDiscountRate;
    if (startHoliday) {
        const holidaySurchargePercentage = startHoliday.priceMultiplier - 1;
        multiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
    }

    // Keep precision during calculation
    const startTotalPrice = hourlyRate * startRemainingHours * multiplier;
    const startBasePrice = hourlyRate * startRemainingHours * combinedDiscountRate;
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

    // console.log("🟡 [StartPartial]:", {
    //     date: startDateNormalized.toDateString(),
    //     hours: startRemainingHours,
    //     isHoliday: !!startHoliday,
    //     amount: startPartialAmount,
    // });

    // ========================================================================
    // STEP 2: Calculate EndPartial
    // ========================================================================
    let endPartial: PartialDayDetail | null = null;
    let endPartialAmount = 0;

    const endHour = endDate.getHours();
    const endDateNormalized = new Date(endDate);
    endDateNormalized.setHours(0, 0, 0, 0);
    const endHoliday = findHolidayForDate(endDateNormalized, holidays);

    let endMultiplier = combinedDiscountRate;
    if (endHoliday) {
        const holidaySurchargePercentage = endHoliday.priceMultiplier - 1;
        endMultiplier = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
    }

    // Keep precision during calculation
    const endTotalPrice = hourlyRate * endHour * endMultiplier;
    const endBasePrice = hourlyRate * endHour * combinedDiscountRate;
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

    // console.log("🟡 [EndPartial]:", {
    //     date: endDateNormalized.toDateString(),
    //     hours: endHour,
    //     isHoliday: !!endHoliday,
    //     amount: endPartialAmount,
    // });

    // ========================================================================
    // STEP 3: Get all FULL days between start and end (exclude partials)
    // ========================================================================
    const fullDayStart = new Date(startDateNormalized);
    fullDayStart.setDate(fullDayStart.getDate() + 1);

    const fullDayEnd = new Date(endDateNormalized);

    const fullDays: Date[] = [];
    const current = new Date(fullDayStart);
    
    while (current < fullDayEnd) {
        fullDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }

    // console.log("📅 [Full Days Between]:", {
    //     count: fullDays.length,
    //     range: fullDays.length > 0 
    //         ? `${fullDays[0].toDateString()} → ${fullDays[fullDays.length - 1].toDateString()}`
    //         : "none",
    // });

    // ========================================================================
    // STEP 4: Separate B (normal full days) and C (holiday full days)
    // ========================================================================
    const holidayFullDays: HolidayDay[] = [];
    let normalFullDaysCount = 0;

    fullDays.forEach((day, index) => {
        const holiday = findHolidayForDate(day, holidays);
        
        if (holiday) {
            const holidaySurchargePercentage = holiday.priceMultiplier - 1;
            const holidayRate = 1 + holidaySurchargePercentage - membershipDiscountDecimal - configDiscountDecimal;
            
            // Keep precision during calculation
            const holidayTotalPrice = dailyRate * holidayRate;
            const holidayBasePrice = dailyRate * combinedDiscountRate;
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
            normalFullDaysCount++;
        }
    });

    // Keep precision during calculation
    const normalFullDaysAmount = dailyRate * normalFullDaysCount * combinedDiscountRate;
    const holidayFullDaysAmount = holidayFullDays.reduce((sum, h) => sum + h.totalPrice, 0);

    // console.log("🔵 [B - Normal Full Days]:", {
    //     count: normalFullDaysCount,
    //     amount: normalFullDaysAmount,
    // });

    // console.log("🔴 [C - Holiday Full Days]:", {
    //     count: holidayFullDays.length,
    //     amount: holidayFullDaysAmount,
    // });

    // ========================================================================
    // STEP 5: Calculate totals
    // ========================================================================
    const totalRentalFee = startPartialAmount + normalFullDaysAmount + holidayFullDaysAmount + endPartialAmount;
    const totalDays = totalHours / HOURS_PER_DAY;
    
    // Keep precision during calculation
    const baseWithoutDiscounts = dailyRate * totalDays;
    const totalHolidaySurcharge = startSurcharge + endSurcharge + holidayFullDays.reduce((sum, h) => sum + h.surchargeAmount, 0);
    const membershipDiscountAmount = dailyRate * totalDays * membershipDiscountDecimal;

    // console.log("💚 [TOTAL - 4 Components]:", {
    //     startPartial: startPartialAmount,
    //     B: normalFullDaysAmount,
    //     C: holidayFullDaysAmount,
    //     endPartial: endPartialAmount,
    //     total: totalRentalFee,
    // });

    // ROUND ONLY AT FINAL RETURN - to whole đồng
    return {
        startPartial: startPartial ? {
            ...startPartial,
            basePrice: Math.round(startPartial.basePrice),
            surchargeAmount: Math.round(startPartial.surchargeAmount),
            totalPrice: Math.round(startPartial.totalPrice),
        } : null,
        startPartialAmount: Math.round(startPartialAmount),
        normalFullDays: normalFullDaysCount,
        normalFullDaysAmount: Math.round(normalFullDaysAmount),
        holidayFullDays: holidayFullDays.map(h => ({
            ...h,
            basePrice: Math.round(h.basePrice),
            surchargeAmount: Math.round(h.surchargeAmount),
            totalPrice: Math.round(h.totalPrice),
        })),
        holidayFullDaysAmount: Math.round(holidayFullDaysAmount),
        endPartial: endPartial ? {
            ...endPartial,
            basePrice: Math.round(endPartial.basePrice),
            surchargeAmount: Math.round(endPartial.surchargeAmount),
            totalPrice: Math.round(endPartial.totalPrice),
        } : null,
        endPartialAmount: Math.round(endPartialAmount),
        baseRentalFee: Math.round(baseWithoutDiscounts),
        discountAmount: Math.round(baseWithoutDiscounts - totalRentalFee + totalHolidaySurcharge),
        holidaySurcharge: Math.round(totalHolidaySurcharge),
        totalRentalFee: Math.round(totalRentalFee),
        membershipDiscountAmount: Math.round(membershipDiscountAmount),
    };
};

export const calculateHolidayPricing = (): any => {
    throw new Error("Use calculateCombinedRentalFee instead");
};

export const formatHolidaySurchargeDisplay = (): string => {
    throw new Error("Use calculateCombinedRentalFee instead");
};