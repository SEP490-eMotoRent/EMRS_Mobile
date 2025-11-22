import { HolidayPricingResponse } from "../../../../../models/financial/holidayPricing/HolidayPricingResponse";

export interface HolidayPricingRemoteDataSource {
    getAll(): Promise<HolidayPricingResponse[]>;
    getById(id: string): Promise<HolidayPricingResponse>;
}