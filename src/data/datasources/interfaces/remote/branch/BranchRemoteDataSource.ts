import { BranchResponse } from '../../../../models/branch/BranchResponse';
import { CreateBranchRequest } from '../../../../models/branch/CreateBranchRequest';

export interface BranchRemoteDataSource {
    create(request: CreateBranchRequest): Promise<BranchResponse>;
    getAll(): Promise<BranchResponse[]>;
    getById(id: string): Promise<BranchResponse | null>;
}