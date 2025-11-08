import { VehicleModelRepository } from "../../repositories/vehicle/VehicleModelRepository";
import { VehicleModelSearchResponse } from "../../../data/models/vehicle_model/VehicleModelSearchResponse";

export interface SearchVehiclesParams {
    startTime?: string;
    endTime?: string;
    branchId?: string;
}

export class SearchVehiclesUseCase {
    constructor(private vehicleModelRepository: VehicleModelRepository) {}

    async execute(params: SearchVehiclesParams = {}): Promise<VehicleModelSearchResponse[]> {
        const { startTime, endTime, branchId } = params;
        return await this.vehicleModelRepository.search(startTime, endTime, branchId);
    }
}