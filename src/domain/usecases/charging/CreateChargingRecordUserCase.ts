import { ApiResponse } from "../../../core/network/APIResponse";
import { CreateChargingRecordRequest } from "../../../data/models/charging/CreateChargingRecordRequest";
import { ChargingRepository } from "../../repositories/charging/ChargingRepository";

export class CreateChargingRecordUserCase {
  constructor(private chargingRepo: ChargingRepository) {}

  async execute(
    request: CreateChargingRecordRequest
  ): Promise<ApiResponse<any>> {
    return await this.chargingRepo.createChargingRecord(request);
  }
}
