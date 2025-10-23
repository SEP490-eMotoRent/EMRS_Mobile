import { CreateVehicleModelRequest } from "../../../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelResponse } from "../../../../models/vehicle_model/VehicleModelResponse";

export interface VehicleModelLocalDataSource {
    create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse>;
    getAll(): Promise<VehicleModelResponse[]>;
    getById(id: string): Promise<VehicleModelResponse | null>;
    update(id: string, model: VehicleModelResponse): Promise<void>;
    delete(id: string): Promise<void>;
}