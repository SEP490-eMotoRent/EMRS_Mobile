import { ApiResponse } from "../../../core/network/APIResponse";
import { BookingChargingResponse } from "../../../data/models/charging/BookingChargingResponse";
import { ChargingRepository } from "../../repositories/charging/ChargingRepository";

export class GetChargingByLicensePlateUseCase {
  constructor(private chargingRepo: ChargingRepository) {}

  async execute(
    licensePlate: string
  ): Promise<ApiResponse<BookingChargingResponse>> {
    return await this.chargingRepo.getByLicensePlate(licensePlate);
  }
}
