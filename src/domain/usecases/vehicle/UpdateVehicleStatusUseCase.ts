import { VehicleRepository } from "../../repositories/vehicle/VehicleRepository";

export class UpdateVehicleStatusUseCase {
    constructor(private vehicleRepo: VehicleRepository) {}
    
    async execute(vehicleId: string, status: string): Promise<void> {
        const vehicle = await this.vehicleRepo.getById(vehicleId);
        if (vehicle) {
        vehicle.status = status;
        await this.vehicleRepo.update(vehicle);
        }
    }
}