import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { RentalPricingRepository } from "../../../domain/repositories/financial/RentalPricingRepository";
import { RentalPricingLocalDataSource } from "../../datasources/interfaces/local/financial/RentalPricingLocalDataSource";
import { CreateRentalPricingRequest } from "../../models/financial/rentalPricing/CreateRentalPricingRequest";
import { RentalPricingResponse } from "../../models/financial/rentalPricing/RentalPricingResponse";


export class RentalPricingRepositoryImpl implements RentalPricingRepository {
    constructor(private local: RentalPricingLocalDataSource) {}

    async create(pricing: RentalPricing): Promise<void> {
        const request: CreateRentalPricingRequest = {
        rentalPrice: pricing.rentalPrice,
        excessKmPrice: pricing.excessKmPrice
        };
        await this.local.create(request);
    }

    async delete(pricing: RentalPricing): Promise<void> {
        await this.local.delete(pricing.id);
    }

    async getAll(): Promise<RentalPricing[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getById(id: string): Promise<RentalPricing | null> {
        const model = await this.local.getById(id);
        return model ? this.mapToEntity(model) : null;
    }

    async update(pricing: RentalPricing): Promise<void> {
        const model: RentalPricingResponse = {
        id: pricing.id,
        rentalPrice: pricing.rentalPrice,
        excessKmPrice: pricing.excessKmPrice
        };
        await this.local.update(pricing.id, model);
    }

    private mapToEntity(model: RentalPricingResponse): RentalPricing {
        return new RentalPricing(
        model.id,
        model.rentalPrice,
        model.excessKmPrice,
        [],                     // vehicleModels
        new Date(),             // createdAt
        null,                   // updatedAt
        null,                   // deletedAt
        false                   // isDeleted
        );
    }
}