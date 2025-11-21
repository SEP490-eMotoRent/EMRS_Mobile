import { Vehicle } from "../../entities/vehicle/Vehicle";
import { VehicleRepository } from "../../repositories/vehicle/VehicleRepository";

export class GetVehicleDetailUseCase {
  constructor(private vehicleRepository: VehicleRepository) {}

  async execute(
    vehicleId: string
  ): Promise<Vehicle> {
    return await this.vehicleRepository.getById(vehicleId);
  }
}
