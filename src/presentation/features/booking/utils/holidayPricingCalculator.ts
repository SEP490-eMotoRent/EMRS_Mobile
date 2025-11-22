import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";

export interface HolidayDay {
    date: Date;
    holiday: HolidayPricing;
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
 * Get all dates in a range (inclusive of start, exclusive of end for rental logic)
 */
const getDatesInRange = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = [];
    const current = new Date(startDate);
    current.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    while (current < end) {
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
 * Calculate holiday pricing for a rental period
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

    for (const date of rentalDates) {
        const holiday = findHolidayForDate(date, holidays);
        
        if (holiday) {
            const surchargeAmount = dailyRate * (holiday.priceMultiplier - 1);
            const totalPrice = dailyRate * holiday.priceMultiplier;

            holidayDays.push({
                date,
                holiday,
                basePrice: dailyRate,
                surchargeAmount,
                totalPrice,
            });

            totalSurcharge += surchargeAmount;

            if (holiday.priceMultiplier > maxMultiplier) {
                maxMultiplier = holiday.priceMultiplier;
            }
        }
    }

    const totalDays = rentalDates.length;
    const normalDays = totalDays - holidayDays.length;
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
 * Calculate combined pricing with Configuration discount + Holiday surcharge
 */
export const calculateCombinedRentalFee = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    holidays: HolidayPricing[],
    configDiscountRate: number // e.g., 0.90 for 10% off
): {
    baseRentalFee: number;
    discountAmount: number;
    holidaySurcharge: number;
    totalRentalFee: number;
    holidayDays: HolidayDay[];
} => {
    const rentalDates = getDatesInRange(startDate, endDate);
    const totalDays = rentalDates.length;

    // Step 1: Calculate base rental (all days at daily rate)
    const baseRentalFee = totalDays * dailyRate;

    // Step 2: Apply configuration discount (monthly/yearly)
    const discountedRentalFee = baseRentalFee * configDiscountRate;
    const discountAmount = baseRentalFee - discountedRentalFee;

    // Step 3: Calculate holiday surcharge on DISCOUNTED daily rate
    const discountedDailyRate = dailyRate * configDiscountRate;
    const holidayResult = calculateHolidayPricing(
        startDate,
        endDate,
        discountedDailyRate,
        holidays
    );

    // Step 4: Final total = discounted rental + holiday surcharge
    const totalRentalFee = discountedRentalFee + holidayResult.totalSurcharge;

    return {
        baseRentalFee,
        discountAmount,
        holidaySurcharge: holidayResult.totalSurcharge,
        totalRentalFee,
        holidayDays: holidayResult.holidayDays,
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