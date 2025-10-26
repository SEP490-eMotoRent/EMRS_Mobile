import { PaginatedVehicleResponse } from '../../../../../domain/entities/vehicle/PaginatedVehicle';
import { CreateVehicleRequest } from '../../../../models/vehicle/CreateVehicleRequest';
import { VehicleResponse } from '../../../../models/vehicle/VehicleResponse';

export interface VehicleRemoteDataSource {
    create(request: CreateVehicleRequest): Promise<VehicleResponse>;
    getAll(): Promise<VehicleResponse[]>;
    getById(id: string): Promise<VehicleResponse | null>;
    getWithReferences(vehicleId: string, vehicleModelId: string): Promise<VehicleResponse | null>;
    getVehicles(
        licensePlate: string,
        color: string,
        currentOdometerKm: number,
        batteryHealthPercentage: number,
        status: string,
        pageSize: number,
        pageNum: number
    ): Promise<PaginatedVehicleResponse>;
}