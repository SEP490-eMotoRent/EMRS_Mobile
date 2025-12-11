import { ApiResponse } from "../../../core/network/APIResponse";
import { UpdateReturnReceiptResponse } from "../../../data/models/rentalReturn/UpdateReturnReceiptResponse";
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
    
    async execute(input: UpdateReturnReceiptUseCaseInput): Promise<ApiResponse<UpdateReturnReceiptResponse>> {
        return await this.rentalReturnRepository.updateReturnReceipt(input);
    }
}
