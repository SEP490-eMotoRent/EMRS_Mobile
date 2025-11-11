
import { Branch } from "../../entities/operations/Branch";
import { BranchRepository } from "../../repositories/operations/BranchRepository";

export class GetBranchByLocationUseCase {
  constructor(private branchRepository: BranchRepository) {}

  async execute(
    latitude: number,
    longitude: number,
    radius: number
  ): Promise<Branch[]> {
    return await this.branchRepository.getByLocation(
      latitude,
      longitude,
      radius
    );
  }
}
