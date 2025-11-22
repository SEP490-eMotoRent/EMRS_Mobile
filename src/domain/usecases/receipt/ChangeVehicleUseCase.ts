import { ApiResponse } from "../../../core/network/APIResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";
import { ChangeVehicleResponse } from "../../../data/models/receipt/ChangeVehicleResponse";

export interface ChangeVehicleUseCaseInput {
  notes: string;
  startOdometerKm: number;
  startBatteryPercentage: number;
  bookingId: string;
  vehicleFiles: string[];
  checkListFile: string;
  vehicleId: string;
}

export class ChangeVehicleUseCase {
  constructor(private receiptRepo: ReceiptRepository) {}

  async execute(input: ChangeVehicleUseCaseInput): Promise<ApiResponse<ChangeVehicleResponse>> {
    return await this.receiptRepo.changeVehicle(input);
  }
}
