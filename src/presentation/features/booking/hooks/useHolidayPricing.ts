import { useCallback, useEffect, useState } from "react";
import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";
import { container } from "../../../../core/di/ServiceContainer";

interface UseHolidayPricingResult {
    holidays: HolidayPricing[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useHolidayPricing = (): UseHolidayPricingResult => {
    const [holidays, setHolidays] = useState<HolidayPricing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchHolidays = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await container.financial.holidayPricing.getAll.execute();
            const activeHolidays = result.filter(h => h.isActive && !h.isDeleted);
            setHolidays(activeHolidays);
        } catch (err: any) {
            console.error("Failed to fetch holiday pricing:", err);
            setError(err.message || "Không thể tải thông tin ngày lễ");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHolidays();
    }, [fetchHolidays]);

    return {
        holidays,
        loading,
        error,
        refetch: fetchHolidays,
    };
};