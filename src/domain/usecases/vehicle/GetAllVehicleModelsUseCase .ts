import { VehicleModel } from "../../entities/vehicle/VehicleModel";
import { VehicleModelRepository } from "../../repositories/vehicle/VehicleModelRepository";

/**
 * Use case for fetching all vehicle models
 * Replaces GetAllVehiclesUseCase for the new Vehicle Model API
 */
export class GetAllVehicleModelsUseCase {
    constructor(private repository: VehicleModelRepository) {}

    async execute(): Promise<VehicleModel[]> {
        try {
            const models = await this.repository.getAll();
            return models;
        } catch (error) {
            console.error('Error in GetAllVehicleModelsUseCase:', error);
            throw error;
        }
    }
}