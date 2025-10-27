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
    
    async execute(input: CreateHandoverReceiptUseCaseInput): Promise<void> {
        await this.receiptRepo.createHandoverReceipt(input);
    }
}
