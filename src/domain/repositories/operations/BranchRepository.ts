import { Branch } from '../../entities/operations/Branch';

export interface BranchRepository {
    create(branch: Branch): Promise<void>;
    delete(branch: Branch): Promise<void>;
    getAll(): Promise<Branch[]>;
    getById(id: string): Promise<Branch | null>;
    update(branch: Branch): Promise<void>;
}