import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";
import { VehicleSwapResponse } from "../../../data/models/rentalReturn/VehicleSwapResponse";

export interface SwapVehicleReturnUseCaseInput {
    bookingId: string;
    returnReceiptId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: string;
}

export class SwapVehicleReturnUseCase {
    constructor(private rentalReturnRepository: RentalReturnRepository) {}
    
    async execute(input: SwapVehicleReturnUseCaseInput): Promise<ApiResponse<VehicleSwapResponse>> {
        return await this.rentalReturnRepository.swapVehicleReturn(input);
    }
}
