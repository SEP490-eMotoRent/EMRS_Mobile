import { CreateVehicleRequest } from "../../../../models/vehicle/CreateVehicleRequest";
import { VehicleResponse } from "../../../../models/vehicle/VehicleResponse";


export interface VehicleLocalDataSource {
    create(request: CreateVehicleRequest): Promise<VehicleResponse>;
    getAll(): Promise<VehicleResponse[]>;
    getById(id: string): Promise<VehicleResponse | null>;
    getWithReferences(vehicleId: string, vehicleModelId: string): Promise<VehicleResponse | null>;
    update(id: string, vehicle: VehicleResponse): Promise<void>;
    delete(id: string): Promise<void>;
    }