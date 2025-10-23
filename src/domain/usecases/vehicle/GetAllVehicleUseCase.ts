import { Vehicle } from '../../entities/vehicle/Vehicle';
import { VehicleRepository } from '../../repositories/vehicle/VehicleRepository';

/**
 * Use Case: Get All Vehicles
 * Business logic for fetching all vehicles
 */
export class GetAllVehiclesUseCase {
    constructor(private vehicleRepository: VehicleRepository) {}

    async execute(): Promise<Vehicle[]> {
        try {
            const vehicles = await this.vehicleRepository.getAll();
            
            // You can add business logic here, for example:
            // - Filter only available vehicles
            // - Sort by license plate
            // - Add additional validation
            
            return vehicles;
        } catch (error: any) {
            throw new Error(`Failed to fetch vehicles: ${error.message}`);
        }
    }
}

/**
 * Use Case: Get Available Vehicles Only
 */
export class GetAvailableVehiclesUseCase {
    constructor(private vehicleRepository: VehicleRepository) {}

    async execute(): Promise<Vehicle[]> {
        const vehicles = await this.vehicleRepository.getAll();
        return vehicles.filter(v => v.isAvailable());
    }
}

/**
 * Use Case: Get Vehicles Needing Maintenance
 */
export class GetVehiclesNeedingMaintenanceUseCase {
    constructor(private vehicleRepository: VehicleRepository) {}

    async execute(): Promise<Vehicle[]> {
        const vehicles = await this.vehicleRepository.getAll();
        return vehicles.filter(v => v.isMaintenanceDue());
    }
}