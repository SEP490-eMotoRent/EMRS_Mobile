
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export interface UpdateReceiptUseCaseInput {
    rentalReceiptId: string;
    endOdometerKm: number;
    endBatteryPercentage: number;
    vehicleFiles: string[];
    checkListFile: string;
}

export class UpdateReceiptUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(input: UpdateReceiptUseCaseInput): Promise<void> {
        return await this.receiptRepo.updateRentalReceipt(input);
    }
}
