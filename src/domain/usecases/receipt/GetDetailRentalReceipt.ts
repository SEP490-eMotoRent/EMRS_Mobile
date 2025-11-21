import { ApiResponse } from "../../../core/network/APIResponse";
import { RentalReceipt } from "../../entities/booking/RentalReceipt";
import { ReceiptRepository } from "../../repositories/receipt/ReceiptRepository";

export class GetDetailRentalReceiptUseCase {
    constructor(private receiptRepo: ReceiptRepository) {}
    
    async execute(rentalReceiptId: string): Promise<ApiResponse<RentalReceipt>> {
        return await this.receiptRepo.getDetailRentalReceipt(rentalReceiptId);
    }
}
