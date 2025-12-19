import { useMemo } from "react";
import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";
import {
    calculateCombinedRentalFee,
    HolidayDay,
    ProgressiveTierBreakdown,
} from "../utils/holidayPricingCalculator";
import { useHolidayPricing } from "./useHolidayPricing";
import { useRentingRate, VehicleCategory } from "./useRentingRate";
import { useMembershipDiscount } from "./membership/useMembershipDiscount";

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

    // Holiday surcharge
    holidays: HolidayPricing[];
    holidayDays: HolidayDay[];
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
 * UPDATED: Hook for calculating rental pricing with progressive tier hourly pricing
 * NOW USING WHITEBOARD FORMULA (Subtractive Discounts)
 * 
 * Whiteboard Formula:
 * A = Base price per day
 * B = Normal days = A × (days - λ) × (1 - %mem - %month)
 * C = Holiday days = A × λ × (1 + %holiday) × (1 - %mem - %month)
 * D = B + C
 * 
 * KEY CHANGE: Membership discount is now applied SUBTRACTIVELY with config discount
 * Previously: Sequential application (base × config × membership)
 * Now: Subtractive application (base × (1 - config - membership))
 * 
 * Example:
 * - Config discount: 10%
 * - Membership discount: 5%
 * - Old method: 0.90 × 0.95 = 0.855 (14.5% off)
 * - New method: 1 - 0.10 - 0.05 = 0.85 (15% off) ✅
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

    // Calculate combined pricing with progressive tiers + WHITEBOARD FORMULA
    const pricing = useMemo(() => {
        if (rateLoading || membershipLoading || holidayLoading) {
            const hourlyRate = dailyRate / 24;
            const baseEstimate = Math.round(hourlyRate * totalHours);

            return {
                baseRentalFee: baseEstimate,
                discountAmount: 0,
                holidaySurcharge: 0,
                totalRentalFee: baseEstimate,
                holidayDays: [] as HolidayDay[],
                membershipDiscountAmount: 0,
                progressiveTierBreakdown: {
                    discountedHours: 0,
                    regularHours: totalHours,
                    discountTier: "none" as const,
                },
            };
        }

        // ⭐ KEY CHANGE: Now passing membershipDiscountPercentage to calculator
        // This enables SUBTRACTIVE discount calculation (1 - %mem - %month)
        const result = calculateCombinedRentalFee(
            startDate,
            endDate,
            dailyRate,
            totalHours,
            holidays,
            rentingRate,
            membershipDiscountPercentage // ← NEW PARAMETER
        );

        console.log("💰 [useRentalPricing] Pricing breakdown:", {
            totalHours,
            equivalentDays,
            totalDaysExact,
            durationType,
            configDiscount: `${discountPercentage}%`,
            membershipDiscount: `${membershipDiscountPercentage}%`,
            combinedDiscount: `${(discountPercentage + membershipDiscountPercentage)}%`,
            discountMethod: "SUBTRACTIVE (Whiteboard Formula)",
            progressiveTiers: result.progressiveTierBreakdown,
            baseRentalFee: result.baseRentalFee,
            discountAmount: result.discountAmount,
            holidaySurcharge: result.holidaySurcharge,
            membershipDiscountAmount: result.membershipDiscountAmount,
            finalTotal: result.totalRentalFee,
        });

        return result;
    }, [
        startDate,
        endDate,
        dailyRate,
        totalHours,
        holidays,
        rentingRate,
        membershipDiscountPercentage, // ← Added to dependencies
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
        ? Math.round(pricing.totalRentalFee / totalDaysExact)
        : dailyRate;

    return {
        // Configuration discount
        rentingRate,
        discountPercentage,
        durationType,

        // Progressive tier breakdown
        progressiveTierBreakdown: pricing.progressiveTierBreakdown,

        // Membership discount
        membershipDiscountPercentage,
        membershipTier,
        membershipDiscountAmount: pricing.membershipDiscountAmount,

        // Holiday surcharge
        holidays,
        holidayDays: pricing.holidayDays,
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