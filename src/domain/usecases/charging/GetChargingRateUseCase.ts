import { ApiResponse } from "../../../core/network/APIResponse";
import { GetChargingRateRequest } from "../../../data/models/charging/GetChargingRateRequest";
import { GetChargingRateResponse } from "../../../data/models/charging/GetChargingRateResponse";
import { ChargingRepository } from "../../repositories/charging/ChargingRepository";

export class GetChargingRateUseCase {
  constructor(private chargingRepo: ChargingRepository) {}

  async execute(
    request: GetChargingRateRequest
  ): Promise<ApiResponse<GetChargingRateResponse>> {
    return await this.chargingRepo.getChargingRate(request);
  }
}
