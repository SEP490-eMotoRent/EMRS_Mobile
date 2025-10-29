import { PaginatedVehicleResponse } from '../../../data/models/vehicle/PaginatedVehicle';
import { Vehicle } from '../../entities/vehicle/Vehicle';

export interface VehicleRepository {
    create(vehicle: Vehicle): Promise<void>;
    delete(vehicle: Vehicle): Promise<void>;
    getAll(): Promise<Vehicle[]>;
    getById(id: string): Promise<Vehicle | null>;
    update(vehicle: Vehicle): Promise<void>;
    getWithReferences(vehicleId: string, vehicleModelId: string): Promise<Vehicle | null>;
    getVehicles(
        licensePlate: string,
        color: string,
        currentOdometerKm: number,
        batteryHealthPercentage: number,
        status: string,
        branchId: string,
        vehicleModelId: string,
        pageSize: number,
        pageNum: number
    ): Promise<PaginatedVehicleResponse>;
}