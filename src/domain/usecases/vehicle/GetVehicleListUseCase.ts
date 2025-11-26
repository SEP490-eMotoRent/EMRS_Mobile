import { PaginatedVehicleResponse } from "../../../data/models/vehicle/PaginatedVehicle";
import { VehicleRepository } from "../../repositories/vehicle/VehicleRepository";

export class GetVehicleListUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(
    licensePlate?: string,
    color?: string,
    currentOdometerKm?: number,
    batteryHealthPercentage?: number,
    status?: string,
    branchId?: string,
    vehicleModelId?: string,
    pageSize: number = 10,
    pageNum: number = 1
  ): Promise<PaginatedVehicleResponse> {
    return await this.vehicleRepository.getVehicles(
      licensePlate,
      color,
      currentOdometerKm,
      batteryHealthPercentage,
      status,
      branchId,
      vehicleModelId,
      pageSize,
      pageNum
    );
  }
}
