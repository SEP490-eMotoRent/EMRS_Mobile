import { CreateVehicleRequest } from '../../../../models/vehicle/CreateVehicleRequest';
import { PaginatedVehicleResponse } from '../../../../models/vehicle/PaginatedVehicle';
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
        branchId: string,
        vehicleModelId: string,
        pageSize: number,
        pageNum: number
    ): Promise<PaginatedVehicleResponse>;
}