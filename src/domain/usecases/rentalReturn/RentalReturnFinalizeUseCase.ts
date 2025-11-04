import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";
import { FinalizeReturnRequest } from "../../../data/models/rentalReturn/FinalizeReturnRequest";
import { FinalizeReturnResponse } from "../../../data/models/rentalReturn/FinalizeReturnResponse";

export class RentalReturnFinalizeUseCase {
  constructor(private rentalReturnRepository: RentalReturnRepository) {}

  async execute(request: FinalizeReturnRequest): Promise<ApiResponse<FinalizeReturnResponse>> {
    return await this.rentalReturnRepository.finalizeReturn(request);
  }
}
