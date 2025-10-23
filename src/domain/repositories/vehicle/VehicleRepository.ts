import { Vehicle } from '../../entities/vehicle/Vehicle';

export interface VehicleRepository {
    create(vehicle: Vehicle): Promise<void>;
    delete(vehicle: Vehicle): Promise<void>;
    getAll(): Promise<Vehicle[]>;
    getById(id: string): Promise<Vehicle | null>;
    update(vehicle: Vehicle): Promise<void>;
    getWithReferences(vehicleId: string, vehicleModelId: string): Promise<Vehicle | null>;
}