import { Branch } from "../../entities/operations/Branch";
import { BranchRepository } from "../../repositories/operations/BranchRepository";

export class GetBranchByIdUseCase {
    constructor(private branchRepository: BranchRepository) {}

    async execute(id: string): Promise<Branch | null> {
        return await this.branchRepository.getById(id);
    }
}