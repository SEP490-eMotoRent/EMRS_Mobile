import { BranchResponse } from "../../../../models/branch/BranchResponse";
import { CreateBranchRequest } from "../../../../models/branch/CreateBranchRequest";

export interface BranchLocalDataSource {
    create(request: CreateBranchRequest): Promise<BranchResponse>;
    getAll(): Promise<BranchResponse[]>;
    getById(id: string): Promise<BranchResponse | null>;
    update(id: string, branch: BranchResponse): Promise<void>;
    delete(id: string): Promise<void>;
}