import { ApiResponse } from "../../../core/network/APIResponse";
import { SummaryResponse } from "../../../data/models/rentalReturn/SummaryResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";

export class RentalReturnSummaryUseCase {
  constructor(private rentalReturnRepository: RentalReturnRepository) {}

  async execute(bookingId: string): Promise<ApiResponse<SummaryResponse>> {
    return await this.rentalReturnRepository.getSummary(bookingId);
  }
}
