import { HolidayPricing } from "../../entities/financial/HolidayPricing";
import { HolidayPricingRepository } from "../../repositories/financial/HolidayPricingRepository";

export class GetHolidayPricingByIdUseCase {
    private repository: HolidayPricingRepository;

    constructor(repository: HolidayPricingRepository) {
        this.repository = repository;
    }

    async execute(id: string): Promise<HolidayPricing> {
        return this.repository.getById(id);
    }
}