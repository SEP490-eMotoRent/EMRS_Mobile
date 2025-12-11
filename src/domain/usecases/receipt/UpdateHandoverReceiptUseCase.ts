
import { ApiResponse } from "../../../core/network/APIResponse";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export interface UpdateHandoverReceiptUseCaseInput {
    id: string;
    startOdometerKm: number;
    startBatteryPercentage: number;
    vehicleFiles: string[];
    checkListFile: string;
    notes: string;
}

export class UpdateHandoverReceiptUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(input: UpdateHandoverReceiptUseCaseInput): Promise<ApiResponse<void>> {
        return await this.receiptRepo.updateHandoverReceipt(input);
    }
}
