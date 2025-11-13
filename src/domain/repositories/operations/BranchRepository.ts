import { ApiResponse } from "../../../core/network/APIResponse";
import { BranchResponse } from "../../../data/models/branch/BranchResponse";
import { BranchWithVehicleCount } from "../../../data/repositories/operations/BranchRepositoryImpl";
import { Branch } from "../../entities/operations/Branch";

export interface BranchRepository {
    create(branch: Branch): Promise<void>;
    delete(branch: Branch): Promise<void>;
    getAll(): Promise<Branch[]>;
    getById(id: string): Promise<Branch | null>;
    getByVehicleModelId(vehicleModelId: string): Promise<BranchWithVehicleCount[]>;
    update(branch: Branch): Promise<void>;
    searchChargingStations(
        latitude: number,
        longitude: number,
        radius: number
    ): Promise<Branch[]>;
    getByLocation(
        latitude: number,
        longitude: number,
        radius: number
    ): Promise<Branch[]>;
}
