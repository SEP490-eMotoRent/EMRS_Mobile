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
 * Hook for calculating rental pricing with progressive tier hourly pricing
 * 
 * Progressive Tier Formula:
 * - 70 days → 60 days discounted (2 months), 10 days regular
 * - Base = (Hourly_Rate × Discounted_Hours × 0.90) + (Hourly_Rate × Regular_Hours)
 * - Holiday surcharge applied to the rate of each specific day
 * - Membership discount applied on top of everything
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
    // Calculate equivalent days for discount tier determination
    const equivalentDays = Math.floor(totalHours / 24);

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

    // Calculate combined pricing with progressive tiers
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

        // Step 1: Calculate with progressive tier + holiday surcharge
        const basePricing = calculateCombinedRentalFee(
            startDate,
            endDate,
            dailyRate,
            totalHours,
            holidays,
            rentingRate
        );

        // Step 2: Apply membership discount on top (sequential)
        const membershipRate = 1 - (membershipDiscountPercentage / 100);
        const membershipDiscountAmount = Math.round(basePricing.totalRentalFee * (membershipDiscountPercentage / 100));
        const finalTotalRentalFee = Math.round(basePricing.totalRentalFee * membershipRate);

        console.log("💰 Pricing breakdown:", {
            totalHours,
            equivalentDays,
            durationType,
            discountPercentage: `${discountPercentage}%`,
            progressiveTiers: basePricing.progressiveTierBreakdown,
            baseRentalFee: basePricing.baseRentalFee,
            discountAmount: basePricing.discountAmount,
            holidaySurcharge: basePricing.holidaySurcharge,
            beforeMembership: basePricing.totalRentalFee,
            membershipDiscount: membershipDiscountAmount,
            finalTotal: finalTotalRentalFee,
        });

        return {
            ...basePricing,
            totalRentalFee: finalTotalRentalFee,
            membershipDiscountAmount,
        };
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
    ]);

    // Calculate average price per day for display
    const averageRentalPrice = equivalentDays > 0
        ? Math.round(pricing.totalRentalFee / equivalentDays)
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