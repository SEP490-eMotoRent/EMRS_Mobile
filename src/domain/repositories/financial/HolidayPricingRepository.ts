import { HolidayPricing } from "../../entities/financial/HolidayPricing";

export interface HolidayPricingRepository {
    getAll(): Promise<HolidayPricing[]>;
    getById(id: string): Promise<HolidayPricing>;
}