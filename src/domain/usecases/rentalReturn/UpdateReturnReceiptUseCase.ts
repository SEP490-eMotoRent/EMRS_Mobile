import { ApiResponse } from "../../../core/network/APIResponse";
import { CreateReceiptResponse } from "../../../data/models/rentalReturn/CreateReceiptResponse";
import { RentalReturnRepository } from "../../repositories/rentalReturn/RentalReturnRepository";

export interface UpdateReturnReceiptUseCaseInput {
    bookingId: string;
    rentalReceiptId: string;
    actualReturnDatetime: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    notes: string;
    returnImageUrls: string[];
    checkListImage: string;
}

export class UpdateReturnReceiptUseCase {
    constructor(private rentalReturnRepository: RentalReturnRepository) {}
    
    async execute(input: UpdateReturnReceiptUseCaseInput): Promise<ApiResponse<void>> {
        return await this.rentalReturnRepository.updateReturnReceipt(input);
    }
}
