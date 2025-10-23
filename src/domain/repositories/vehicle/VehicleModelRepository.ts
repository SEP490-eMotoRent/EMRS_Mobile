import { VehicleModel } from '../../entities/vehicle/VehicleModel';

export interface VehicleModelRepository {
    create(model: VehicleModel): Promise<void>;
    delete(model: VehicleModel): Promise<void>;
    getAll(): Promise<VehicleModel[]>;
    getById(id: string): Promise<VehicleModel | null>;
    update(model: VehicleModel): Promise<void>;
}