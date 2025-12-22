import { useEffect, useMemo, useState } from "react";
import { container } from "../../../../core/di/ServiceContainer";
import { Configuration } from "../../../../domain/entities/configuration/Configuration";
import { ConfigurationType } from "../../../../domain/entities/configuration/ConfigurationType";

export type VehicleCategory = "ECONOMY" | "STANDARD" | "PREMIUM";
export type DurationType = "daily" | "monthly" | "yearly";

interface RentingRateResult {
    rentingRate: number;
    discountRate: number;
    discountPercentage: number;
    durationType: DurationType;
    loading: boolean;
    error: string | null;
}

/**
 * Hook to calculate renting rate based on rental duration and vehicle category
 * 
 * Discount rules:
 * - < 30 days: No discount (rentingRate = 1.0)
 * - 30-364 days (Monthly): 5% ECONOMY, 10% STANDARD, 15% PREMIUM
 * - 365+ days (Yearly): 8% ECONOMY, 15% STANDARD, 20% PREMIUM
 */
export const useRentingRate = (
    rentalDays: number,
    vehicleCategory: VehicleCategory
): RentingRateResult => {
    const [configs, setConfigs] = useState<Configuration[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConfigs = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await container.configuration.getByType.execute(
                    ConfigurationType.RentingDurationRate
                );
                setConfigs(result);
                // console.log("📊 Renting rate configs loaded:", result.length);
            } catch (err: any) {
                // console.error("❌ Failed to load renting rate configs:", err);
                setError(err.message || "Failed to load configurations");
            } finally {
                setLoading(false);
            }
        };

        fetchConfigs();
    }, []);

    const durationType: DurationType = useMemo(() => {
        if (rentalDays >= 365) return "yearly";
        if (rentalDays >= 30) return "monthly";
        return "daily";
    }, [rentalDays]);

    const discountRate = useMemo(() => {
        if (durationType === "daily") return 0;

        const categoryMap: Record<string, VehicleCategory> = {
            "phổ thông": "ECONOMY",
            "trung cấp": "STANDARD",
            "cao cấp": "PREMIUM",
        };

        const durationKeyword = durationType === "monthly" ? "tháng" : "năm";

        const matchingConfig = configs.find((config) => {
            const title = config.title.toLowerCase();
            const hasCorrectDuration = title.includes(durationKeyword);
            
            const matchedCategory = Object.entries(categoryMap).find(
                ([vnName]) => title.includes(vnName)
            );
            
            return hasCorrectDuration && matchedCategory?.[1] === vehicleCategory;
        });

        if (matchingConfig) {
            const rate = matchingConfig.getNumericValue();
            // console.log(`✅ Discount: ${vehicleCategory} + ${durationType} = ${rate * 100}%`);
            return rate;
        }

        return 0;
    }, [configs, durationType, vehicleCategory]);

    return {
        rentingRate: 1 - discountRate,
        discountRate,
        discountPercentage: discountRate * 100,
        durationType,
        loading,
        error,
    };
};

export const calculateRentalFees = (
    pricePerDay: number,
    rentalDays: number,
    rentingRate: number
) => {
    const baseRentalFee = pricePerDay * rentalDays;
    const totalRentalFee = Math.round(baseRentalFee * rentingRate);
    const averageRentalPrice = rentalDays > 0 ? Math.round(totalRentalFee / rentalDays) : 0;
    const discountAmount = baseRentalFee - totalRentalFee;

    return {
        baseRentalFee,
        totalRentalFee,
        averageRentalPrice,
        discountAmount,
    };
};