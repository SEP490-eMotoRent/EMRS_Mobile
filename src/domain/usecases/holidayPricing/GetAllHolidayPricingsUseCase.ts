import { HolidayPricing } from "../../entities/financial/HolidayPricing";
import { HolidayPricingRepository } from "../../repositories/financial/HolidayPricingRepository";

export class GetAllHolidayPricingsUseCase {
    private repository: HolidayPricingRepository;

    constructor(repository: HolidayPricingRepository) {
        this.repository = repository;
    }

    async execute(): Promise<HolidayPricing[]> {
        return this.repository.getAll();
    }
}