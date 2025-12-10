
import { RenterResponse } from "../../../data/models/account/renter/RenterResponse";
import { RenterRepository } from "../../repositories/account/RenterRepository";

export class GetRenterByIdUseCase {
  constructor(private renterRepository: RenterRepository) {}

  async execute(renterId: string): Promise<RenterResponse> {
    try {
      const response = await this.renterRepository.getById(renterId);
      return response;
    } catch (error) {
      throw error;
    }
  }
}
