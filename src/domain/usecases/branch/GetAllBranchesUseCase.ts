import { Branch } from "../../entities/operations/Branch";
import { BranchRepository } from "../../repositories/operations/BranchRepository";

export class GetAllBranchesUseCase {
    constructor(private branchRepository: BranchRepository) {}

    async execute(): Promise<Branch[]> {
        return await this.branchRepository.getAll();
    }
}