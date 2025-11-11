import { ApiResponse } from "../../../core/network/APIResponse";
import { BranchResponse } from "../../../data/models/branch/BranchResponse";

export interface BranchRepository {
    getByLocation(latitude: number, longitude: number, radius: number): Promise<ApiResponse<BranchResponse[]>>;
}