import { CreateVehicleModelRequest } from "../../../../models/vehicle_model/CreateVehicleModelRequest";
import { VehicleModelDetailResponse } from "../../../../models/vehicle_model/VehicleModelDetailResponse";
import { VehicleModelResponse } from "../../../../models/vehicle_model/VehicleModelResponse";

export interface VehicleModelRemoteDataSource {
    create(request: CreateVehicleModelRequest): Promise<VehicleModelResponse>;
    getAll(): Promise<VehicleModelResponse[]>;
    getDetail(id: string): Promise<VehicleModelDetailResponse | null>;
}