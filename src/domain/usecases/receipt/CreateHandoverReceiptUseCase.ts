import { ApiResponse } from "../../../core/network/APIResponse";
import { HandoverReceiptResponse } from "../../../data/models/receipt/HandoverReceiptResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export interface CreateHandoverReceiptUseCaseInput {
    notes: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    bookingId: string;
    vehicleFiles: string[];
    checkListFile: string;
}

export class CreateHandoverReceiptUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(input: CreateHandoverReceiptUseCaseInput): Promise<ApiResponse<HandoverReceiptResponse>> {
        return await this.receiptRepo.createHandoverReceipt(input);
    }
}
