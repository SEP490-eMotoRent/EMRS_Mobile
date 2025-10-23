import { Vehicle } from "../../entities/vehicle/Vehicle";
import { VehicleRepository } from "../../repositories/vehicle/VehicleRepository";

export class SearchVehiclesUseCase {
    constructor(private vehicleRepo: VehicleRepository) {}
    
    async execute(): Promise<Vehicle[]> {
        return await this.vehicleRepo.getAll();  // ← REPO CALL
    }
}