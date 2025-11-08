import { Branch } from "../../entities/operations/Branch";
import { BranchRepository } from "../../repositories/operations/BranchRepository";

export class GetBranchesByVehicleModelUseCase {
    constructor(private branchRepository: BranchRepository) {}

    async execute(vehicleModelId: string): Promise<Branch[]> {
        if (!vehicleModelId) {
            throw new Error("Vehicle Model ID is required");
        }
        return await this.branchRepository.getByVehicleModelId(vehicleModelId);
    }
}