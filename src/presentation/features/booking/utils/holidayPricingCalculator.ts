import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";

export interface HolidayDay {
    date: Date;
    holiday: HolidayPricing;
    hoursOnThisDay: number;
    baseHourlyRate: number;
    holidayHourlyRate: number;
    surchargeAmount: number;
    totalPrice: number;
}

export interface HolidayPricingResult {
    holidayDays: HolidayDay[];
    holidayDayCount: number;
    totalSurcharge: number;
    baseRentalFee: number;
    totalRentalFee: number;
    maxMultiplier: number;
    summary: string;
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

const getCalendarDate = (date: Date): Date => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
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

const calculateHoursOnDay = (
    startDateTime: Date,
    endDateTime: Date,
    targetDay: Date
): number => {
    const dayStart = new Date(targetDay);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(targetDay);
    dayEnd.setHours(23, 59, 59, 999);
    
    const overlapStart = startDateTime > dayStart ? startDateTime : dayStart;
    const overlapEnd = endDateTime < dayEnd ? endDateTime : dayEnd;
    
    if (overlapStart >= overlapEnd) {
        return 0;
    }
    
    const milliseconds = overlapEnd.getTime() - overlapStart.getTime();
    return milliseconds / (1000 * 60 * 60);
};

const calculateProgressiveTiers = (totalHours: number): ProgressiveTierBreakdown => {
    const totalDays = totalHours / HOURS_PER_DAY;

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

    return {
        discountedHours: 0,
        regularHours: totalHours,
        discountTier: "none",
    };
};

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
    const baseHourlyRate = dailyRate / HOURS_PER_DAY;
    const tierBreakdown = calculateProgressiveTiers(totalHours);
    const { discountedHours } = tierBreakdown;

    const discountedHourlyRate = baseHourlyRate * configDiscountRate;
    
    // Get all calendar days
    const allDays: Date[] = [];
    let currentDay = getCalendarDate(startDate);
    const endDay = getCalendarDate(endDate);
    
    while (currentDay <= endDay) {
        allDays.push(new Date(currentDay));
        currentDay.setDate(currentDay.getDate() + 1);
    }

    // Calculate cost hour-by-hour
    let totalCost = 0;
    let totalRegularCost = 0;
    const holidayDays: HolidayDay[] = [];
    
    allDays.forEach((day) => {
        const hoursOnThisDay = calculateHoursOnDay(startDate, endDate, day);
        
        if (hoursOnThisDay === 0) return;
        
        const holiday = findHolidayForDate(day, holidays);
        
        if (holiday) {
            // Holiday: charge at holiday rate
            const holidayHourlyRate = Math.round(discountedHourlyRate * holiday.priceMultiplier);
            const costForThisDay = Math.round(holidayHourlyRate * hoursOnThisDay);
            const baseForThisDay = Math.round(discountedHourlyRate * hoursOnThisDay);
            const surcharge = costForThisDay - baseForThisDay;
            
            holidayDays.push({
                date: day,
                holiday,
                hoursOnThisDay,
                baseHourlyRate: Math.round(discountedHourlyRate),
                holidayHourlyRate,
                surchargeAmount: surcharge,
                totalPrice: costForThisDay,
            });
            
            totalCost += costForThisDay;
        } else {
            // Regular day
            const costForThisDay = Math.round(discountedHourlyRate * hoursOnThisDay);
            totalCost += costForThisDay;
            totalRegularCost += costForThisDay;
        }
    });

    // Calculate totals
    const baseRentalFee = Math.round(discountedHourlyRate * totalHours);
    const totalSurcharge = totalCost - baseRentalFee;
    const discountAmount = discountedHours > 0 
        ? Math.round((baseHourlyRate - discountedHourlyRate) * totalHours)
        : 0;

    const maxMultiplier = holidayDays.length > 0
        ? Math.max(...holidayDays.map((d) => d.holiday.priceMultiplier))
        : 1;

    const summary = holidayDays.length > 0
        ? `${holidayDays.length} ngày lễ (+${Math.round((maxMultiplier - 1) * 100)}%)`
        : "Không có ngày lễ";

    return {
        baseRentalFee: Math.round(baseRentalFee),
        discountAmount: Math.round(discountAmount),
        holidaySurcharge: Math.round(totalSurcharge),
        totalRentalFee: Math.round(totalCost),
        holidayDays,
        progressiveTierBreakdown: tierBreakdown,
    };
};

export const calculateHolidayPricing = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    holidays: HolidayPricing[]
): HolidayPricingResult => {
    return {
        holidayDays: [],
        holidayDayCount: 0,
        totalSurcharge: 0,
        baseRentalFee: 0,
        totalRentalFee: 0,
        maxMultiplier: 1,
        summary: "",
    };
};

export const formatHolidaySurchargeDisplay = (holidayDays: HolidayDay[]): string => {
    if (holidayDays.length === 0) return "";
    
    const grouped = holidayDays.reduce((acc, day) => {
        const name = day.holiday.holidayName;
        if (!acc[name]) {
            acc[name] = {
                name,
                hours: 0,
                multiplier: day.holiday.priceMultiplier,
                totalSurcharge: 0,
            };
        }
        acc[name].hours += day.hoursOnThisDay;
        acc[name].totalSurcharge += day.surchargeAmount;
        return acc;
    }, {} as Record<string, { name: string; hours: number; multiplier: number; totalSurcharge: number }>);

    return Object.values(grouped)
        .map(g => `${g.name}: ${Math.round(g.hours)}h (+${Math.round((g.multiplier - 1) * 100)}%)`)
        .join("\n");
};