import { useCallback, useEffect, useState } from "react";
import sl from "../../../../core/di/InjectionContainer";
import { HolidayPricing } from "../../../../domain/entities/financial/HolidayPricing";
import { GetAllHolidayPricingsUseCase } from "../../../../domain/usecases/holidayPricing/GetAllHolidayPricingsUseCase";

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

    const getAllHolidayPricingsUseCase = sl.get<GetAllHolidayPricingsUseCase>(
        "GetAllHolidayPricingsUseCase"
    );

    const fetchHolidays = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await getAllHolidayPricingsUseCase.execute();
            // Only active holidays
            const activeHolidays = result.filter(h => h.isActive && !h.isDeleted);
            setHolidays(activeHolidays);
        } catch (err: any) {
            console.error("Failed to fetch holiday pricing:", err);
            setError(err.message || "Không thể tải thông tin ngày lễ");
        } finally {
            setLoading(false);
        }
    }, [getAllHolidayPricingsUseCase]);

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