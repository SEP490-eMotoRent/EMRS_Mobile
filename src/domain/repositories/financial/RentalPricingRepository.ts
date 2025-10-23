import { RentalPricing } from '../../entities/financial/RentalPricing';

export interface RentalPricingRepository {
    create(pricing: RentalPricing): Promise<void>;
    delete(pricing: RentalPricing): Promise<void>;
    getAll(): Promise<RentalPricing[]>;
    getById(id: string): Promise<RentalPricing | null>;
    update(pricing: RentalPricing): Promise<void>;
}