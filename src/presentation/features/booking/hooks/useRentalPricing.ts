import { useMemo } from "react";
import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";
import {
    calculateCombinedRentalFee,
    FourComponentResult,
    HolidayDay,
    PartialDayDetail,
    ProgressiveTierBreakdown,
} from "../utils/holidayPricingCalculator";
import { useMembershipDiscount } from "./membership/useMembershipDiscount";
import { useHolidayPricing } from "./useHolidayPricing";
import { useRentingRate, VehicleCategory } from "./useRentingRate";

export interface RentalPricingResult {
    // Configuration discount
    rentingRate: number;
    discountPercentage: number;
    durationType: "daily" | "monthly" | "yearly";

    // Progressive tier breakdown
    progressiveTierBreakdown: ProgressiveTierBreakdown;

    // Membership discount
    membershipDiscountPercentage: number;
    membershipTier: string;
    membershipDiscountAmount: number;

    // 4-Component System
    startPartial: PartialDayDetail | null;
    startPartialAmount: number;
    normalFullDays: number;
    normalFullDaysAmount: number;
    holidayFullDays: HolidayDay[];
    holidayFullDaysAmount: number;
    endPartial: PartialDayDetail | null;
    endPartialAmount: number;

    // Legacy holiday info (for compatibility)
    holidays: HolidayPricing[];
    holidayDays: HolidayDay[]; // All holiday days (full + partials)
    holidaySurcharge: number;
    hasHolidaySurcharge: boolean;

    // Final amounts
    baseRentalFee: number;
    discountAmount: number;
    totalRentalFee: number;
    averageRentalPrice: number;

    // Loading state
    loading: boolean;
    error: string | null;
}

/**
 * UPDATED: Hook for calculating rental pricing with 4-COMPONENT SYSTEM
 * 
 * New Formula:
 * D = StartPartial + B + C + EndPartial + insurance + deposit
 * 
 * Where:
 * - StartPartial = (A / 24) × startHours × multiplier_start
 * - B = A × normalFullDays × (1 - %mem - %monthly)
 * - C = A × holidayFullDays × (1 + %holiday - %mem - %monthly)
 * - EndPartial = (A / 24) × endHours × multiplier_end
 * 
 * @param startDate - Rental start date/time
 * @param endDate - Rental end date/time
 * @param dailyRate - Price per day (24 hours)
 * @param totalHours - Total rental hours (from useRentalDuration)
 * @param vehicleCategory - Vehicle category for discount calculation
 */
