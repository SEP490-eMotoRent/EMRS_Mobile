import { ApiResponse } from "../../../core/network/APIResponse";
import { ChargingListResponse } from "../../../data/models/charging/ChargingListResponse";
import { ChargingRepository } from "../../repositories/charging/ChargingRepository";

export class GetChargingByBookingUseCase {
  constructor(private chargingRepo: ChargingRepository) {}

  async execute(
    bookingId: string
  ): Promise<ApiResponse<ChargingListResponse[]>> {
    return await this.chargingRepo.getByBookingId(bookingId);
  }
}
