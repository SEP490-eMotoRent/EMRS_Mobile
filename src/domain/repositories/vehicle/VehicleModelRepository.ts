import { VehicleModel } from "../../entities/vehicle/VehicleModel";
import { VehicleModelResponse } from "../../../data/models/vehicle_model/VehicleModelResponse";

export interface VehicleModelRepository {
    create(model: VehicleModel): Promise<void>;
    delete(model: VehicleModel): Promise<void>;
    getAll(): Promise<VehicleModel[]>;
    getDetail(id: string): Promise<VehicleModel | null>;
    update(model: VehicleModel): Promise<void>;
    getAllRaw(): Promise<VehicleModelResponse[]>;
}