export const useRentalPricing = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    totalHours: number,
    vehicleCategory: VehicleCategory
): RentalPricingResult => {
    // Calculate equivalent days for discount tier determination (whole days only)
    const equivalentDays = Math.floor(totalHours / 24);

    // Calculate exact days including hours for accurate average price (e.g., 7.5 days)
    const totalDaysExact = totalHours / 24;

    // Fetch configuration discount based on total days
    const {
        rentingRate,
        discountPercentage,
        durationType,
        loading: rateLoading,
    } = useRentingRate(equivalentDays, vehicleCategory);

    // Fetch membership discount
    const {
        discountPercentage: membershipDiscountPercentage,
        tierName: membershipTier,
        loading: membershipLoading,
    } = useMembershipDiscount();

    // Fetch holiday pricing
    const {
        holidays,
        loading: holidayLoading,
        error: holidayError,
    } = useHolidayPricing();

    // Calculate 4-component pricing
    const pricing = useMemo(() => {
        if (rateLoading || membershipLoading || holidayLoading) {
            const hourlyRate = dailyRate / 24;
            const baseEstimate = hourlyRate * totalHours;

            const emptyResult: FourComponentResult = {
                startPartial: null,
                startPartialAmount: 0,
                normalFullDays: 0,
                normalFullDaysAmount: 0,
                holidayFullDays: [],
                holidayFullDaysAmount: 0,
                endPartial: null,
                endPartialAmount: 0,
                baseRentalFee: baseEstimate,
                discountAmount: 0,
                holidaySurcharge: 0,
                totalRentalFee: baseEstimate,
                membershipDiscountAmount: 0,
            };

            return emptyResult;
        }

        const result = calculateCombinedRentalFee(
            startDate,
            endDate,
            dailyRate,
            totalHours,
            holidays,
            rentingRate,
            membershipDiscountPercentage
        );

        // console.log("💰 [useRentalPricing] 4-Component Breakdown:", {
        //     totalHours,
        //     equivalentDays,
        //     totalDaysExact,
        //     durationType,
        //     configDiscount: `${discountPercentage}%`,
        //     membershipDiscount: `${membershipDiscountPercentage}%`,
        //     components: {
        //         startPartial: result.startPartialAmount,
        //         normalFullDays: result.normalFullDaysAmount,
        //         holidayFullDays: result.holidayFullDaysAmount,
        //         endPartial: result.endPartialAmount,
        //     },
        //     finalTotal: result.totalRentalFee,
        // });

        return result;
    }, [
        startDate,
        endDate,
        dailyRate,
        totalHours,
        holidays,
        rentingRate,
        membershipDiscountPercentage,
        rateLoading,
        membershipLoading,
        holidayLoading,
        discountPercentage,
        equivalentDays,
        durationType,
    ]);

    // Calculate average price per day for display (using exact days with hours)
    // Example: 7 days 12 hours = 7.5 days → 750,000đ / 7.5 = 100,000đ/ngày
    const averageRentalPrice = totalDaysExact > 0
        ? (pricing.totalRentalFee / totalDaysExact)
        : dailyRate;

    // Combine all holiday days (full + partials) for legacy compatibility
    const allHolidayDays: HolidayDay[] = [
        ...pricing.holidayFullDays,
        // Add start partial if it's a holiday
        ...(pricing.startPartial?.isHoliday && pricing.startPartial.holiday ? [{
            date: pricing.startPartial.date,
            holiday: pricing.startPartial.holiday,
            dayIndex: -1, // Special index for partial
            isInDiscountedPeriod: true,
            basePrice: pricing.startPartial.basePrice,
            surchargeAmount: pricing.startPartial.surchargeAmount,
            totalPrice: pricing.startPartial.totalPrice,
        }] : []),
        // Add end partial if it's a holiday
        ...(pricing.endPartial?.isHoliday && pricing.endPartial.holiday ? [{
            date: pricing.endPartial.date,
            holiday: pricing.endPartial.holiday,
            dayIndex: -2, // Special index for partial
            isInDiscountedPeriod: true,
            basePrice: pricing.endPartial.basePrice,
            surchargeAmount: pricing.endPartial.surchargeAmount,
            totalPrice: pricing.endPartial.totalPrice,
        }] : []),
    ];

    // Create tier breakdown for compatibility
    const tierBreakdown: ProgressiveTierBreakdown = {
        discountedHours: equivalentDays >= 30 ? totalHours : 0,
        regularHours: equivalentDays < 30 ? totalHours : 0,
        discountTier: durationType === "yearly" ? "yearly" : durationType === "monthly" ? "monthly" : "none",
    };

    return {
        // Configuration discount
        rentingRate,
        discountPercentage,
        durationType,

        // Progressive tier breakdown
        progressiveTierBreakdown: tierBreakdown,

        // Membership discount
        membershipDiscountPercentage,
        membershipTier,
        membershipDiscountAmount: pricing.membershipDiscountAmount,

        // 4-Component System
        startPartial: pricing.startPartial,
        startPartialAmount: pricing.startPartialAmount,
        normalFullDays: pricing.normalFullDays,
        normalFullDaysAmount: pricing.normalFullDaysAmount,
        holidayFullDays: pricing.holidayFullDays,
        holidayFullDaysAmount: pricing.holidayFullDaysAmount,
        endPartial: pricing.endPartial,
        endPartialAmount: pricing.endPartialAmount,

        // Legacy holiday info
        holidays,
        holidayDays: allHolidayDays,
        holidaySurcharge: pricing.holidaySurcharge,
        hasHolidaySurcharge: pricing.holidaySurcharge > 0,

        // Final amounts
        baseRentalFee: pricing.baseRentalFee,
        discountAmount: pricing.discountAmount,
        totalRentalFee: pricing.totalRentalFee,
        averageRentalPrice,

        // Loading state
        loading: rateLoading || membershipLoading || holidayLoading,
        error: holidayError,
    };
};