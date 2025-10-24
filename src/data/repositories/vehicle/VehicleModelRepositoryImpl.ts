import { RentalPricing } from "../../../domain/entities/financial/RentalPricing";
import { VehicleModel } from "../../../domain/entities/vehicle/VehicleModel";
import { VehicleModelRepository } from "../../../domain/repositories/vehicle/VehicleModelRepository";
import { VehicleModelRemoteDataSource } from "../../datasources/interfaces/remote/vehicle/VehicleModelRemoteDataSource";
import { CreateVehicleModelRequest } from "../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../models/vehicle_model/VehicleModelResponse";

export class VehicleModelRepositoryImpl implements VehicleModelRepository {
    constructor(private remote: VehicleModelRemoteDataSource) {}

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
        await this.remote.create(request);
    }

    async delete(model: VehicleModel): Promise<void> {
        // If delete endpoint exists, implement it
        throw new Error("Delete not implemented for remote API");
    }

    async getAll(): Promise<VehicleModel[]> {
        const models = await this.remote.getAll();
        return models.map(model => this.mapToEntity(model));
    }

    async getDetail(id: string): Promise<VehicleModel | null> {
        const model = await this.remote.getDetail(id);
        return model ? this.mapToEntity(model) : null;
    }

    async update(model: VehicleModel): Promise<void> {
        // If update endpoint exists, implement it
        throw new Error("Update not implemented for remote API");
    }

    private mapToEntity(model: VehicleModelResponse): VehicleModel {
        // Use the rentalPrice from API response
        const rentalPricingId = `pricing_${model.vehicleModelId}`;

        // Create RentalPricing from API data
        const rentalPricing = new RentalPricing(
            rentalPricingId,
            model.rentalPrice,  // Use actual rental price from API
            model.rentalPrice * 0.1, // Calculate late fee as 10% of rental price
            []
        );

        // Map to VehicleModel entity
        return new VehicleModel(
            model.vehicleModelId,           // 1. id
            model.modelName,                // 2. modelName
            model.category,                 // 3. category
            model.batteryCapacityKwh,       // 4. batteryCapacityKwh
            model.maxRangeKm,               // 5. maxRangeKm
            0,                              // 6. maxSpeedKmh (not in API response)
            '',                             // 7. description (not in API response)
            rentalPricingId,                // 8. rentalPricingId
            rentalPricing,                  // 9. rentalPricing
            new Date(),                     // 10. createdAt
            null,                           // 11. updatedAt
            null,                           // 12. deletedAt
            false                           // 13. isDeleted
        );
    }
}