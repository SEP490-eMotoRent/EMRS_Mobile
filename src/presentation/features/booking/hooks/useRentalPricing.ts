import { useMemo } from "react";
import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";
import {
    calculateCombinedRentalFee,
    HolidayDay,
} from "../utils/holidayPricingCalculator";
import { useHolidayPricing } from "./useHolidayPricing";
import { useRentingRate, VehicleCategory } from "./useRentingRate";
import { useMembershipDiscount } from "./membership/useMembershipDiscount";

export interface RentalPricingResult {
    // Configuration discount
    rentingRate: number;
    discountPercentage: number;
    durationType: "daily" | "monthly" | "yearly";

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

export const useRentalPricing = (
    startDate: Date,
    endDate: Date,
    dailyRate: number,
    rentalDays: number,
    vehicleCategory: VehicleCategory
): RentalPricingResult => {
    // Fetch configuration discount
    const {
        rentingRate,
        discountPercentage,
        durationType,
        loading: rateLoading,
    } = useRentingRate(rentalDays, vehicleCategory);

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

    // Calculate combined pricing
    const pricing = useMemo(() => {
        if (rateLoading || membershipLoading || holidayLoading) {
            return {
                baseRentalFee: rentalDays * dailyRate,
                discountAmount: 0,
                holidaySurcharge: 0,
                totalRentalFee: rentalDays * dailyRate,
                holidayDays: [] as HolidayDay[],
                membershipDiscountAmount: 0,
            };
        }

        // Step 1: Original calculation (config discount + holiday surcharge)
        const basePricing = calculateCombinedRentalFee(
            startDate,
            endDate,
            dailyRate,
            holidays,
            rentingRate
        );

        // Step 2: Apply membership discount on top (sequential)
        const membershipRate = 1 - (membershipDiscountPercentage / 100);
        const membershipDiscountAmount = basePricing.totalRentalFee * (membershipDiscountPercentage / 100);
        const finalTotalRentalFee = basePricing.totalRentalFee * membershipRate;

        return {
            ...basePricing,
            totalRentalFee: finalTotalRentalFee,
            membershipDiscountAmount,
        };
    }, [startDate, endDate, dailyRate, holidays, rentingRate, membershipDiscountPercentage, rateLoading, membershipLoading, holidayLoading, rentalDays]);

    const averageRentalPrice = rentalDays > 0 
        ? Math.round(pricing.totalRentalFee / rentalDays) 
        : dailyRate;

    return {
        // Configuration discount
        rentingRate,
        discountPercentage,
        durationType,

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