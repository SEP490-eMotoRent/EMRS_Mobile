import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelRepository } from "../../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelLocalDataSource } from "../../datasources/interfaces/local/vehicle/VehicleModelLocalDataSource";
import { CreateVehicleModelRequest } from "../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../models/vehicle_model/VehicleModelResponse";

export class VehicleModelRepositoryImpl implements VehicleModelRepository {
    constructor(private local: VehicleModelLocalDataSource) {}

    async create(model: VehicleModel): Promise<void> {
        const request: CreateVehicleModelRequest = {
        modelName: model.modelName,
        category: model.category,
        batteryCapacityKwh: model.batteryCapacityKwh,
        maxRangeKm: model.maxRangeKm,
        maxSpeedKmh: model.maxSpeedKmh,
        description: model.description,
        rentalPricingId: model.rentalPricingId
        };
        await this.local.create(request);
    }

    async delete(model: VehicleModel): Promise<void> {
        await this.local.delete(model.id);
    }

    async getAll(): Promise<VehicleModel[]> {
        const models = await this.local.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getById(id: string): Promise<VehicleModel | null> {
        const model = await this.local.getById(id);
        return model ? this.mapToEntity(model) : null;
    }

    async update(model: VehicleModel): Promise<void> {
        const response: VehicleModelResponse = {
        id: model.id,
        modelName: model.modelName,
        category: model.category,
        batteryCapacityKwh: model.batteryCapacityKwh,
        maxRangeKm: model.maxRangeKm,
        maxSpeedKmh: model.maxSpeedKmh,
        description: model.description
        };
        await this.local.update(model.id, response);
    }

    private mapToEntity(model: VehicleModelResponse): VehicleModel {
        // ✅ FIXED: HARDCODE rentalPricingId - NOT IN DTO
        const rentalPricingId = 'pricing_1';

        // Create MINIMAL RentalPricing
        const minimalRentalPricing = new RentalPricing(
        rentalPricingId,
        100,
        10,
        []
        );

        // EXACT 13 PARAMETER ORDER
        return new VehicleModel(
        model.id,                                    // 1. id
        model.modelName,                             // 2. modelName
        model.category,                              // 3. category
        model.batteryCapacityKwh,                    // 4. batteryCapacityKwh
        model.maxRangeKm,                            // 5. maxRangeKm
        model.maxSpeedKmh,                           // 6. maxSpeedKmh
        model.description,                           // 7. description
        rentalPricingId,                             // 8. rentalPricingId (HARDCODED)
        minimalRentalPricing,                        // 9. rentalPricing
        new Date(),                                  // 10. createdAt
        null,                                        // 11. updatedAt
        null,                                        // 12. deletedAt
        false                                        // 13. isDeleted
        );
    }
}