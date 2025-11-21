import { VehicleTrackingResponse } from "../../../data/models/vehicle/VehicleTrackingResponse";
import { VehicleRepository } from "../../repositories/vehicle/VehicleRepository";

export class TrackingVehicleUseCase {
  constructor(private vehicleRepo: VehicleRepository) {}

  async execute(vehicleId: string): Promise<VehicleTrackingResponse> {
    return await this.vehicleRepo.getTracking(vehicleId);
  }
}
