import { CreateVehicleModelRequest } from "../../../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../../../models/vehicle_model/VehicleModelResponse";

export interface VehicleModelRemoteDataSource {
    create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse>;
    getAll(): Promise<VehicleModelResponse[]>;
    getById(id: string): Promise<VehicleModelResponse | null>;
}