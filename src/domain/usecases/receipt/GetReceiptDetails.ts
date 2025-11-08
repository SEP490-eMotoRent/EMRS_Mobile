import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalReceipt } from "../../entities/booking/RentalReceipt";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class GetReceiptDetailsUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(bookingId: string): Promise<ApiResponse<RentalReceipt>> {
        return await this.receiptRepo.getReceiptDetails(bookingId);
    }
}
