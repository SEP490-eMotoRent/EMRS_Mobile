import { ApiResponse } from "../../../core/network/APIResponse";
import { AdditionalFeesBreakdown } from "../../../data/models/rentalReturn/CreateReceiptRequest";
import { CreateReceiptResponse } from "../../../data/models/rentalReturn/CreateReceiptResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";

export interface RentalReturnCreateReceiptUseCaseInput {
    bookingId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: string;
    additionalFees: AdditionalFeesBreakdown[];
}

export class RentalReturnCreateReceiptUseCase {
    constructor(private rentalReturnRepository: RentalReturnRepository) {}
    
    async execute(input: RentalReturnCreateReceiptUseCaseInput): Promise<ApiResponse<CreateReceiptResponse>> {
        return await this.rentalReturnRepository.createReceipt(input);
    }
}
