import { ApiResponse } from '../../../../../core/network/APIResponse';
import { BranchResponse } from '../../../../models/branch/BranchResponse';
import { CreateBranchRequest } from '../../../../models/branch/CreateBranchRequest';
import { UpdateBranchRequest } from '../../../../models/branch/UpdateBranchRequest';

export interface BranchRemoteDataSource {
    create(request: CreateBranchRequest): Promise<BranchResponse>;
    getAll(): Promise<BranchResponse[]>;
    getById(id: string): Promise<BranchResponse>;
    getByVehicleModelId(vehicleModelId: string): Promise<BranchResponse[]>;
    update(id: string, request: UpdateBranchRequest): Promise<BranchResponse>;
    delete(id: string): Promise<void>;
    getByLocation(latitude: number, longitude: number, radius: number): Promise<ApiResponse<BranchResponse[]>>;
}